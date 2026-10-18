import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Jost } from "next/font/google";
import type { CSSProperties } from "react";
import { weddingConfig } from "@/config/wedding";
import { getSiteUrl } from "@/lib/wedding";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const { meta, theme } = weddingConfig;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: meta.title,
  description: meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: meta.title,
    description: meta.description,
    locale: meta.locale.replace("-", "_"),
    siteName: meta.title,
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
  robots: meta.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: theme.colors.emerald,
  colorScheme: "light",
};

/** Theme colours from the config, exposed as CSS variables (see globals.css). */
const themeStyle = {
  "--wedding-ivory": theme.colors.ivory,
  "--wedding-gold": theme.colors.gold,
  "--wedding-emerald": theme.colors.emerald,
  "--wedding-sage": theme.colors.sage,
  "--wedding-beige": theme.colors.beige,
  "--wedding-text": theme.colors.text,
} as CSSProperties;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={meta.lang}
      style={themeStyle}
      className={`${cormorant.variable} ${jost.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Without JavaScript: skip the cover and show all content immediately. */}
        <noscript>
          <style>{`[data-cover]{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-emerald px-5 py-3 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
