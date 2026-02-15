import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminChart from "@/components/AdminChart";

export default async function AdminDashboard() {
  const [productsCount, ordersCount, usersCount, totalRevenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "PAID" },
    }),
  ]);

  const revenue = totalRevenue._sum.total || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Produits</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{productsCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Commandes</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{ordersCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Utilisateurs</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{usersCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Chiffre d&apos;affaires
          </h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {revenue.toFixed(2)} DT
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Ajouter un produit
          </Link>
          <Link
            href="/admin/categories"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gerer les categories
          </Link>
        </div>
      </div>

      <AdminChart />
    </div>
  );
}
