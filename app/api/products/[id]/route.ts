import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json({ message: "Produit introuvable." }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la recuperation du produit." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const title = body.title?.trim();
    const description = body.description?.trim();
    const price = body.price !== undefined ? Number(body.price) : undefined;
    const stock = body.stock !== undefined ? Number(body.stock) : undefined;
    const categoryId = body.categoryId !== undefined ? body.categoryId : undefined;
    const imageUrl =
      body.imageUrl !== undefined ? body.imageUrl?.trim() || null : undefined;
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : undefined;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined && !Number.isNaN(price) ? { price } : {}),
        ...(stock !== undefined && !Number.isNaN(stock) ? { stock } : {}),
        ...(categoryId !== undefined ? { categoryId } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la mise a jour du produit." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Produit supprime." });
  } catch {
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression du produit." },
      { status: 500 }
    );
  }
}
