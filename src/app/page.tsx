import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      articles: {
        orderBy: { publishedAt: "desc" },
        take: 5,
      },
    },
  });

  const heroArticle = await prisma.article.findFirst({
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      {/* Hero */}
      {heroArticle && (
        <section className="py-8 border-b border-[#D5D5D5]">
          <Link href={`/article/${heroArticle.slug}`}>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
              {heroArticle.title}
            </h1>
          </Link>
          <p className="mt-3 text-lg text-[#6B6B6B]" style={{ fontFamily: 'Georgia, serif' }}>
            {heroArticle.excerpt}
          </p>
          <p className="mt-2 text-sm text-[#6B6B6B]" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
            {heroArticle.author} &bull;{" "}
            {new Date(heroArticle.publishedAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </section>
      )}

      {/* Sections par catégorie */}
      {categories.map((category) => (
        <section key={category.id} className="py-6 border-b border-[#D5D5D5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#E9322D]" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              {category.name}
            </h2>
            <Link
              href={`/rubrique/${category.slug}`}
              className="text-xs text-[#6B6B6B] hover:text-[#E9322D] transition-colors"
              style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.articles.map((article) => (
              <article key={article.id}>
                <Link href={`/article/${article.slug}`}>
                  <h3 className="text-lg font-bold leading-snug hover:underline" style={{ fontFamily: 'Georgia, serif' }}>
                    {article.title}
                  </h3>
                </Link>
                <p className="mt-1 text-sm text-[#6B6B6B] line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
