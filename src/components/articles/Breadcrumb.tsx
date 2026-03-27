import Link from 'next/link';

interface BreadcrumbProps {
  categoryName: string;
  categorySlug: string;
  articleTitle: string;
}

function truncate(str: string, max = 40): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…';
}

export default function Breadcrumb({
  categoryName,
  categorySlug,
  articleTitle,
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-5"
      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
    >
      <Link
        href="/"
        className="hover:text-[#1A5276] transition-colors"
      >
        Accueil
      </Link>
      <span aria-hidden="true" className="text-[#D5D5D5]">›</span>
      <Link
        href={`/rubrique/${categorySlug}`}
        className="hover:text-[#1A5276] transition-colors"
      >
        {categoryName}
      </Link>
      <span aria-hidden="true" className="text-[#D5D5D5]">›</span>
      <span className="text-[#1D1D1B]" aria-current="page">
        {truncate(articleTitle)}
      </span>
    </nav>
  );
}
