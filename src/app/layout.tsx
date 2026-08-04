import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Bryan Viquez | Imagine Property Management & Real Estate",
  description: "Architect of Exclusivity in Costa Rica. High-end, sophisticated Property Management.",
  icons: {
    icon: "/images/imagine-logo.jpg",
  },
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
      <head>
        {/* Ruta Digital Shield: Basic CSP & Security Meta Tags */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      </head>
      <body className="min-h-full flex flex-col bg-jungle text-pearl">{children}</body>
    </html>
  );
}
