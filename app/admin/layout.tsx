import Link from "next/link";
import { requireAdmin } from "@/lib/auth-utils";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <p className="text-gray-400 text-sm mb-4">
            Connecte : {session.user.name || session.user.email}
          </p>

          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Produits
            </Link>
            <Link
              href="/admin/categories"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Categories
            </Link>
            <Link
              href="/admin/orders"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Commandes
            </Link>
            <Link
              href="/admin/users"
              className="block px-4 py-2 rounded hover:bg-gray-700"
            >
              Utilisateurs
            </Link>
            <Link
              href="/"
              className="block px-4 py-2 text-gray-400 hover:text-white mt-8"
            >
              Retour au site
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
