import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';
import Pagination from '@/components/Pagination';
import TagFilter from '@/components/TagFilter';
import {
  getCategoryBySlug,
  countCategoryArticles,
  getCategoryArticles,
  getCategoryArticleTagsData,
  getAllCategorySlugs,
  ARTICLES_PER_PAGE,
} from '@/lib/categories';
import { extractTagsFromArticles } from '@/lib/tags';
import { slugify } from '@/lib/utils';

interface Props {
  params: Promise<{ rubrique: string }>;
  searchParams: Promise<{ page?: string; tag?: string }>;
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
  const { page, tag } = await searchParams;

  // Normalisation slug accentué : société → societe
  const normalizedSlug = slugify(rubrique);
  if (normalizedSlug !== rubrique) {
    const queryParts: string[] = [];
    if (page && page !== '1') queryParts.push(`page=${page}`);
    if (tag) queryParts.push(`tag=${encodeURIComponent(tag)}`);
    const queryStr = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    redirect(`/rubrique/${normalizedSlug}${queryStr}`);
  }

  const category = await getCategoryBySlug(normalizedSlug);
  if (!category) notFound();

  // Tags disponibles dans la rubrique (basés sur tous les articles, pas la page courante)
  const tagData = await getCategoryArticleTagsData(category.id);
  const availableTags = extractTagsFromArticles(tagData);

  // Validation du tag sélectionné — retourne la forme canonique (casse d'origine du tag)
  // pour que le highlighting dans TagFilter (comparaison stricte) fonctionne toujours.
  const activeTag = tag
    ? availableTags.find((t) => t.toLowerCase() === tag.toLowerCase())
    : undefined;

  const totalCount = await countCategoryArticles(category.id, activeTag);
  const totalPages = Math.max(1, Math.ceil(totalCount / ARTICLES_PER_PAGE));
  const rawPage = parseInt(page || '1', 10);
  const currentPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  // Redirect si page demandée dépasse le total
  if (currentPage > totalPages) {
    const queryParts = [`page=${totalPages}`];
    if (activeTag) queryParts.push(`tag=${encodeURIComponent(activeTag)}`);
    redirect(`/rubrique/${normalizedSlug}?${queryParts.join('&')}`);
  }

  const articles = await getCategoryArticles(category.id, currentPage, ARTICLES_PER_PAGE, activeTag);
  const remainingArticles = currentPage === 1 ? articles.slice(1) : articles;

  // URL de base pour la pagination (conserve le tag actif)
  const paginationBase = activeTag
    ? `/rubrique/${normalizedSlug}?tag=${encodeURIComponent(activeTag)}`
    : `/rubrique/${normalizedSlug}`;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: category.name },
        ]}
      />

      <div className="mt-4 mb-6">
        <h1
          className="text-4xl md:text-5xl font-bold uppercase tracking-wide text-[#1D1D1B]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {category.name}
        </h1>
        <div className="mt-3 h-[3px] w-16 bg-[#005C9C]" />
      </div>

      {/* Section tags — Suspense requis car TagFilter lit useSearchParams */}
      {availableTags.length > 0 && (
        <Suspense fallback={null}>
          <TagFilter tags={availableTags} activeTag={activeTag} />
        </Suspense>
      )}

      {articles.length === 0 ? (
        <p className="text-[#6B6B6B] text-center py-12 font-sans">
          {activeTag
            ? `Aucun article pour le tag « ${activeTag} ».`
            : 'Aucun article dans cette rubrique.'}
        </p>
      ) : (
        <>
          {currentPage === 1 && (
            <div className="mb-8">
              <ArticleCard article={articles[0]} variant="large" />
            </div>
          )}

          {remainingArticles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="medium" />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={paginationBase}
          />
        </>
      )}
    </div>
  );
}
