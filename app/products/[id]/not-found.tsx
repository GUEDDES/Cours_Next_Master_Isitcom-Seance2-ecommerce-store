// app/products/[id]/not-found.tsx

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-9xl mb-6">🔍</div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Produit non trouvé
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, le produit que vous recherchez n&apos;existe pas ou a été supprimé.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/products"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
          >
            Voir tous les produits
          </Link>
          
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
