import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

import { getArticleBySlug, getRelatedArticles, getAllArticleSlugs } from '@/lib/articles';
import Breadcrumb from '@/components/Breadcrumb';
import ShareButtons from '@/components/ShareButtons';
import ArticleCard from '@/components/ArticleCard';
import { formatDateShort } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  return {
    title: `${article.title} — Le Monde`,
    description: article.excerpt,
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `${baseUrl}/article/${article.slug}`,
      images: article.imageUrl
        ? [{ url: article.imageUrl, alt: article.imageAlt ?? article.title }]
        : [],
      authors: [article.author],
      publishedTime: article.publishedAt.toISOString(),
      section: article.category.name,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article.categoryId, slug);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const articleUrl = `${baseUrl}/article/${article.slug}`;

  const safeContent = DOMPurify.sanitize(article.content);

  const formattedDate = formatDateShort(new Date(article.publishedAt));
  const readingTime = article.readingTime;

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: article.category.name, href: `/rubrique/${article.category.slug}` },
    { label: article.title },
  ];

  return (
    <main>
      {/* Fil d'Ariane */}
      <div className="max-w-[760px] mx-auto px-4 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <article className="max-w-[760px] mx-auto px-4 pb-16">
        {/* Badge rubrique */}
        <div className="mb-4">
          <Link
            href={`/rubrique/${article.category.slug}`}
            className="inline-block text-xs font-bold uppercase tracking-widest text-white bg-[#E9322D] px-2 py-1 hover:bg-[#c62820] transition-colors"
            style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
          >
            {article.category.name}
          </Link>
        </div>

        {/* Titre */}
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-[#1D1D1B]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.title}
        </h1>

        {/* Chapeau */}
        <p
          className="text-lg italic text-[#6B6B6B] leading-relaxed mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {article.excerpt}
        </p>

        {/* Barre métadonnées */}
        <div
          className="flex flex-wrap items-center gap-2 text-sm text-[#6B6B6B] pb-5 border-b border-[#D5D5D5] mb-6"
          style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
        >
          <span className="font-semibold text-[#1D1D1B]">Par {article.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={article.publishedAt.toISOString()}>{formattedDate}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{readingTime} min de lecture</span>
        </div>

        {/* Boutons de partage */}
        <ShareButtons url={articleUrl} title={article.title} />

        {/* Image principale */}
        {article.imageUrl && (
          <figure className="mb-8 -mx-4 md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={article.imageAlt ?? article.title}
              className="w-full object-cover"
              loading="lazy"
            />
            {article.imageAlt && (
              <figcaption
                className="mt-2 px-4 md:px-0 text-xs text-[#6B6B6B] leading-relaxed"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                {article.imageAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Contenu éditorial */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        {/* Tags — pas de champ tags dans le schéma, section omise */}
      </article>

      {/* Articles liés */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-[#D5D5D5] mt-4 py-10 bg-[#F5F5F5]">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="section-title mb-6">À lire aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} variant="medium" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
