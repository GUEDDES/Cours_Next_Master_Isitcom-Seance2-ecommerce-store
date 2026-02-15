import Link from "next/link";
import Image from "next/image";
import { Product } from "@prisma/client";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="relative h-64 w-full bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800 mb-1 truncate">
          {product.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2 md:h-10 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-xl text-blue-600">
            {product.price.toFixed(2)} DT
          </span>
          <span className="text-sm text-gray-500">
            Voir details
          </span>
        </div>
      </div>
    </Link>
  );
}
