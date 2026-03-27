import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Page introuvable',
};

async function getRecentArticles() {
  try {
    return await prisma.article.findMany({
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    });
  } catch {
    return [];
  }
}

export default async function NotFound() {
  const recentArticles = await getRecentArticles();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
      {/* Bloc 404 */}
      <div className="text-center border-b border-[#D5D5D5] pb-12 mb-12">
        <p className="text-sm font-sans font-bold uppercase tracking-widest text-[#E9322D] mb-4">
          Erreur 404
        </p>
        <h1
          className="text-4xl md:text-5xl font-bold text-[#1D1D1B] mb-6 leading-tight"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Page introuvable
        </h1>
        <p
          className="text-lg text-[#6B6B6B] mb-8 max-w-xl mx-auto"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
          Vérifiez l&apos;adresse saisie ou revenez à l&apos;accueil.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-[#1D1D1B] text-white font-sans text-sm font-semibold uppercase tracking-wider hover:bg-[#E9322D] transition-colors duration-200"
        >
          Retour à l&apos;accueil
        </Link>
      </div>

      {/* Articles récents */}
      {recentArticles.length > 0 && (
        <section aria-label="Articles récents">
          <h2 className="section-title mb-6">À lire également</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentArticles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="medium" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
