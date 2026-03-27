import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

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
        <Link
          href={`/rubrique/${article.category.slug}`}
          className="text-xs font-bold uppercase tracking-widest text-[#1A5276] hover:text-[#E9322D] transition-colors"
          style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
        >
          {article.category.name}
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        {article.title}
      </h1>
      <p className="text-xl text-[#6B6B6B] mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        {article.excerpt}
      </p>
      <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-8 pb-4 border-b border-[#D5D5D5]" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
        <span className="font-semibold text-[#1D1D1B]">{article.author}</span>
        <span>&bull;</span>
        <time dateTime={article.publishedAt.toISOString()}>
          {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
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
            <figcaption className="mt-2 text-sm text-[#6B6B6B]" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
              {article.imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      <div
        className="prose prose-lg max-w-none"
        style={{ fontFamily: 'Georgia, serif' }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </main>
  );
}
