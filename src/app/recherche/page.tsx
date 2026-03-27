import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { searchArticles, truncateQuery } from '@/lib/search';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

interface Props {
  searchParams: Promise<{ q?: string; rubrique?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = truncateQuery(params.q || '');
  return {
    title: query ? `Recherche\u00a0: ${query} \u2014 Le Monde` : 'Recherche \u2014 Le Monde',
    description: `Résultats de recherche pour "${query}" sur Le Monde.`,
  };
}

export default async function RecherchePage({ searchParams }: Props) {
  const params = await searchParams;
  const rawQuery = params.q || '';
  const rubriqueFilter = params.rubrique || '';
  const page = Math.max(1, parseInt(params.page || '1', 10));

  const [categories, { articles, total, totalPages, currentPage, query }] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: { name: true, slug: true },
    }),
    searchArticles(rawQuery, rubriqueFilter, page),
  ]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1
        className="text-3xl font-bold mb-6 text-[#1D1D1B]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Recherche
      </h1>

      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={rawQuery} />
      </div>

      {/* Filtres par rubrique */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={`/recherche${rawQuery ? `?q=${encodeURIComponent(rawQuery)}` : ''}`}
          className={`px-3 py-1.5 text-sm border transition-colors font-sans ${
            !rubriqueFilter
              ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
              : 'border-[#D5D5D5] text-[#6B6B6B] hover:bg-[#F5F5F5]'
          }`}
        >
          Toutes
        </a>
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`/recherche?${rawQuery ? `q=${encodeURIComponent(rawQuery)}&` : ''}rubrique=${encodeURIComponent(c.slug)}`}
            className={`px-3 py-1.5 text-sm border transition-colors font-sans ${
              rubriqueFilter === c.slug
                ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                : 'border-[#D5D5D5] text-[#6B6B6B] hover:bg-[#F5F5F5]'
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>

      {/* Compteur résultats */}
      <p className="text-sm text-[#6B6B6B] mb-4 font-sans">
        {query ? (
          <>
            {total} résultat{total !== 1 ? 's' : ''} pour &laquo;{' '}
            <span className="font-semibold text-[#1D1D1B]">{query}</span> &raquo;
            {rubriqueFilter &&
              ` dans ${categories.find((c) => c.slug === rubriqueFilter)?.name ?? rubriqueFilter}`}
          </>
        ) : (
          <>
            {total} article{total !== 1 ? 's' : ''}
            {rubriqueFilter &&
              ` dans ${categories.find((c) => c.slug === rubriqueFilter)?.name ?? rubriqueFilter}`}
          </>
        )}
      </p>

      {articles.length === 0 ? (
        <div className="text-center py-16 text-[#6B6B6B]">
          <p className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {query
              ? `Aucun article trouvé pour « ${query} »`
              : 'Aucun article disponible'}
          </p>
          {query && (
            <p className="text-sm font-sans">
              Essayez avec d&apos;autres mots-clés ou modifiez les filtres.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="medium" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <a
                  href={`/recherche?${rawQuery ? `q=${encodeURIComponent(rawQuery)}&` : ''}${rubriqueFilter ? `rubrique=${encodeURIComponent(rubriqueFilter)}&` : ''}page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm border border-[#D5D5D5] hover:bg-[#F5F5F5] font-sans"
                >
                  ← Précédent
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/recherche?${rawQuery ? `q=${encodeURIComponent(rawQuery)}&` : ''}${rubriqueFilter ? `rubrique=${encodeURIComponent(rubriqueFilter)}&` : ''}page=${p}`}
                  className={`px-3 py-2 text-sm border font-sans ${
                    p === currentPage
                      ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                      : 'border-[#D5D5D5] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {p}
                </a>
              ))}
              {currentPage < totalPages && (
                <a
                  href={`/recherche?${rawQuery ? `q=${encodeURIComponent(rawQuery)}&` : ''}${rubriqueFilter ? `rubrique=${encodeURIComponent(rubriqueFilter)}&` : ''}page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm border border-[#D5D5D5] hover:bg-[#F5F5F5] font-sans"
                >
                  Suivant →
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
