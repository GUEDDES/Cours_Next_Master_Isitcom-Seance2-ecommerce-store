// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-white text-sm font-medium mb-8">
            🎉 Nouveau catalogue disponible
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Découvrez notre
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Collection Premium
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            Explorez notre catalogue de produits de qualité avec les meilleures offres. 
            Livraison gratuite sur toutes les commandes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition shadow-2xl shadow-blue-500/25 transform hover:scale-105"
            >
              Voir les produits →
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition border border-white/20"
            >
              En savoir plus
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Livraison Gratuite</h3>
            <p className="text-gray-400">Sur toutes vos commandes sans minimum d&apos;achat</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-white mb-2">Paiement Sécurisé</h3>
            <p className="text-gray-400">Transactions 100% sécurisées et cryptées</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-white mb-2">Qualité Premium</h3>
            <p className="text-gray-400">Produits sélectionnés avec soin pour vous</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 E-Commerce Store - Projet Séance 2 Next.js</p>
          <p className="text-sm mt-2">ISITCOM - Master 1 SWM - Framework Frontend II</p>
        </div>
      </footer>
    </div>
  );
}
