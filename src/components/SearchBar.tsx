'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/recherche?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full" role="search">
      <div className="relative flex items-center">
        <div className="absolute left-3 text-[#6B6B6B] pointer-events-none" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un article, un sujet..."
          className="w-full pl-10 pr-28 py-3 border border-[#D5D5D5] bg-white text-[#1D1D1B] text-sm font-sans placeholder-[#6B6B6B] focus:outline-none focus:border-[#1D1D1B] transition-colors"
          aria-label="Rechercher"
        />
        <button
          type="submit"
          className="absolute right-0 h-full px-6 bg-[#1D1D1B] text-white text-sm font-sans font-semibold hover:bg-[#333] transition-colors uppercase tracking-wide"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
