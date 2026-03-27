import Link from 'next/link';
import type { Article, Category } from '@prisma/client';
import { formatRelativeDate } from '@/lib/utils';
import ImageOrPlaceholder from '@/components/articles/ImageOrPlaceholder';

type CategoryWithArticles = Category & { articles: Article[] };

interface CategorySectionProps {
  category: CategoryWithArticles;
}

export default function CategorySection({ category }: CategorySectionProps) {
  return (
    <section className="py-6 border-b border-[#D5D5D5]">
      {/* En-tête rubrique */}
      <div className="flex items-center justify-between mb-5 pb-2 border-b-2 border-[#005C9C]">
        <Link
          href={`/rubrique/${category.slug}`}
          className="text-xs font-sans font-bold uppercase tracking-widest text-[#005C9C] hover:opacity-75 transition-opacity"
        >
          {category.name}
        </Link>
        <Link
          href={`/rubrique/${category.slug}`}
          className="text-xs text-[#6B6B6B] hover:text-[#1D1D1B] transition-colors font-sans"
          aria-label={`Voir tous les articles ${category.name}`}
        >
          Voir tout →
        </Link>
      </div>

      {/* Grille : 1 col mobile / 2 cols tablette / 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.articles.map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="group block">
            <article>
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#D5D5D5]">
                <ImageOrPlaceholder
                  imageUrl={article.imageUrl}
                  imageAlt={article.imageAlt}
                  categoryName={category.name}
                  scale
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="pt-3">
                <h3
                  className="text-base font-bold text-[#1D1D1B] leading-snug mb-2 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p
                    className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-2 mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {article.excerpt}
                  </p>
                )}
                <div className="text-xs text-[#6B6B6B] font-sans">
                  <span>{article.author}</span>
                  <span className="mx-1">&middot;</span>
                  <time dateTime={article.publishedAt.toISOString()}>
                    {formatRelativeDate(new Date(article.publishedAt))}
                  </time>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
