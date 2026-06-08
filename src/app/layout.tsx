import type { Metadata, Viewport } from "next";
import { DynamicFavicon } from "@/components/DynamicFavicon";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Koloroo",
  description: "Leap over the guesswork.",
  keywords: [
    "color picker",
    "HSL",
    "tonal zones",
    "UI design",
    "pastel colors",
    "neon colors",
    "design system",
    "css variables",
  ],
  authors: [{ name: "kchaengsiri" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <DynamicFavicon />
        <Analytics/>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
