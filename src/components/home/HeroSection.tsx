import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';
import type { ArticleWithCategory } from '@/components/ArticleCard';

interface HeroSectionProps {
  mainArticle: ArticleWithCategory;
  sidebarArticles: ArticleWithCategory[];
}

export default function HeroSection({ mainArticle, sidebarArticles }: HeroSectionProps) {
  return (
    <section className="py-6 border-b border-[#D5D5D5]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Article principal — 65% */}
        <div className="md:w-[65%]">
          <span className="inline-block text-xs font-sans font-semibold uppercase tracking-wider text-[#E9322D] mb-3">
            {mainArticle.category.name}
          </span>
          <Link href={`/article/${mainArticle.slug}`} className="group block">
            <h1
              className="text-[32px] font-bold leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4 text-[#1D1D1B]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {mainArticle.title}
            </h1>
          </Link>
          {mainArticle.excerpt && (
            <p
              className="text-base text-[#6B6B6B] leading-relaxed mb-4"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {mainArticle.excerpt}
            </p>
          )}
          <p className="text-sm text-[#6B6B6B] font-sans">
            {mainArticle.author}
            <span className="mx-2 text-[#D5D5D5]">|</span>
            <time dateTime={mainArticle.publishedAt.toISOString()}>
              {formatDateShort(new Date(mainArticle.publishedAt))}
            </time>
          </p>
        </div>

        {/* Séparateur vertical */}
        <div className="hidden md:block w-px bg-[#D5D5D5] self-stretch" aria-hidden="true" />

        {/* Sidebar — 35% */}
        <aside className="md:w-[35%] flex flex-col">
          {sidebarArticles.map((article, index) => (
            <div key={article.id}>
              <Link href={`/article/${article.slug}`} className="group block py-4">
                <span className="inline-block text-xs font-sans font-semibold uppercase tracking-wider text-[#E9322D] mb-1">
                  {article.category.name}
                </span>
                <h3
                  className="text-base font-bold text-[#1D1D1B] leading-snug group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {article.title}
                </h3>
                <time
                  dateTime={article.publishedAt.toISOString()}
                  className="block mt-1 text-xs text-[#6B6B6B] font-sans"
                >
                  {formatDateShort(new Date(article.publishedAt))}
                </time>
              </Link>
              {index < sidebarArticles.length - 1 && (
                <hr className="border-[#D5D5D5]" />
              )}
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
