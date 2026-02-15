"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
};

type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadProducts() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        throw new Error("Impossible de charger les produits.");
      }
      const data = await res.json();
      setProducts(data);
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors du chargement des produits.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleToggle(product: Product) {
    setActionId(product.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });

      if (!res.ok) {
        throw new Error("Echec de mise a jour");
      }

      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isActive: !item.isActive } : item
        )
      );
      setMessage({
        type: "success",
        text: product.isActive
          ? "Produit desactive."
          : "Produit active.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise a jour du produit.",
      });
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(productId: string) {
    const confirmed = window.confirm(
      "Confirmer la suppression definitive de ce produit ?"
    );
    if (!confirmed) return;

    setActionId(productId);
    setMessage(null);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Echec suppression");
      }

      setProducts((prev) => prev.filter((item) => item.id !== productId));
      setMessage({ type: "success", text: "Produit supprime." });
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors de la suppression du produit.",
      });
    } finally {
      setActionId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nouveau produit
        </Link>
      </div>

      {message && (
        <div
          className={`mb-4 rounded border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : products.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">Aucun produit.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.price.toFixed(2)} DT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.category?.name || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        product.isActive
                          ? "px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
                          : "px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      }
                    >
                      {product.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Editer
                      </Link>
                      <button
                        onClick={() => handleToggle(product)}
                        disabled={actionId === product.id}
                        className="text-amber-600 hover:underline disabled:opacity-50"
                      >
                        {product.isActive ? "Desactiver" : "Activer"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={actionId === product.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
