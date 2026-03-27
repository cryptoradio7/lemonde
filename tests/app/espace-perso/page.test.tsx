/**
 * @jest-environment node
 *
 * Tests — app/espace-perso/page.tsx
 * Couvre : affichage session, greeting avec/sans nom, redirect si non connecté
 *
 * Story #9 : espace personnel
 */

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EspacePersoPage from "@/app/espace-perso/page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const mockAuth = auth as jest.Mock;
const mockRedirect = redirect as jest.Mock;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeSession(name: string | null, email: string) {
  return {
    user: { name, email },
    expires: "2099-01-01",
  };
}

async function renderPage(): Promise<string> {
  const jsx = await EspacePersoPage();
  return renderToStaticMarkup(jsx as React.ReactElement);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
});

// ─── Utilisateur non connecté ─────────────────────────────────────────────────

describe("EspacePersoPage — utilisateur non connecté", () => {
  it("appelle redirect vers /auth/signin si pas de session", async () => {
    mockAuth.mockResolvedValue(null);
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(EspacePersoPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
  });

  it("appelle redirect si session sans user", async () => {
    mockAuth.mockResolvedValue({ expires: "2099-01-01" });
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(EspacePersoPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mockRedirect).toHaveBeenCalledWith("/auth/signin");
  });
});

// ─── Utilisateur connecté — affichage ─────────────────────────────────────────

describe("EspacePersoPage — utilisateur connecté", () => {
  it("affiche 'Bonjour, {nom}' quand le nom est renseigné", async () => {
    mockAuth.mockResolvedValue(makeSession("Alice Dupont", "alice@example.com"));

    const html = await renderPage();

    expect(html).toContain("Bonjour,");
    expect(html).toContain("Alice Dupont");
  });

  it("affiche 'Bonjour' sans nom quand name est null (edge case)", async () => {
    mockAuth.mockResolvedValue(makeSession(null, "lecteur@lemonde.fr"));

    const html = await renderPage();

    // "Bonjour" présent, sans virgule ni nom
    expect(html).toContain("Bonjour");
    expect(html).not.toContain("Bonjour,");
    // Le <p> greeting ne doit contenir que "Bonjour" (pas de balise <strong>)
    expect(html).toContain('<p class="text-lg mb-2">Bonjour</p>');
  });

  it("affiche l'email de l'utilisateur", async () => {
    mockAuth.mockResolvedValue(makeSession("Alice", "alice@example.com"));

    const html = await renderPage();

    expect(html).toContain("alice@example.com");
  });

  it("contient un bouton 'Se déconnecter'", async () => {
    mockAuth.mockResolvedValue(makeSession("Alice", "alice@example.com"));

    const html = await renderPage();

    expect(html).toContain("Se déconnecter");
  });

  it("ne redirige pas si la session est valide", async () => {
    mockAuth.mockResolvedValue(makeSession("Alice", "alice@example.com"));

    await renderPage();

    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("affiche max-width 600px (critère d'acceptation layout)", async () => {
    mockAuth.mockResolvedValue(makeSession("Alice", "alice@example.com"));

    const html = await renderPage();

    expect(html).toContain("max-w-[600px]");
  });
});
