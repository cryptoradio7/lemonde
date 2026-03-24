import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="py-3">
      <ol className="flex items-center flex-wrap text-sm font-sans text-[#6B6B6B]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-[#D5D5D5]" aria-hidden="true">
                  &gt;
                </span>
              )}
              {isLast || !item.href ? (
                <span className={isLast ? 'text-[#1D1D1B] font-medium line-clamp-1' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#1D1D1B] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
