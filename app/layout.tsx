import type { Metadata } from "next";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./globals.css";
import { StoreProvider } from "@/components/StoreProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import MarketingScripts from "@/components/MarketingScripts";

export const metadata: Metadata = {
  title: "ASTRODISHA | Guidance • Healing • Divine Alignment",
  description:
    "Discover authentic gemstones, crystals, Rudraksha and Puja essentials chosen with clarity and purpose.",
  keywords: [
    "AstroDisha",
    "gemstones",
    "crystals",
    "Rudraksha",
    "puja essentials",
    "spiritual products"
  ],
  openGraph: {
    title: "ASTRODISHA",
    description:
      "Guidance • Healing • Divine Alignment",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MarketingScripts />
        <ThemeProvider>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
