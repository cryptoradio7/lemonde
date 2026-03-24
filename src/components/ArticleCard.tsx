import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/data/articles';

interface ArticleCardProps {
  article: Article;
  variant?: 'large' | 'medium' | 'small';
}

export default function ArticleCard({ article, variant = 'medium' }: ArticleCardProps) {
  const { titre, chapeau, auteur, date, rubrique, imageUrl, slug, tempsLecture } = article;

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (variant === 'large') {
    return (
      <Link href={`/article/${slug}`} className="group block">
        <article className="relative overflow-hidden">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={imageUrl}
              alt={titre}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <span className="inline-block px-2 py-1 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-[#E9322D] mb-3">
                {rubrique}
              </span>
              <h2
                className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight group-hover:underline decoration-2 underline-offset-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {titre}
              </h2>
              <p
                className="text-sm md:text-base text-gray-200 line-clamp-2 max-w-3xl"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {chapeau}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-300 font-sans">
                <span>{auteur}</span>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={date}>{formattedDate}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{tempsLecture}</span>
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
              {rubrique}
            </span>
            <h3
              className="text-base font-bold text-[#1D1D1B] leading-snug group-hover:underline decoration-1 underline-offset-2 line-clamp-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {titre}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs text-[#6B6B6B] font-sans">
              <time dateTime={date}>{formattedDate}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{tempsLecture}</span>
            </div>
          </div>
          <div className="relative w-24 h-24 flex-shrink-0">
            <Image
              src={imageUrl}
              alt={titre}
              fill
              unoptimized
              className="object-cover"
              sizes="96px"
            />
          </div>
        </article>
      </Link>
    );
  }

  // Medium variant (default)
  return (
    <Link href={`/article/${slug}`} className="group block">
      <article className="bg-white border border-[#D5D5D5] overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="relative w-full aspect-[16/10]">
          <Image
            src={imageUrl}
            alt={titre}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-sans font-semibold uppercase tracking-wider text-white bg-[#E9322D]">
            {rubrique}
          </span>
        </div>
        <div className="p-4">
          <h3
            className="text-lg font-bold text-[#1D1D1B] leading-snug mb-2 group-hover:underline decoration-1 underline-offset-2 line-clamp-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {titre}
          </h3>
          <p
            className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-2 mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {chapeau}
          </p>
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] font-sans border-t border-[#D5D5D5] pt-3">
            <span>{auteur}</span>
            <div className="flex items-center gap-2">
              <time dateTime={date}>{formattedDate}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{tempsLecture}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
