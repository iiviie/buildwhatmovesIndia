/* Turning a phone photo into an acceptable upload, on the device.
 *
 * Government upload fields routinely demand a PDF under a few megabytes. A
 * citizen photographing a document on a phone gets a 4 MB JPEG, and the usual
 * advice is to find a free online converter — which means handing a tax
 * document to an unknown third party. Everything here runs in the browser: no
 * upload, no service, no network call.
 *
 * The PDF writer takes bytes and dimensions rather than a canvas, so it can be
 * tested without a rendering context. */

export const A4_WIDTH_PT = 595.28;
export const A4_HEIGHT_PT = 841.89;

const latin1 = (text: string) => {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i++) out[i] = text.charCodeAt(i) & 0xff;
  return out;
};

/* Fit an image inside the page with a margin, keeping its aspect ratio. */
export const fitOnPage = (
  imageWidth: number,
  imageHeight: number,
  pageWidth = A4_WIDTH_PT,
  pageHeight = A4_HEIGHT_PT,
  margin = 24,
) => {
  const maxW = pageWidth - margin * 2;
  const maxH = pageHeight - margin * 2;
  const scale = Math.min(maxW / imageWidth, maxH / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return {
    width,
    height,
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
  };
};

/* A single-page PDF wrapping one baseline JPEG. The JPEG is embedded as-is
   under the DCTDecode filter, so wrapping costs a few hundred bytes rather
   than re-encoding the picture. */
export const jpegToPdf = (
  jpeg: Uint8Array,
  imageWidth: number,
  imageHeight: number,
  title = "Document",
): Uint8Array => {
  const box = fitOnPage(imageWidth, imageHeight);
  const pageW = A4_WIDTH_PT.toFixed(2);
  const pageH = A4_HEIGHT_PT.toFixed(2);

  const content =
    `q\n${box.width.toFixed(2)} 0 0 ${box.height.toFixed(2)} ` +
    `${box.x.toFixed(2)} ${box.y.toFixed(2)} cm\n/Im0 Do\nQ\n`;

  const safeTitle = title.replace(/[\\()\r\n]/g, " ").slice(0, 120);

  const parts: (string | Uint8Array)[] = [];
  const offsets: number[] = [];
  let length = 0;

  const push = (chunk: string | Uint8Array) => {
    parts.push(chunk);
    length += typeof chunk === "string" ? chunk.length : chunk.length;
  };

  const startObject = () => offsets.push(length);

  push("%PDF-1.4\n");
  /* A binary comment marks the file as binary for tools that sniff it. */
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  startObject();
  push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  startObject();
  push("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  startObject();
  push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] ` +
      `/Resources << /XObject << /Im0 5 0 R >> /ProcSet [/PDF /ImageC] >> ` +
      `/Contents 4 0 R >>\nendobj\n`,
  );

  startObject();
  push(`4 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

  startObject();
  push(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidth} ` +
      `/Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 ` +
      `/Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  push(jpeg);
  push("\nendstream\nendobj\n");

  startObject();
  push(
    `6 0 obj\n<< /Title (${safeTitle}) /Producer (Sahi Return prototype) >>\nendobj\n`,
  );

  const xrefOffset = length;
  let xref = "xref\n0 7\n0000000000 65535 f \n";
  for (const offset of offsets) {
    xref += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  push(xref);
  push(
    `trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  );

  const out = new Uint8Array(length);
  let at = 0;
  for (const chunk of parts) {
    const bytes = typeof chunk === "string" ? latin1(chunk) : chunk;
    out.set(bytes, at);
    at += bytes.length;
  }
  return out;
};

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const isImage = (file: File) => IMAGE_TYPES.includes(file.type);

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export type PreparedFile = {
  blob: Blob;
  name: string;
  bytes: number;
  originalBytes: number;
  converted: boolean;
  compressed: boolean;
  width: number;
  height: number;
};

type Drawable = { width: number; height: number };

const drawToJpeg = async (
  source: CanvasImageSource & Drawable,
  scale: number,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> => {
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("no-canvas");
  /* A white ground, so a transparent PNG does not become a black rectangle. */
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(source, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("no-blob");
  return { blob, width, height };
};

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode-failed"));
    };
    image.src = url;
  });

/* Step the quality down first, then the pixel dimensions, stopping as soon as
   the file fits. Readability matters more than hitting the limit exactly, so
   the search is coarse and ends early. */
const QUALITY_STEPS = [0.82, 0.7, 0.58, 0.45];
const SCALE_STEPS = [1, 0.8, 0.62, 0.48, 0.36];

export const prepareDocument = async (
  file: File,
  maxBytes: number,
  wantPdf = true,
): Promise<PreparedFile> => {
  const baseName = file.name.replace(/\.[^.]+$/, "") || "document";

  if (!isImage(file)) {
    return {
      blob: file,
      name: file.name,
      bytes: file.size,
      originalBytes: file.size,
      converted: false,
      compressed: false,
      width: 0,
      height: 0,
    };
  }

  const image = await loadImage(file);

  let best = await drawToJpeg(image, 1, QUALITY_STEPS[0]);
  /* The wrapper adds a few hundred bytes, so aim slightly under the limit. */
  const target = wantPdf ? maxBytes - 2048 : maxBytes;

  outer: for (const scale of SCALE_STEPS) {
    for (const quality of QUALITY_STEPS) {
      const attempt = await drawToJpeg(image, scale, quality);
      best = attempt;
      if (attempt.blob.size <= target) break outer;
    }
  }

  const jpegBytes = new Uint8Array(await best.blob.arrayBuffer());

  if (!wantPdf) {
    return {
      blob: best.blob,
      name: `${baseName}.jpg`,
      bytes: best.blob.size,
      originalBytes: file.size,
      converted: file.type !== "image/jpeg",
      compressed: best.blob.size < file.size,
      width: best.width,
      height: best.height,
    };
  }

  const pdf = jpegToPdf(jpegBytes, best.width, best.height, baseName);
  const blob = new Blob([pdf as unknown as BlobPart], { type: "application/pdf" });

  return {
    blob,
    name: `${baseName}.pdf`,
    bytes: blob.size,
    originalBytes: file.size,
    converted: true,
    compressed: best.blob.size < file.size,
    width: best.width,
    height: best.height,
  };
};
