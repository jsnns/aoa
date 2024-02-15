import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN || ""),
  title: "Eras of AI",
  description:
    "Explore a proposed framework for the eras of AI and predict when they will arrive.",
  openGraph: {
    images: ["/og?phase=digital-agi"],
    description:
      "Explore a proposed framework for the eras of AI and predict when they will arrive.",
    type: "website",
    url: new URL(process.env.DOMAIN || ""),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
