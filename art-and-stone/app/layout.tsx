import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { BandeauInfos, BandeauPrix } from "@/components/layout/Bandeaux";
import { EnTete } from "@/components/layout/EnTete";
import { PiedDePage } from "@/components/layout/PiedDePage";
import { PanierProvider } from "@/components/panier/PanierProvider";
import { SITE } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "ART & STONE — Pierre naturelle livrée chez vous",
    template: "%s | ART & STONE",
  },
  description: SITE.description,
  applicationName: "ART & STONE",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ART & STONE",
    title: "ART & STONE — Pierre naturelle livrée chez vous",
    description: SITE.description,
    images: [{ url: SITE.imagePartage, alt: "Réalisation en pierre naturelle ART & STONE" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        {/* Active les animations d'apparition seulement si JavaScript est disponible */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only z-50 bg-anthracite px-4 py-3 text-creme focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Aller au contenu
        </a>
        <PanierProvider>
          <BandeauPrix />
          <BandeauInfos />
          <EnTete />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <PiedDePage />
        </PanierProvider>
      </body>
    </html>
  );
}
