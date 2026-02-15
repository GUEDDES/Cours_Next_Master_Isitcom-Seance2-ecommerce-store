"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { success: false, error: "Non connecte" };
  }

  const userId = session.user.id;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, error: "Produit introuvable" };
    }

    if (product.stock < quantity) {
      return { success: false, error: "Stock insuffisant" };
    }

    await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId,
        productId,
        quantity,
      },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function clearCart() {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: "Non connecte" };

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    revalidatePath("/cart");
    return { success: true };
  } catch {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function createOrderFromCart() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/cart");
  }

  const userId = session.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    redirect("/cart?error=empty");
  }

  const outOfStock = cartItems.find((item) => item.product.stock < item.quantity);
  if (outOfStock) {
    redirect("/cart?error=stock");
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        userId,
        total,
        status: "PENDING",
        items: {
          create: cartItems.map((item) => ({
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            productId: item.productId,
          })),
        },
      },
    });

    await Promise.all(
      cartItems.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );

    await tx.cartItem.deleteMany({
      where: { userId },
    });
  });

  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  redirect("/orders?created=1");
}
