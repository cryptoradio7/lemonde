"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur lors de la création du compte");
      setLoading(false);
    } else {
      router.push("/auth/signin");
    }
  }

  return (
    <main className="max-w-[400px] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center">Créer un compte</h1>
      {error && (
        <p className="text-[var(--lemonde-red)] text-sm mb-4 text-center">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full border border-[var(--lemonde-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-[var(--lemonde-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full border border-[var(--lemonde-border)] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--lemonde-black)] text-white py-2 text-sm font-medium hover:bg-[var(--lemonde-dark)] disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--lemonde-gray)]">
        Déjà un compte ?{" "}
        <a href="/auth/signin" className="text-[var(--lemonde-blue)] hover:underline">
          Se connecter
        </a>
      </p>
    </main>
  );
}
