import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

interface Props {
  searchParams: Promise<{ q?: string; rubrique?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q || '';
  return {
    title: query ? `Recherche : ${query}` : 'Recherche',
    description: `Résultats de recherche pour "${query}" sur Le Monde.`,
  };
}

const RESULTS_PER_PAGE = 12;

export default async function RecherchePage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const rubriqueFilter = params.rubrique || '';
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: { name: true, slug: true },
  });

  const results = query
    ? await prisma.article.findMany({
        where: {
          AND: [
            {
              OR: [
                { title: { contains: query } },
                { excerpt: { contains: query } },
              ],
            },
            rubriqueFilter
              ? { category: { slug: rubriqueFilter } }
              : {},
          ],
        },
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      })
    : [];

  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <h1
        className="text-3xl font-bold mb-6 text-[#1D1D1B]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Recherche
      </h1>

      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {/* Filtres par rubrique */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={`/recherche?q=${encodeURIComponent(query)}`}
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
            href={`/recherche?q=${encodeURIComponent(query)}&rubrique=${encodeURIComponent(c.slug)}`}
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
      {query && (
        <p className="text-sm text-[#6B6B6B] mb-4 font-sans">
          {results.length} résultat{results.length !== 1 ? 's' : ''} pour &laquo;{' '}
          <span className="font-semibold text-[#1D1D1B]">{query}</span> &raquo;
          {rubriqueFilter && ` dans ${categories.find(c => c.slug === rubriqueFilter)?.name ?? rubriqueFilter}`}
        </p>
      )}

      {!query ? (
        <div className="text-center py-16 text-[#6B6B6B]">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p
            className="text-lg"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Recherchez un article, un sujet, un auteur…
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 text-[#6B6B6B]">
          <p className="text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Aucun résultat trouvé
          </p>
          <p className="text-sm font-sans">
            Essayez avec d&apos;autres mots-clés ou modifiez les filtres.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.map((article) => (
              <ArticleCard key={article.id} article={article} variant="medium" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <a
                  href={`/recherche?q=${encodeURIComponent(query)}${rubriqueFilter ? `&rubrique=${encodeURIComponent(rubriqueFilter)}` : ''}&page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm border border-[#D5D5D5] hover:bg-[#F5F5F5] font-sans"
                >
                  ← Précédent
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/recherche?q=${encodeURIComponent(query)}${rubriqueFilter ? `&rubrique=${encodeURIComponent(rubriqueFilter)}` : ''}&page=${page}`}
                  className={`px-3 py-2 text-sm border font-sans ${
                    page === currentPage
                      ? 'bg-[#1D1D1B] text-white border-[#1D1D1B]'
                      : 'border-[#D5D5D5] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {page}
                </a>
              ))}
              {currentPage < totalPages && (
                <a
                  href={`/recherche?q=${encodeURIComponent(query)}${rubriqueFilter ? `&rubrique=${encodeURIComponent(rubriqueFilter)}` : ''}&page=${currentPage + 1}`}
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
