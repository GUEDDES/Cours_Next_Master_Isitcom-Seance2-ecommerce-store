"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

type Message = {
  type: "success" | "error";
  text: string;
};

type FormState = {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
};

const initialForm: FormState = {
  title: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  imageUrl: "",
  isActive: true,
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState<FormState>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!productId) return;

    async function load() {
      setLoading(true);
      setMessage(null);

      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch("/api/categories"),
        ]);

        if (!productRes.ok) {
          throw new Error("Produit introuvable");
        }

        const product = await productRes.json();
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];

        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price?.toString() ?? "",
          stock: product.stock?.toString() ?? "",
          categoryId: product.categoryId ?? "",
          imageUrl: product.imageUrl ?? "",
          isActive: product.isActive ?? true,
        });
        setCategories(categoriesData);
      } catch {
        setMessage({ type: "error", text: "Impossible de charger le produit." });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productId]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!productId) return;

    setSaving(true);
    setMessage(null);

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId || null,
      imageUrl: form.imageUrl || null,
      isActive: form.isActive,
    };

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Echec de mise a jour");
      }

      setMessage({ type: "success", text: "Produit mis a jour." });
      router.push("/admin/products");
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "Erreur lors de la mise a jour du produit.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier un produit</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          Retour
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
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
              className="w-full border rounded p-2"
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
              className="w-full border rounded p-2"
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
            className="w-full border rounded p-2"
          >
            <option value="">Aucune</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
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
            className="w-full border rounded p-2"
            placeholder="https://..."
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />
          Produit actif
        </label>

        <button
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}
