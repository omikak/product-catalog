import type { Metadata } from "next";
import { Merriweather, Space_Grotesk } from "next/font/google";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space"
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merri"
});

export const metadata: Metadata = {
  title: "E-Commerce Product Catalog",
  description: "Nested schema catalog with reviews, variants, analytics and stock management"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${merriweather.variable} font-[var(--font-space)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
