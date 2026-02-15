"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
};

type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  async function loadCategories() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error("Erreur");
      }
      const data = await res.json();
      setCategories(data);
    } catch {
      setMessage({ type: "error", text: "Erreur lors du chargement des categories." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur");
      }

      setMessage({ type: "success", text: "Categorie creee." });
      setForm({ name: "", slug: "" });
      await loadCategories();
    } catch {
      setMessage({ type: "error", text: "Impossible de creer la categorie." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Categories</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Nouvelle categorie</h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Nom"
            required
          />
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="Slug (optionnel)"
          />
          <button
            disabled={saving}
            className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
          >
            {saving ? "Creation..." : "Creer"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 rounded border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow">Aucune categorie.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {category.slug}
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
