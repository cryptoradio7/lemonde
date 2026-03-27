import Image from 'next/image';

interface ImageOrPlaceholderProps {
  imageUrl: string | null;
  imageAlt: string | null;
  categoryName: string;
  sizes?: string;
  scale?: boolean;
}

export default function ImageOrPlaceholder({
  imageUrl,
  imageAlt,
  categoryName,
  sizes,
  scale,
}: ImageOrPlaceholderProps) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={imageAlt ?? categoryName}
        fill
        unoptimized
        className={`object-cover ${scale ? 'group-hover:scale-105 transition-transform duration-500' : ''}`}
        sizes={sizes}
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-[#D5D5D5] flex items-center justify-center" aria-hidden="true">
      <span className="text-[#6B6B6B] text-xs font-sans uppercase tracking-wider">
        {categoryName}
      </span>
    </div>
  );
}
