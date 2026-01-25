// app/products/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 text-center">
        {/* Icône d'erreur */}
        <div className="text-8xl mb-6">⚠️</div>

        {/* Titre */}
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Oups ! Une erreur est survenue
        </h1>

        {/* Message d'erreur */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-left max-w-2xl mx-auto">
          <p className="font-mono text-sm text-red-800">
            {error.message}
          </p>
          {error.digest && (
            <p className="text-xs text-red-600 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
          >
            Réessayer
          </button>

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
