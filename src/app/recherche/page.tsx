import { Metadata } from 'next';
import { searchArticles, getAllRubriques } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';
import SearchBar from '@/components/SearchBar';

interface Props {
  searchParams: { q?: string; rubrique?: string; page?: string };
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const query = searchParams.q || '';
  return {
    title: query ? `Recherche : ${query}` : 'Recherche',
    description: `Résultats de recherche pour "${query}" sur Le Monde.`,
  };
}

const RESULTS_PER_PAGE = 12;

export default function RecherchePage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const rubriqueFilter = searchParams.rubrique || '';
  const currentPage = parseInt(searchParams.page || '1', 10);
  const rubriques = getAllRubriques();

  const results = query ? searchArticles(query, rubriqueFilter || undefined) : [];
  const totalPages = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  return (
    <div className="max-w-content mx-auto px-4 py-6">
      <h1 className="font-serif text-3xl font-bold mb-6">Recherche</h1>

      <div className="max-w-xl mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {/* Filtres par rubrique */}
      <div className="flex flex-wrap gap-2 mb-6">
        <a
          href={`/recherche?q=${encodeURIComponent(query)}`}
          className={`px-3 py-1.5 text-sm border rounded-sm transition-colors ${
            !rubriqueFilter
              ? 'bg-lm-dark text-white border-lm-dark'
              : 'border-lm-gray-border text-lm-gray hover:bg-lm-gray-light'
          }`}
        >
          Toutes
        </a>
        {rubriques.map((r) => (
          <a
            key={r}
            href={`/recherche?q=${encodeURIComponent(query)}&rubrique=${encodeURIComponent(r)}`}
            className={`px-3 py-1.5 text-sm border rounded-sm transition-colors ${
              rubriqueFilter === r
                ? 'bg-lm-dark text-white border-lm-dark'
                : 'border-lm-gray-border text-lm-gray hover:bg-lm-gray-light'
            }`}
          >
            {r}
          </a>
        ))}
      </div>

      {/* Résultats */}
      {query && (
        <p className="text-sm text-lm-gray mb-4">
          {results.length} résultat{results.length !== 1 ? 's' : ''} pour &laquo;{' '}
          <span className="font-semibold text-lm-dark">{query}</span> &raquo;
          {rubriqueFilter && ` dans ${rubriqueFilter}`}
        </p>
      )}

      {!query ? (
        <div className="text-center py-16 text-lm-gray">
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
          <p className="text-lg font-serif">Recherchez un article, un sujet, un auteur...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 text-lm-gray">
          <p className="text-lg font-serif mb-2">Aucun résultat trouvé</p>
          <p className="text-sm">Essayez avec d&apos;autres mots-clés ou modifiez les filtres.</p>
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
                  className="px-4 py-2 text-sm border border-lm-gray-border hover:bg-lm-gray-light"
                >
                  ← Précédent
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/recherche?q=${encodeURIComponent(query)}${rubriqueFilter ? `&rubrique=${encodeURIComponent(rubriqueFilter)}` : ''}&page=${page}`}
                  className={`px-3 py-2 text-sm border ${
                    page === currentPage
                      ? 'bg-lm-dark text-white border-lm-dark'
                      : 'border-lm-gray-border hover:bg-lm-gray-light'
                  }`}
                >
                  {page}
                </a>
              ))}
              {currentPage < totalPages && (
                <a
                  href={`/recherche?q=${encodeURIComponent(query)}${rubriqueFilter ? `&rubrique=${encodeURIComponent(rubriqueFilter)}` : ''}&page=${currentPage + 1}`}
                  className="px-4 py-2 text-sm border border-lm-gray-border hover:bg-lm-gray-light"
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
