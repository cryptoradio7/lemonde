import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ArticleCard from '@/components/ArticleCard';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  params: Promise<{ rubrique: string }>;
  searchParams: Promise<{ page?: string }>;
}

const ARTICLES_PER_PAGE = 12;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ rubrique: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rubrique } = await params;
  const category = await prisma.category.findUnique({ where: { slug: rubrique } });
  if (!category) return { title: 'Rubrique non trouvée' };
  return {
    title: `${category.name} - Toute l'actualité`,
    description: `Retrouvez toute l'actualité ${category.name} sur Le Monde.`,
    openGraph: {
      title: `${category.name} - Le Monde`,
      description: `Retrouvez toute l'actualité ${category.name} sur Le Monde.`,
    },
  };
}

export default async function RubriquePage({ params, searchParams }: Props) {
  const { rubrique } = await params;
  const { page } = await searchParams;

  const category = await prisma.category.findUnique({ where: { slug: rubrique } });
  if (!category) notFound();

  const totalCount = await prisma.article.count({ where: { categoryId: category.id } });
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

  const articles = await prisma.article.findMany({
    where: { categoryId: category.id },
    orderBy: { publishedAt: 'desc' },
    skip: (currentPage - 1) * ARTICLES_PER_PAGE,
    take: ARTICLES_PER_PAGE,
    include: { category: true },
  });

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: category.name },
        ]}
      />

      <h1
        className="text-3xl md:text-4xl font-bold mt-4 mb-2 text-[#1D1D1B]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {category.name.toUpperCase()}
      </h1>
      <p className="text-[#6B6B6B] mb-8 font-sans text-sm">
        Retrouvez toute l&apos;actualité {category.name} en continu sur Le Monde.
      </p>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(currentPage === 1 ? articles.slice(1) : articles).map((article) => (
              <ArticleCard key={article.id} article={article} variant="medium" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {currentPage > 1 && (
                <a
                  href={`/rubrique/${rubrique}?page=${currentPage - 1}`}
                  className="px-4 py-2 text-sm border border-[#D5D5D5] hover:bg-[#F5F5F5] font-sans"
                >
                  ← Précédent
                </a>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/rubrique/${rubrique}?page=${p}`}
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
                  href={`/rubrique/${rubrique}?page=${currentPage + 1}`}
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
