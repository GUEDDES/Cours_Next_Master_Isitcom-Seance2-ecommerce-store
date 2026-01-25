// app/products/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts } from '../lib/api';

// Metadata pour SEO
export const metadata = {
  title: 'Tous nos Produits | E-Commerce Store',
  description: 'Découvrez notre catalogue complet de produits de qualité',
};

export default async function ProductsPage() {
  // Fetch products côté serveur
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Nos Produits
          </h1>
          <p className="text-xl text-gray-600">
            {products.length} produits disponibles
          </p>
        </header>

        {/* Grid produits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group"
            >
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-64 bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Badge catégorie */}
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full mb-3 uppercase font-semibold">
                    {product.category}
                  </span>

                  {/* Titre */}
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h2>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(product.rating.rate))}
                      {'☆'.repeat(5 - Math.round(product.rating.rate))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.rating.count})
                    </span>
                  </div>

                  {/* Prix */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {product.price.toFixed(2)} €
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                      Voir détails →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
