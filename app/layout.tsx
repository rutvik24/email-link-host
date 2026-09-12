import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { getSiteConfig } from "@/lib/site-config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const site = getSiteConfig();

export const metadata: Metadata = {
  title: site.brand,
  description: site.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col font-sans bg-[#060811] text-[#f8fafc]">{children}</body>
    </html>
  );
}

