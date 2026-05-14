import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = localFont({
  src: [
    {
      path: "../fonts/Fraunces-VariableFont.ttf",
      style: "normal",
    },
    {
      path: "../fonts/Fraunces-Italic-VariableFont.ttf",
      style: "italic",
    },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F5F1EA",
};

export const metadata: Metadata = {
  title: "FenceVision — AI Vizualizacija Ograda",
  description:
    "Učitajte fotografiju vašeg imanja, nacrtajte gde želite ogradu, i dobijte AI generisane fotorealistične prikaze. Drvene, metalne i betonske ograde.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FenceVision",
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  openGraph: {
    title: "FenceVision — AI Vizualizacija Ograda",
    description:
      "Učitajte fotografiju, nacrtajte liniju ograde, i dobijte fotorealistične AI prikaze.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FenceVision" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body>
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
