/**
 * @jest-environment node
 *
 * Tests — lib/auth.config.ts
 * Couvre : callback authorized — redirections middleware
 *
 * Story #8 edge case : utilisateur déjà connecté sur /auth/signin → redirect /espace-perso
 * Story #8 edge case : utilisateur non connecté sur /espace-perso → redirect /auth/signin
 */

import type { NextAuthConfig, Session } from "next-auth";
import authConfig from "@/lib/auth.config";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type AuthorizedParams = Parameters<
  NonNullable<NonNullable<NextAuthConfig["callbacks"]>["authorized"]>
>[0];

const authorized = (authConfig as NextAuthConfig).callbacks!
  .authorized as NonNullable<
  NonNullable<NextAuthConfig["callbacks"]>["authorized"]
>;

function makeParams(pathname: string, isLoggedIn: boolean): AuthorizedParams {
  const auth: Session | null = isLoggedIn
    ? ({
        user: { name: "Test User", email: "test@example.com" },
        expires: "2099-01-01",
      } as Session)
    : null;

  return {
    auth,
    request: { nextUrl: new URL(`http://localhost${pathname}`) },
  } as AuthorizedParams;
}

function isRedirectTo(result: unknown, path: string): boolean {
  if (!(result instanceof Response)) return false;
  const location = result.headers.get("location");
  return location?.includes(path) ?? false;
}

// ─── Utilisateur non connecté ─────────────────────────────────────────────────

describe("authorized — utilisateur non connecté", () => {
  it("retourne true pour la page d'accueil", () => {
    const result = authorized(makeParams("/", false));
    expect(result).toBe(true);
  });

  it("retourne true pour /auth/signin (accès libre)", () => {
    const result = authorized(makeParams("/auth/signin", false));
    expect(result).toBe(true);
  });

  it("retourne true pour /auth/signup", () => {
    const result = authorized(makeParams("/auth/signup", false));
    expect(result).toBe(true);
  });

  it("redirige vers /auth/signin si non connecté sur /espace-perso", () => {
    const result = authorized(makeParams("/espace-perso", false));
    expect(isRedirectTo(result, "/auth/signin")).toBe(true);
  });

  it("redirige vers /auth/signin si non connecté sur /espace-perso/profil", () => {
    const result = authorized(makeParams("/espace-perso/profil", false));
    expect(isRedirectTo(result, "/auth/signin")).toBe(true);
  });

  it("retourne true pour un article (page publique)", () => {
    const result = authorized(makeParams("/article/mon-article", false));
    expect(result).toBe(true);
  });
});

// ─── Utilisateur connecté ─────────────────────────────────────────────────────

describe("authorized — utilisateur connecté", () => {
  it("retourne true pour la page d'accueil", () => {
    const result = authorized(makeParams("/", true));
    expect(result).toBe(true);
  });

  it("redirige vers /espace-perso si connecté et visite /auth/signin (story #8 edge case)", () => {
    const result = authorized(makeParams("/auth/signin", true));
    expect(isRedirectTo(result, "/espace-perso")).toBe(true);
  });

  it("retourne true pour /espace-perso (accès autorisé)", () => {
    const result = authorized(makeParams("/espace-perso", true));
    expect(result).toBe(true);
  });

  it("retourne true pour un article (page publique)", () => {
    const result = authorized(makeParams("/article/un-article", true));
    expect(result).toBe(true);
  });
});

// ─── Configuration pages ──────────────────────────────────────────────────────

describe("auth.config — configuration", () => {
  it("définit signIn page sur /auth/signin", () => {
    expect((authConfig as NextAuthConfig).pages?.signIn).toBe("/auth/signin");
  });

  it("expose un callback authorized", () => {
    expect(typeof (authConfig as NextAuthConfig).callbacks?.authorized).toBe(
      "function"
    );
  });

  it("providers est vide (Credentials défini dans auth.ts)", () => {
    expect((authConfig as NextAuthConfig).providers).toHaveLength(0);
  });
});
