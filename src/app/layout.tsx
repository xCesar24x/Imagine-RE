import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Abril_Fatface } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const abrilFatface = Abril_Fatface({
  variable: "--font-abril",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bryan Viquez | Imagine Property Management & Real Estate",
  description: "Architect of Exclusivity in Costa Rica. High-end, sophisticated Property Management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} ${abrilFatface.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-jungle text-pearl">{children}</body>
    </html>
  );
}
