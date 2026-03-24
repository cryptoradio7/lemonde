import { getRecentArticles, getFeaturedArticle, getArticlesByRubrique, getAllRubriques } from '@/data/articles';
import { slugify } from '@/lib/utils';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export default function HomePage() {
  const featured = getFeaturedArticle();
  const recentArticles = getRecentArticles(6);
  const rubriques = getAllRubriques();

  return (
    <div className="max-w-content mx-auto px-4 py-6">
      {/* À la une */}
      <section className="mb-10">
        <h2 className="section-title">À la une</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ArticleCard article={featured} variant="large" />
          </div>
          <div className="flex flex-col gap-4">
            {recentArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} variant="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Articles récents */}
      <section className="mb-10">
        <h2 className="section-title">Les plus récents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} variant="medium" />
          ))}
        </div>
      </section>

      {/* Sections par rubrique */}
      {rubriques.slice(0, 6).map((rubrique) => {
        const articles = getArticlesByRubrique(rubrique).slice(0, 4);
        if (articles.length === 0) return null;
        return (
          <section key={rubrique} className="mb-10">
            <div className="flex items-center justify-between border-b-2 border-lm-dark pb-2 mb-4">
              <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-lm-dark">
                {rubrique}
              </h2>
              <Link
                href={`/rubrique/${slugify(rubrique)}`}
                className="text-xs text-lm-red hover:underline font-sans"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="medium" />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
