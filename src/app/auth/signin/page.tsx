"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("message") === "compte-cree"
    ? "Compte créé, connectez-vous"
    : null;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/espace-perso");
    }
  }

  return (
    <>
      {successMessage && (
        <p
          role="status"
          aria-live="polite"
          className="text-green-700 text-sm mb-4 text-center bg-green-50 border border-green-200 px-3 py-2"
        >
          {successMessage}
        </p>
      )}
      {error && (
        <p
          id="signin-error"
          role="alert"
          aria-live="assertive"
          className="text-[var(--lemonde-red)] text-sm mb-4 text-center"
        >
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "signin-error" : undefined}
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
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "signin-error" : undefined}
            className="w-full border border-[var(--lemonde-border)] px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full bg-[var(--lemonde-black)] text-white py-2 text-sm font-medium hover:bg-[var(--lemonde-dark)] disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--lemonde-gray)]">
        Pas encore de compte ?{" "}
        <Link href="/auth/signup" className="text-[var(--lemonde-blue)] hover:underline">
          Créer un compte
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  return (
    <main className="max-w-[400px] mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-8 text-center">Connexion</h1>
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
