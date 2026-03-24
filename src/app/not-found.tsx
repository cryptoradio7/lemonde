import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-content mx-auto px-4 py-20 text-center">
      <h1 className="font-serif text-6xl font-bold text-lm-dark mb-4">404</h1>
      <p className="text-xl font-serif text-lm-gray mb-8">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-lm-dark text-white font-sans text-sm hover:bg-lm-red transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
