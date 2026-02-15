import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import CartItemRow from "@/components/CartItemRow";
import Link from "next/link";
import { createOrderFromCart } from "@/app/actions/cart";

interface CartPageProps {
  searchParams?: {
    error?: string;
  };
}

export default async function CartPage({ searchParams }: CartPageProps) {
  const session = await requireAuth();

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const errorMessage =
    searchParams?.error === "empty"
      ? "Votre panier est vide."
      : searchParams?.error === "stock"
      ? "Stock insuffisant pour certains articles."
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mon Panier</h1>

      {errorMessage && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Votre panier est vide</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Continuer mes achats
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cartItems.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold">Total :</span>
              <span className="text-2xl font-bold text-blue-600">
                {total.toFixed(2)} DT
              </span>
            </div>

            <div className="flex gap-4">
              <Link
                href="/products"
                className="flex-1 text-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Continuer mes achats
              </Link>
              <form action={createOrderFromCart} className="flex-1">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Passer commande
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
