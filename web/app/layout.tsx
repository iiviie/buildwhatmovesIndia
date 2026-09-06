import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const socialImage = new URL("/og.png", origin).toString();

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Sahi Return",
      template: "%s | Sahi Return",
    },
    description:
      "An independent Build What Moves India prototype that lets a salaried citizen file their own income tax return.",
    applicationName: "Sahi Return",
    /* An inline SVG mark rather than a bitmap: it is under 300 bytes, it is the
       only image the shell needs, and without it every page load logs a 404. */
    icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title: "Sahi Return",
      description: "File a salaried income tax return yourself, with every figure shown beside its source.",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Sahi Return independent prototype" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sahi Return",
      description: "File a salaried income tax return yourself, with every figure shown beside its source.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* The service opens on paper whatever the device says, so the browser
     furniture is told the same thing rather than flashing another colour
     around it. */
  themeColor: "#f2eee3",
};

/* Applies the saved appearance, text size, and language before first paint so a
   reader never sees a flash of the wrong theme or a resize. A reader who has
   chosen nothing gets paper, which is what the service opens on. */
const BOOT = `try{var r=document.documentElement;var p=JSON.parse(localStorage.getItem("sahi-return-prefs-v1")||"{}");var t=p.theme||"paper";r.dataset.theme=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;if(p.textScale)r.dataset.text=p.textScale;var d=JSON.parse(localStorage.getItem("sahi-return-filing-draft-v1")||"{}");var l=["en","hi","bn","ta","mr","te","ur"].includes(d.language)?d.language:"en";r.lang=l;r.dir=l==="ur"?"rtl":"ltr";}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {children}
      </body>
    </html>
  );
}
