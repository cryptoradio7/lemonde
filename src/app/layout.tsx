import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import PlausibleAnalytics from "@/components/PlausibleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Le Monde.fr - Actualités et Infos en France et dans le monde",
    template: "%s - Le Monde",
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
=======

export const metadata: Metadata = {
  title: "Le Monde — Actualités et Informations en continu",
  description:
    "Toute l'actualité en France et dans le monde. Politique, international, société, économie, culture, environnement, sport.",
  keywords: ["actualités", "france", "monde", "politique", "société"],
>>>>>>> b8af92a (Init : structure projet lemonde — Next.js 16, Prisma, Auth.js, Tailwind)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
<<<<<<< HEAD
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <PlausibleAnalytics />
      </body>
=======
      <body className="antialiased">{children}</body>
>>>>>>> b8af92a (Init : structure projet lemonde — Next.js 16, Prisma, Auth.js, Tailwind)
    </html>
  );
}
