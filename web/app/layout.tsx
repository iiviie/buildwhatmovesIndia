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
      "An independent Build What Moves India prototype for one synthetic defective-return journey.",
    applicationName: "Sahi Return",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title: "Sahi Return",
      description: "Understand, check, and respond to one synthetic defective-return notice.",
      images: [{ url: socialImage, width: 1200, height: 630, alt: "Sahi Return independent prototype" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sahi Return",
      description: "Understand, check, and respond to one synthetic defective-return notice.",
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#143d2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
