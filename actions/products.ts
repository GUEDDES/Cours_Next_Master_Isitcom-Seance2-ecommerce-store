"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProduct(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock") || 0);

  if (!title || !description || Number.isNaN(price)) {
    throw new Error("Champs invalides.");
  }

  const slug = slugify(title);

  await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price,
      stock: Number.isNaN(stock) ? 0 : stock,
      isActive: true,
    },
  });

  revalidatePath("/products");
}
