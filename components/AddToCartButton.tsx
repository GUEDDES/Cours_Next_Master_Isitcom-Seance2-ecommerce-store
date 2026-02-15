"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/app/actions/cart";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=" + window.location.pathname);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await addToCart(productId, 1);
      if (result.success) {
        setMessage("Ajoute au panier !");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(result.error || "Erreur");
      }
    } catch {
      setMessage("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleAddToCart}
        disabled={loading || status === "loading"}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Ajout en cours..." : "Ajouter au panier"}
      </button>
      {message && (
        <p className="text-green-600 text-center mt-2 text-sm">{message}</p>
      )}
    </div>
  );
}
