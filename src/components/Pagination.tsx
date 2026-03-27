import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}?page=${page}`;
  };

  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-8">
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 min-h-[44px] text-sm font-sans text-[#1D1D1B] border border-[#D5D5D5] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Page précédente"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Précédent
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 min-h-[44px] text-sm font-sans text-[#D5D5D5] border border-[#D5D5D5] cursor-not-allowed">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Précédent
        </span>
      )}

      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="inline-flex items-center justify-center w-10 h-10 text-sm font-sans text-[#6B6B6B]"
              >
                &hellip;
              </span>
            );
          }

          const isActive = page === currentPage;

          return isActive ? (
            <span
              key={page}
              className="inline-flex items-center justify-center w-10 h-10 text-sm font-sans font-bold text-white bg-[#1D1D1B]"
              aria-current="page"
              aria-label={`Page ${page}, page courante`}
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              aria-label={`Page ${page}`}
              className="inline-flex items-center justify-center w-10 h-10 text-sm font-sans text-[#1D1D1B] border border-[#D5D5D5] hover:bg-[#F5F5F5] transition-colors"
            >
              {page}
            </Link>
          );
        })}
      </div>

      <span className="sm:hidden text-sm font-sans text-[#6B6B6B] px-2" aria-live="polite" aria-atomic="true">
        <span className="sr-only">Page</span>{currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 min-h-[44px] text-sm font-sans text-[#1D1D1B] border border-[#D5D5D5] hover:bg-[#F5F5F5] transition-colors"
          aria-label="Page suivante"
        >
          Suivant
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      ) : (
        <span className="inline-flex items-center px-3 min-h-[44px] text-sm font-sans text-[#D5D5D5] border border-[#D5D5D5] cursor-not-allowed">
          Suivant
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}
    </nav>
  );
}
