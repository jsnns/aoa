import { HeroGradient } from "@/components/HeroGradient";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOMAIN || ""),
  title: "Eras of AI",
  description:
    "Explore a framework for the eras of AI and predict when they will arrive.",
  openGraph: {
    images: ["/og?phase=digital-agi"],
    description:
      "Explore a framework for the eras of AI and predict when they will arrive.",
    type: "website",
    url: new URL(process.env.DOMAIN || ""),
  },
  twitter: {
    images: ["/og?phase=digital-agi"],
    title: "Eras of AI",
    description:
      "Explore a framework for the eras of AI and predict when they will arrive.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        defer
        data-domain="erasof.ai"
        src="https://plausible.io/js/script.js"
      />
      <body className={font.className}>
        {children}
        <Analytics />
        <SpeedInsights />
        <div className="fixed top-0 bottom-0 left-0 right-0 -z-10">
          <HeroGradient colors={["#000", "#0a0a0a", "#1f1f1f", "#242424"]} />
        </div>
      </body>
    </html>
  );
}
