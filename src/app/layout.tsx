import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You — 14.02.2026",
  description: "I built this for you because I believe in love, not just Valentine's Day.",
  keywords: "Valentine, Love letter, Romantic, Vinyl playlist",
  openGraph: {
    title: "For You — 14.02.2026",
    description: "I built this for you because I believe in love, not just Valentine's Day.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "For You — 14.02.2026",
    description: "I built this for you because I believe in love, not just Valentine's Day.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
