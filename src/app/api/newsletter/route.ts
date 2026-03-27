import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Email invalide" },
      { status: 400 }
    );
  }

  const existing = await prisma.newsletter.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Cette adresse est déjà inscrite" },
      { status: 409 }
    );
  }

  await prisma.newsletter.create({
    data: { email: parsed.data.email },
  });

  return NextResponse.json(
    { message: "Inscription réussie" },
    { status: 201 }
  );
}
