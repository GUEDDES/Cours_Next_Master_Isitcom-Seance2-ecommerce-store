import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="space-y-16">
      <section className="mx-4 md:mx-8 lg:mx-12 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 text-white p-10 md:p-16 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
          Boutique en ligne
        </p>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold max-w-3xl">
          Decouvrez des produits soigneusement selectionnes pour votre quotidien.
        </h1>
        <p className="mt-4 max-w-2xl text-blue-100 text-base md:text-lg">
          Une experience fluide, des achats simples, un catalogue en constante evolution.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50"
          >
            Explorer le catalogue
          </Link>
          <Link
            href="/cart"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Voir le panier
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Livraison rapide</p>
            <p className="mt-2 text-gray-600">
              Recevez vos commandes en quelques jours avec un suivi clair.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Paiement securise</p>
            <p className="mt-2 text-gray-600">
              Transactions protegees et donnees chiffrees.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-blue-600">Support reactif</p>
            <p className="mt-2 text-gray-600">
              Une equipe a votre ecoute pour chaque question.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nouveautes</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Voir tout
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow-sm">
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
