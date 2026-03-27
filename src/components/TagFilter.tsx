'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface TagFilterProps {
  tags: string[];
  activeTag?: string;
}

const TAGS_VISIBLE_DEFAULT = 5;

export default function TagFilter({ tags, activeTag }: TagFilterProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (tags.length === 0) return null;

  const visibleTags = expanded ? tags : tags.slice(0, TAGS_VISIBLE_DEFAULT);
  const hasMore = tags.length > TAGS_VISIBLE_DEFAULT;

  function handleTagClick(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activeTag === tag) {
      // Désélectionner le tag actif
      params.delete('tag');
    } else {
      params.set('tag', tag);
      params.delete('page'); // reset pagination
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleClear() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {activeTag && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-sans text-[#6B6B6B] border border-[#D5D5D5] rounded-full hover:border-[#1D1D1B] hover:text-[#1D1D1B] transition-colors"
            aria-label="Effacer le filtre"
          >
            Tout voir
          </button>
        )}
        {visibleTags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`inline-block px-3 py-1 text-xs font-sans rounded-full border transition-colors ${
                isActive
                  ? 'bg-[#005C9C] text-white border-[#005C9C]'
                  : 'bg-white text-[#1D1D1B] border-[#D5D5D5] hover:border-[#005C9C] hover:text-[#005C9C]'
              }`}
              aria-pressed={isActive}
            >
              {tag}
            </button>
          );
        })}
        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-sans text-[#6B6B6B] border border-dashed border-[#D5D5D5] rounded-full hover:border-[#1D1D1B] hover:text-[#1D1D1B] transition-colors"
            aria-label={`Voir ${tags.length - TAGS_VISIBLE_DEFAULT} tags supplémentaires`}
          >
            Voir plus ▼
          </button>
        )}
        {expanded && hasMore && (
          <button
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-sans text-[#6B6B6B] border border-dashed border-[#D5D5D5] rounded-full hover:border-[#1D1D1B] hover:text-[#1D1D1B] transition-colors"
            aria-label="Voir moins de tags"
          >
            Voir moins ▲
          </button>
        )}
      </div>
    </div>
  );
}
