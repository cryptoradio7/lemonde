/**
 * Tests — app/api/auth/signup/route.ts
 * Couvre : 201 création, 409 email existant, 400 validation Zod,
 *          edge cases nom (espaces), mot de passe 6 chars, body malformé
 */

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// ─── Mock bcryptjs ────────────────────────────────────────────────────────────

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
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
import { POST } from '@/app/api/auth/signup/route';

const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;
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

describe('POST /api/auth/signup', () => {
  it('201 — crée un compte avec des données valides', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '1', name: 'Alice', email: 'alice@example.com' });

    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    const res = await POST(req as never);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Compte créé avec succès' });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: 'Alice', email: 'alice@example.com', passwordHash: 'hashed_password' },
    });
  });

  it('409 — retourne erreur si email déjà utilisé', async () => {
    mockFindUnique.mockResolvedValue({ id: '1', email: 'alice@example.com' });

    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    const res = await POST(req as never);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Un compte existe déjà avec cet email' });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un nom trop court (< 2 chars)', async () => {
    const req = makeRequest({ name: 'A', email: 'alice@example.com', password: 'secret123' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un nom composé uniquement d\'espaces', async () => {
    const req = makeRequest({ name: '   ', email: 'alice@example.com', password: 'secret123' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un email invalide', async () => {
    const req = makeRequest({ name: 'Alice', email: 'pas-un-email', password: 'secret123' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un mot de passe trop court (< 8 chars)', async () => {
    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: '123' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un mot de passe de 7 caractères (< min 8)', async () => {
    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: '1234567' });
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('201 — accepte un mot de passe de exactement 8 caractères (borne inclusive)', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '1', name: 'Alice', email: 'alice@example.com' });

    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: '12345678' });
    const res = await POST(req as never);

    expect(res.status).toBe(201);
  });

  it('400 — rejette un body malformé (non-JSON)', async () => {
    const req = makeRequest(null, true);
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('400 — rejette un body sans champs obligatoires', async () => {
    const req = makeRequest({});
    const res = await POST(req as never);

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('hash le mot de passe avec bcryptjs (12 rounds)', async () => {
    const { hash } = await import('bcryptjs');
    mockFindUnique.mockResolvedValue(null);
    mockCreate.mockResolvedValue({ id: '1' });

    const req = makeRequest({ name: 'Alice', email: 'alice@example.com', password: 'secret123' });
    await POST(req as never);

    expect(hash).toHaveBeenCalledWith('secret123', 12);
  });
});
