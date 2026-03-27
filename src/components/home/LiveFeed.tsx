import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import type { ArticleWithCategory } from '@/components/ArticleCard';

interface LiveFeedProps {
  articles: ArticleWithCategory[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Politique: 'text-[#E9322D]',
  International: 'text-[#1D5FA8]',
  Économie: 'text-[#2E7D32]',
  Sciences: 'text-[#6A1B9A]',
  Culture: 'text-[#E65100]',
  Sport: 'text-[#00695C]',
  Société: 'text-[#4E342E]',
  Idées: 'text-[#37474F]',
};

function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? 'text-[#E9322D]';
}

export default function LiveFeed({ articles }: LiveFeedProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-6 border-b border-[#D5D5D5]">
      {/* En-tête */}
      <h2
        className="text-xs font-sans font-bold uppercase tracking-widest text-[#1D1D1B] mb-4 pb-2 border-b-2 border-[#1D1D1B] inline-block"
      >
        En continu
      </h2>

      {/* Fil d'entrées */}
      <ol className="divide-y divide-[#D5D5D5]">
        {articles.map((article) => (
          <li key={article.id} className="flex items-baseline gap-4 py-3">
            {/* Horodatage */}
            <time
              dateTime={article.publishedAt.toISOString()}
              className="flex-shrink-0 w-12 text-[13px] font-sans font-semibold text-[#6B6B6B] tabular-nums"
            >
              {formatTime(new Date(article.publishedAt))}
            </time>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <span
                className={`text-[11px] font-sans font-semibold uppercase tracking-wider mr-2 ${categoryColor(article.category.name)}`}
              >
                {article.category.name}
              </span>
              <Link
                href={`/article/${article.slug}`}
                className="text-[15px] font-sans text-[#1D1D1B] hover:underline underline-offset-2 decoration-1 leading-snug"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {article.title}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
