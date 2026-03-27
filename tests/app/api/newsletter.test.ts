/**
 * Tests — app/api/newsletter/route.ts
 * Couvre : 201 inscription, 409 déjà inscrit, 400 email invalide,
 *          400 body malformé (non-JSON), 500 erreur Prisma
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    newsletter: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// ─── Mock next/server ─────────────────────────────────────────────────────────

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      body,
    })),
  },
}));

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/newsletter/route';

const mockFindUnique = prisma.newsletter.findUnique as jest.Mock;
const mockCreate = prisma.newsletter.create as jest.Mock;
const mockJsonResponse = NextResponse.json as jest.Mock;

// ─── Helper ───────────────────────────────────────────────────────────────────

function makeRequest(body: unknown, malformed = false): Request {
  if (malformed) {
    return {
      json: () => Promise.reject(new SyntaxError('Unexpected token')),
    } as unknown as Request;
  }
  return {
    json: () => Promise.resolve(body),
  } as unknown as Request;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockJsonResponse.mockImplementation((body: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    body,
  }));
});

describe('POST /api/newsletter', () => {
  it('201 — inscrit un email valide inexistant', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '1', email: 'test@example.com' });

    const req = makeRequest({ email: 'test@example.com' });
    const res = await POST(req as never);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Inscription réussie' });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    });
  });

  it('409 — retourne erreur si email déjà inscrit', async () => {
    mockFindUnique.mockResolvedValue({ id: '1', email: 'already@example.com' });

    const req = makeRequest({ email: 'already@example.com' });
    const res = await POST(req as never);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Cette adresse est déjà inscrite' });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — retourne erreur si email invalide (Zod)', async () => {
    const req = makeRequest({ email: 'pas-un-email' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Email invalide' });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('400 — retourne erreur si champ email absent', async () => {
    const req = makeRequest({});
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Email invalide' });
  });

  it('400 — retourne erreur si body non-JSON (malformé)', async () => {
    const req = makeRequest(null, true);
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Corps de requête invalide' });
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it('500 — retourne HTTP 500 si erreur Prisma findUnique', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const req = makeRequest({ email: 'test@example.com' });
    const res = await POST(req as never);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Une erreur est survenue' });
  });

  it('500 — retourne HTTP 500 si erreur Prisma create', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockRejectedValue(new Error('Unique constraint'));

    const req = makeRequest({ email: 'test@example.com' });
    const res = await POST(req as never);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Une erreur est survenue' });
  });

  it('accepte un email avec majuscules (Zod ne lowercasifie pas)', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '2', email: 'user@example.com' });

    // Zod email() ne lowercasifie pas — vérifie que la valeur passée telle quelle est acceptée
    const req = makeRequest({ email: 'User@Example.Com' });
    const res = await POST(req as never);

    // L'email est valide syntaxiquement, donc 201 (Zod accepte les majuscules)
    expect(res.status).toBe(201);
  });

  it('201 — accepte un email avec espaces (trim avant validation)', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '3', email: 'test@example.com' });

    const req = makeRequest({ email: '  test@example.com  ' });
    const res = await POST(req as never);

    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith({
      data: { email: 'test@example.com' },
    });
  });
});
