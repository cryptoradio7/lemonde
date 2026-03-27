import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/HeroSection";
import LiveFeed from "@/components/home/LiveFeed";
import CategorySection from "@/components/home/CategorySection";
import { getLiveFeedArticles } from "@/lib/liveFeed";

export const metadata: Metadata = {
  title:
    "Le Monde.fr \u2014 Actualit\u00e9s et Infos en France et dans le monde",
  description:
    "Le Monde.fr - 1er site d\u2019information fran\u00e7ais. Actu en continu, archives gratuites, galeries photo, vid\u00e9o. Retrouvez l\u2019actualit\u00e9 politique, internationale, \u00e9conomique, culturelle, sportive et scientifique.",
};

export default async function HomePage() {
  // Article à la une : le plus récent
  const heroArticle = await prisma.article.findFirst({
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  // DB vide
  if (!heroArticle) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <p
          className="text-[#6B6B6B] text-lg"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Aucun article disponible
        </p>
      </div>
    );
  }

  // 3 articles sidebar : les suivants après le hero
  const sidebarArticles = await prisma.article.findMany({
    where: { id: { not: heroArticle.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });

  // Fil "En continu" : 10 derniers articles par date de publication puis création
  const liveFeedArticles = await getLiveFeedArticles();

  // Rubriques avec leurs articles (ordre défini par Category.order)
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      articles: {
        orderBy: { publishedAt: "desc" },
        take: 3,
      },
    },
  });

  // Filtrer les rubriques sans articles
  const categoriesWithArticles = categories.filter(
    (c) => c.articles.length > 0
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <HeroSection
        mainArticle={heroArticle}
        sidebarArticles={sidebarArticles}
      />
      <LiveFeed articles={liveFeedArticles} />
      {categoriesWithArticles.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}
