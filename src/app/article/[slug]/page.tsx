<<<<<<< HEAD
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles, articles } from '@/data/articles';
import { slugify } from '@/lib/utils';
import ArticleCard from '@/components/ArticleCard';
import ShareButtons from '@/components/ShareButtons';
import Breadcrumb from '@/components/Breadcrumb';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article non trouvé' };

  return {
    title: article.titre,
    description: article.chapeau,
    openGraph: {
      title: article.titre,
      description: article.chapeau,
      type: 'article',
      publishedTime: article.date,
      authors: [article.auteur],
      tags: article.tags,
      images: [{ url: article.imageUrl, width: 800, height: 450 }],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article, 3);
  const formattedDate = new Date(article.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="max-w-content mx-auto px-4 py-6">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: article.rubrique, href: `/rubrique/${slugify(article.rubrique)}` },
          { label: article.titre },
        ]}
      />

      <header className="max-w-article mx-auto mt-6 mb-8">
        <span className="rubrique-label">{article.rubrique}</span>
        <h1 className="article-title text-3xl md:text-4xl mt-3 mb-4">{article.titre}</h1>
        <p className="article-chapeau text-lg md:text-xl mb-4">{article.chapeau}</p>

        <div className="flex items-center justify-between text-sm text-lm-gray border-t border-b border-lm-gray-border py-3 mb-6">
          <div>
            <span className="font-semibold text-lm-dark">Par {article.auteur}</span>
            <span className="mx-2">·</span>
            <time dateTime={article.date}>{formattedDate}</time>
            <span className="mx-2">·</span>
            <span>{article.tempsLecture} de lecture</span>
          </div>
          <ShareButtons
            url={`/article/${article.slug}`}
            title={article.titre}
          />
        </div>
      </header>

      <div className="max-w-article mx-auto mb-8">
        <div className="relative w-full aspect-video mb-8">
          <Image
            src={article.imageUrl}
            alt={article.titre}
            fill
            className="object-cover"
            sizes="(max-width: 680px) 100vw, 680px"
            unoptimized
          />
        </div>

        <div className="prose prose-lg max-w-none font-serif text-lm-dark leading-relaxed">
          {article.contenu.split('\n\n').map((paragraph, i) => (
            <p key={i} className="mb-5">{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-lm-gray-border">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`/recherche?q=${encodeURIComponent(tag)}`}
              className="px-3 py-1 text-sm bg-lm-gray-light text-lm-gray hover:bg-lm-gray-border rounded-sm transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="max-w-content mx-auto mt-12">
          <h2 className="section-title">Articles liés</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((rel) => (
              <ArticleCard key={rel.id} article={rel} variant="medium" />
            ))}
          </div>
        </section>
      )}
    </article>
=======
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!article) return {};
  return {
    title: `${article.title} — Le Monde`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!article) notFound();

  return (
    <main className="max-w-[760px] mx-auto px-4 py-8">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--lemonde-blue)]">
          {article.category.name}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
        {article.title}
      </h1>
      <p className="text-xl text-[var(--lemonde-gray)] mb-6">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-2 text-sm text-[var(--lemonde-gray)] mb-8 pb-4 border-b border-[var(--lemonde-border)]">
        <span className="font-semibold text-[var(--lemonde-black)]">
          {article.author}
        </span>
        <span>•</span>
        <time>
          {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      {article.imageUrl && (
        <figure className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.imageAlt || article.title}
            className="w-full"
          />
          {article.imageAlt && (
            <figcaption className="mt-2 text-sm text-[var(--lemonde-gray)]">
              {article.imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Partage social */}
      <div className="mt-8 pt-4 border-t border-[var(--lemonde-border)] flex gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://lemonde.fr/article/${article.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--lemonde-blue)] hover:underline"
        >
          Partager sur X
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://lemonde.fr/article/${article.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--lemonde-blue)] hover:underline"
        >
          Partager sur Facebook
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://lemonde.fr/article/${article.slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--lemonde-blue)] hover:underline"
        >
          Partager sur LinkedIn
        </a>
      </div>
    </main>
>>>>>>> b8af92a (Init : structure projet lemonde — Next.js 16, Prisma, Auth.js, Tailwind)
  );
}
