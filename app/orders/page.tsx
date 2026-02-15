import Link from "next/link";
import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

interface OrdersPageProps {
  searchParams?: Promise<{
    created?: string;
  }>;
}

function getStatusBadgeClass(status: string) {
  if (status === "PAID") return "bg-green-100 text-green-700";
  if (status === "SHIPPED") return "bg-blue-100 text-blue-700";
  if (status === "CANCELED") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await requireAuth();
  const resolvedSearchParams = (await searchParams) ?? {};

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes commandes</h1>

      {resolvedSearchParams.created === "1" && (
        <div className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          Votre commande a bien ete creee.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-8 shadow text-center">
          <p className="text-gray-600 mb-4">Vous n&apos;avez pas encore de commande.</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Decouvrir les produits
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article key={order.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Commande #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.title} x {item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toFixed(2)} DT</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-semibold text-blue-700">
                  {order.total.toFixed(2)} DT
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
