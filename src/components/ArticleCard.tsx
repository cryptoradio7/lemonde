import Link from 'next/link';
import Image from 'next/image';
import type { Article, Category } from '@prisma/client';
import { formatDateShort } from '@/lib/utils';

export type ArticleWithCategory = Article & { category: Category };

interface ArticleCardProps {
  article: ArticleWithCategory;
  variant?: 'large' | 'medium' | 'small';
}

function calcReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de lecture`;
}

function ImageOrPlaceholder({
  imageUrl,
  imageAlt,
  categoryName,
  className,
  sizes,
  scale,
}: {
  imageUrl: string | null;
  imageAlt: string | null;
  categoryName: string;
  className?: string;
  sizes?: string;
  scale?: boolean;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={imageAlt ?? categoryName}
        fill
        unoptimized
        className={`object-cover ${scale ? 'group-hover:scale-105 transition-transform duration-500' : ''} ${className ?? ''}`}
        sizes={sizes}
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-[#D5D5D5] flex items-center justify-center">
      <span className="text-[#6B6B6B] text-xs font-sans uppercase tracking-wider">
        {categoryName}
      </span>
    </div>
  );
}

export default function ArticleCard({ article, variant = 'medium' }: ArticleCardProps) {
  const { title, excerpt, author, publishedAt, category, imageUrl, imageAlt, slug, content } = article;
  const formattedDate = formatDateShort(new Date(publishedAt));
  const readingTime = calcReadingTime(content);

  if (variant === 'large') {
    return (
      <Link href={`/article/${slug}`} className="group block">
        <article className="relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <ImageOrPlaceholder
              imageUrl={imageUrl}
              imageAlt={imageAlt}
              categoryName={category.name}
              scale
              sizes="100vw"
            />
            {imageUrl && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <span className="inline-block px-2 py-1 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-[#E9322D] mb-3">
                {category.name}
              </span>
              <h2
                className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {title}
              </h2>
              {excerpt && (
                <p
                  className="text-sm md:text-base text-gray-200 line-clamp-2 max-w-3xl"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {excerpt}
                </p>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-300 font-sans">
                <span>{author}</span>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={publishedAt.toISOString()}>{formattedDate}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{readingTime}</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'small') {
    return (
      <Link href={`/article/${slug}`} className="group block">
        <article className="flex gap-4 py-4 border-b border-[#D5D5D5] last:border-b-0">
          <div className="flex-1 min-w-0">
            <span className="inline-block text-xs font-sans font-semibold uppercase tracking-wider text-[#E9322D] mb-1">
              {category.name}
            </span>
            <h3
              className="text-base font-bold text-[#1D1D1B] leading-snug group-hover:underline decoration-1 underline-offset-2 line-clamp-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#6B6B6B] font-sans">
              <time dateTime={publishedAt.toISOString()}>{formattedDate}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{readingTime}</span>
            </div>
          </div>
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
            <ImageOrPlaceholder
              imageUrl={imageUrl}
              imageAlt={imageAlt}
              categoryName={category.name}
              sizes="96px"
            />
          </div>
        </article>
      </Link>
    );
  }

  // Medium (default)
  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="overflow-hidden">
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          <ImageOrPlaceholder
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            categoryName={category.name}
            scale
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-[#E9322D]">
            {category.name}
          </span>
        </div>
        <div className="pt-3">
          <h3
            className="text-lg font-bold text-[#1D1D1B] leading-snug mb-2 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {title}
          </h3>
          {excerpt && (
            <p
              className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-2 mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-sans border-t border-[#D5D5D5] pt-3">
            <span>{author}</span>
            <div className="flex items-center gap-2">
              <time dateTime={publishedAt.toISOString()}>{formattedDate}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
