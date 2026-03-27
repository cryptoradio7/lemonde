import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "Le Monde.fr \u2014 Actualités et Infos en France et dans le monde",
    template: "%s \u2014 Le Monde",
  },
  description:
    "Le Monde.fr - 1er site d'information français. Actu en continu, archives gratuites, galeries photo, vidéo. Retrouvez l'actualité politique, internationale, économique, culturelle, sportive et scientifique.",
  keywords: [
    "actualités",
    "info",
    "France",
    "monde",
    "politique",
    "économie",
    "culture",
    "sport",
    "sciences",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Le Monde",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
