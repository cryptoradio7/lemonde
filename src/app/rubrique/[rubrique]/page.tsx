import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import Pagination from '@/components/Pagination';
import {
  getCategoryBySlug,
  countCategoryArticles,
  getCategoryArticles,
  getAllCategorySlugs,
  ARTICLES_PER_PAGE,
} from '@/lib/categories';
import { slugify } from '@/lib/utils';

interface Props {
  params: Promise<{ rubrique: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((c) => ({ rubrique: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubrique } = await params;
  const normalizedSlug = slugify(rubrique);
  const category = await getCategoryBySlug(normalizedSlug);
  if (!category) return { title: 'Rubrique non trouvée — Le Monde' };
  return {
    title: `${category.name} — Le Monde`,
    description: `Retrouvez toute l'actualité ${category.name} sur Le Monde.`,
    openGraph: {
      title: `${category.name} — Le Monde`,
      description: `Retrouvez toute l'actualité ${category.name} sur Le Monde.`,
    },
  };
}

export default async function RubriquePage({ params, searchParams }: Props) {
  const { rubrique } = await params;
  const { page } = await searchParams;

  // Normalisation slug accentué : société → societe
  const normalizedSlug = slugify(rubrique);
  if (normalizedSlug !== rubrique) {
    const queryStr = page && page !== '1' ? `?page=${page}` : '';
    redirect(`/rubrique/${normalizedSlug}${queryStr}`);
  }

  const category = await getCategoryBySlug(normalizedSlug);
  if (!category) notFound();

  const totalCount = await countCategoryArticles(category.id);
  const totalPages = Math.max(1, Math.ceil(totalCount / ARTICLES_PER_PAGE));
  const rawPage = parseInt(page || '1', 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Redirect si page demandée dépasse le total
  if (currentPage > totalPages) {
    redirect(`/rubrique/${normalizedSlug}?page=${totalPages}`);
  }

  const articles = await getCategoryArticles(category.id, currentPage);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: category.name },
        ]}
      />

      <div className="mt-4 mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#1D1D1B]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {category.name}
        </h1>
        <div className="mt-3 h-[3px] w-16 bg-[#005C9C]" />
      </div>

      {articles.length === 0 ? (
        <p className="text-[#6B6B6B] text-center py-12 font-sans">
          Aucun article dans cette rubrique.
        </p>
      ) : (
        <>
          {currentPage === 1 && (
            <div className="mb-8">
              <ArticleCard article={articles[0]} variant="large" />
            </div>
          )}

          {(currentPage === 1 ? articles.slice(1) : articles).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(currentPage === 1 ? articles.slice(1) : articles).map((article) => (
                <ArticleCard key={article.id} article={article} variant="medium" />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/rubrique/${normalizedSlug}`}
          />
        </>
      )}
    </div>
  );
}
