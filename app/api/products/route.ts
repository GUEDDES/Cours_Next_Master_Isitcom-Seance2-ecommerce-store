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
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la recuperation des produits." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = body.title?.trim();
    const description = body.description?.trim();
    const price = Number(body.price);
    const stock = Number(body.stock ?? 0);
    const categoryId = body.categoryId || null;
    const imageUrl = body.imageUrl?.trim() || null;

    if (!title || !description || Number.isNaN(price)) {
      return NextResponse.json(
        { message: "Champs invalides : title, description, price obligatoires." },
        { status: 400 }
      );
    }

    const slug = body.slug?.trim() || slugify(title);

    const created = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock: Number.isNaN(stock) ? 0 : stock,
        categoryId,
        imageUrl,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la creation du produit." },
      { status: 500 }
    );
  }
}
