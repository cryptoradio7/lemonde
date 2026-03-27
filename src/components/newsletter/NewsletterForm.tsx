'use client';

import { useState } from 'react';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'already' | 'invalid' | 'error';

const statusMessages: Record<Exclude<SubmitStatus, 'idle' | 'loading'>, string> = {
  success: 'Inscription confirmée !',
  already: 'Cette adresse est déjà inscrite',
  invalid: 'Veuillez saisir une adresse e-mail valide.',
  error: 'Une erreur est survenue',
};

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.status === 201) {
        setStatus('success');
        setEmail('');
        return;
      }

      if (res.status === 409) {
        setStatus('already');
        return;
      }

      if (res.status === 400) {
        setStatus('invalid');
        return;
      }

      setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse e-mail"
          className="flex-1 px-4 py-2.5 bg-[#2a2a28] border border-[#444] text-white text-sm font-sans placeholder-[#888] focus:outline-none focus:border-[#E9322D] transition-colors"
          aria-label="Adresse e-mail"
          required
          disabled={status === 'loading' || status === 'success'}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="px-6 py-2.5 bg-[#E9322D] text-white text-sm font-sans font-semibold hover:bg-[#c72a26] transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Envoi…' : "S'inscrire"}
        </button>
      </div>
      {status !== 'idle' && status !== 'loading' && (
        <p
          className={`text-sm font-sans ${status === 'success' ? 'text-green-400' : 'text-[#E9322D]'}`}
          role="status"
          aria-live="polite"
        >
          {statusMessages[status]}
        </p>
      )}
    </form>
  );
}
