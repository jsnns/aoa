import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN || ""),
  title: "Eras of AI",
  description:
    "Explore a proposed framework for the eras of AI and predict when they will arrive.",
  openGraph: {
    images: ["/og?phase=digital-agi"],
    description:
      "Explore a proposed framework for the eras of AI and predict when they will arrive.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
