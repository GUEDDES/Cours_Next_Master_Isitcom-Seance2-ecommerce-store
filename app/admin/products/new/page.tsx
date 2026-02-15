"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }
    load();
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId || null,
      imageUrl: form.imageUrl || null,
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(err.message || "Erreur lors de la creation.");
      setLoading(false);
      return;
    }

    setMessage("Produit cree avec succes.");
    setLoading(false);
    router.push("/admin/products");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Creer un produit</h1>

      {message ? (
        <div className="mb-4 p-3 rounded bg-blue-50 border border-blue-200 text-black">
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Prix</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
              type="number"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Stock</label>
            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
              type="number"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Categorie</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
          >
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded p-2 text-black"
            placeholder="https://..."
          />
        </div>

        <button
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? "Creation..." : "Creer"}
        </button>
      </form>
    </div>
  );
}
