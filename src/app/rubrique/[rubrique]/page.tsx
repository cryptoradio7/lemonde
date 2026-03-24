import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticlesByRubrique, getAllRubriques } from '@/data/articles';
import { slugify, findRubriqueBySlug } from '@/lib/utils';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  params: { rubrique: string };
  searchParams: { page?: string };
}

const ARTICLES_PER_PAGE = 12;

export async function generateStaticParams() {
  return getAllRubriques().map((r) => ({
    rubrique: slugify(r),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const displayName = findRubriqueBySlug(params.rubrique, getAllRubriques());
  if (!displayName) return { title: 'Rubrique non trouvée' };

  return {
    title: `${displayName} - Toute l'actualité`,
    description: `Retrouvez toute l'actualité ${displayName} sur Le Monde.`,
    openGraph: {
      title: `${displayName} - Le Monde`,
      description: `Retrouvez toute l'actualité ${displayName} sur Le Monde.`,
    },
  };
}

export default function RubriquePage({ params, searchParams }: Props) {
  const rubriques = getAllRubriques();
  const displayName = findRubriqueBySlug(params.rubrique, rubriques);

  if (!displayName) {
    notFound();
  }

  const allArticles = getArticlesByRubrique(displayName);
  const currentPage = parseInt(searchParams.page || '1', 10);
  const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = allArticles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );
  const rubriqueSlug = slugify(displayName);

  return (
    <div className="max-w-content mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: displayName },
        ]}
      />

      <h1 className="font-serif text-3xl md:text-4xl font-bold mt-4 mb-2">{displayName}</h1>
      <p className="text-lm-gray mb-8">
        Retrouvez toute l&apos;actualité {displayName} en continu sur Le Monde.
      </p>

      {paginatedArticles.length === 0 ? (
        <p className="text-lm-gray text-center py-12">Aucun article dans cette rubrique.</p>
      ) : (
        <>
          {currentPage === 1 && paginatedArticles.length > 0 && (
            <div className="mb-8">
              <ArticleCard article={paginatedArticles[0]} variant="large" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.slice(currentPage === 1 ? 1 : 0).map((article) => (
              <ArticleCard key={article.id} article={article} variant="medium" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <a
                  href={`/rubrique/${rubriqueSlug}?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm border border-lm-gray-border hover:bg-lm-gray-light"
                >
                  ← Précédent
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <a
                  key={page}
                  href={`/rubrique/${rubriqueSlug}?page=${page}`}
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
                  href={`/rubrique/${rubriqueSlug}?page=${currentPage + 1}`}
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
