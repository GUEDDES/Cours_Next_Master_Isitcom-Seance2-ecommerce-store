"use client";

import { useState } from "react";
import Image from "next/image";
import { updateCartItem, removeFromCart } from "@/app/actions/cart";

// Define strict types for the props based on Prisma schema
type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string | null;
  };
};

export default function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setLoading(true);
    await updateCartItem(item.id, newQuantity);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeFromCart(item.id);
    setLoading(false); // Component might unmount, but just in case
  };

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-4">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.imageUrl || "/placeholder-product.jpg"}
          alt={item.product.title}
          fill
          className="object-cover rounded"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{item.product.title}</h3>
        <p className="text-gray-600">{item.product.price.toFixed(2)} DT</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={loading || item.quantity <= 1}
          className="w-8 h-8 rounded hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={loading}
          className="w-8 h-8 rounded hover:bg-gray-100 border border-gray-300"
        >
          +
        </button>
      </div>

      <div className="text-right w-24 font-semibold">
        {(item.product.price * item.quantity).toFixed(2)} DT
      </div>

      <button
        onClick={handleRemove}
        disabled={loading}
        className="text-red-600 hover:text-red-800 ml-4"
      >
        Supprimer
      </button>
    </div>
  );
}
