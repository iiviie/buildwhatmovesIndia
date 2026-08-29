import { describe, expect, it } from "vitest";
import {
  A4_HEIGHT_PT,
  A4_WIDTH_PT,
  fitOnPage,
  formatBytes,
  jpegToPdf,
} from "../app/file-tools";

const latin1 = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

/* A stand-in for a baseline JPEG. The writer embeds the bytes verbatim, so the
   contents only need to be recognisable, not decodable. */
const fakeJpeg = () => {
  const body = new Uint8Array(512);
  body[0] = 0xff;
  body[1] = 0xd8;
  for (let i = 2; i < body.length - 2; i++) body[i] = i % 251;
  body[body.length - 2] = 0xff;
  body[body.length - 1] = 0xd9;
  return body;
};

describe("fitting an image on the page", () => {
  it("keeps the aspect ratio and centres the result", () => {
    const box = fitOnPage(1200, 1600);
    expect(box.width / box.height).toBeCloseTo(1200 / 1600, 5);
    expect(box.x * 2 + box.width).toBeCloseTo(A4_WIDTH_PT, 3);
    expect(box.y * 2 + box.height).toBeCloseTo(A4_HEIGHT_PT, 3);
  });

  it("never spills past the margin, in either orientation", () => {
    for (const [w, h] of [
      [4000, 3000],
      [3000, 4000],
      [1000, 1000],
      [8000, 400],
    ]) {
      const box = fitOnPage(w, h);
      expect(box.x).toBeGreaterThanOrEqual(24 - 0.001);
      expect(box.y).toBeGreaterThanOrEqual(24 - 0.001);
      expect(box.x + box.width).toBeLessThanOrEqual(A4_WIDTH_PT - 24 + 0.001);
      expect(box.y + box.height).toBeLessThanOrEqual(A4_HEIGHT_PT - 24 + 0.001);
    }
  });
});

describe("wrapping a JPEG in a PDF", () => {
  const jpeg = fakeJpeg();
  const pdf = jpegToPdf(jpeg, 1200, 1600, "Demo Form 16");
  const text = latin1(pdf);

  it("writes a well-formed PDF envelope", () => {
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text.trimEnd().endsWith("%%EOF")).toBe(true);
    expect(text).toContain("/Type /Catalog");
    expect(text).toContain("/Type /Page");
    expect(text).toContain("/MediaBox [0 0 595.28 841.89]");
  });

  it("embeds the image without re-encoding it", () => {
    expect(text).toContain("/Filter /DCTDecode");
    expect(text).toContain(`/Length ${jpeg.length}`);
    /* The original bytes survive intact, which is what keeps the wrapper cheap. */
    const start = text.indexOf("stream\n", text.indexOf("/DCTDecode")) + 7;
    expect(Array.from(pdf.slice(start, start + jpeg.length))).toEqual(
      Array.from(jpeg),
    );
    expect(pdf.length - jpeg.length).toBeLessThan(2048);
  });

  it("writes cross-reference offsets that land on their objects", () => {
    const xrefAt = text.lastIndexOf("xref\n0 7\n");
    expect(xrefAt).toBeGreaterThan(0);

    const rows = text
      .slice(xrefAt + "xref\n0 7\n".length)
      .split("\n")
      .slice(0, 7)
      .filter((row) => row.endsWith(" n "));

    expect(rows).toHaveLength(6);
    rows.forEach((row, index) => {
      const offset = Number.parseInt(row.slice(0, 10), 10);
      expect(text.slice(offset, offset + 7)).toBe(`${index + 1} 0 obj`);
    });
  });

  it("declares a startxref that points at the table", () => {
    const declared = Number.parseInt(
      text.slice(text.lastIndexOf("startxref\n") + 10),
      10,
    );
    expect(text.slice(declared, declared + 4)).toBe("xref");
  });

  it("escapes a title that would otherwise break the syntax", () => {
    const risky = jpegToPdf(jpeg, 10, 10, "bad(title)\nwith\\parens");
    const riskyText = latin1(risky);
    const title = riskyText.slice(
      riskyText.indexOf("/Title (") + 8,
      riskyText.indexOf(") /Producer"),
    );
    expect(title).not.toMatch(/[\\()\r\n]/);
  });
});

describe("byte sizes for citizens", () => {
  it("reads in the units an upload limit is written in", () => {
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB");
  });
});
