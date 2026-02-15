// app/products/[id]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById, getAllProducts } from '@/app/lib/api';
import { Metadata } from 'next';

// Générer les routes statiques au build (SSG)
export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map(product => ({
    id: product.id.toString()
  }));
}

// Metadata dynamique (SEO)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);

    return {
      title: `${product.title} | E-Commerce Store`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: [product.image],
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Produit non trouvé',
    };
  }
}

// Page produit
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product;

  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          {' > '}
          <Link href="/products" className="hover:text-blue-600 transition-colors">Produits</Link>
          {' > '}
          <span className="text-gray-900 font-medium">{product.title.substring(0, 30)}...</span>
        </nav>

        {/* Layout 2 colonnes */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Colonne gauche : Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Colonne droite : Informations */}
            <div className="p-8 lg:p-12">
              {/* Badge catégorie */}
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-4 uppercase">
                {product.category}
              </span>

              {/* Titre */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-400 text-2xl">
                  {'★'.repeat(Math.round(product.rating.rate))}
                  {'☆'.repeat(5 - Math.round(product.rating.rate))}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.rating.rate} / 5
                </span>
                <span className="text-gray-500">
                  ({product.rating.count} avis)
                </span>
              </div>

              {/* Prix */}
              <div className="mb-8">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {product.price.toFixed(2)} €
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition font-semibold text-lg shadow-lg transform hover:scale-[1.02]">
                  🛒 Ajouter au panier
                </button>

                <button className="w-full bg-gray-100 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-200 transition font-semibold text-lg">
                  ❤️ Ajouter aux favoris
                </button>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations produit
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex">
                    <dt className="font-semibold w-32 text-gray-600">Catégorie :</dt>
                    <dd className="text-gray-800 capitalize">{product.category}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-semibold w-32 text-gray-600">Prix :</dt>
                    <dd className="text-gray-800">{product.price} €</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-semibold w-32 text-gray-600">Note :</dt>
                    <dd className="text-gray-800">{product.rating.rate} / 5</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-semibold w-32 text-gray-600">Avis :</dt>
                    <dd className="text-gray-800">{product.rating.count} avis clients</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            ← Retour aux produits
          </Link>
        </div>
      </div>
    </div>
  );
}
