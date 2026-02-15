import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la recuperation des categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { message: "Le nom de categorie est obligatoire." },
        { status: 400 }
      );
    }

    const slug = body.slug?.trim() || slugify(name);

    const created = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la creation de la categorie." },
      { status: 500 }
    );
  }
}
