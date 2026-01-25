# E-Commerce Store - Next.js 15

Projet de catalogue e-commerce développé dans le cadre du cours **Framework Frontend II** (Séance 2) à l'ISITCOM.

## 📚 Description

Ce projet démontre les concepts avancés de Next.js 15 App Router :

- **Data Fetching** : Récupération de données depuis une API externe (FakeStore API)
- **Rendering Strategies** : SSG, SSR, ISR
- **Caching** : Request memoization, Data Cache, revalidation
- **Loading States** : Skeleton screens avec `loading.tsx`
- **Error Handling** : Error boundaries avec `error.tsx`
- **Dynamic Routes** : Pages produits dynamiques avec `[id]`
- **SEO** : Metadata statique et dynamique

---

## 📖 Partie Théorique

### 🔄 Les Stratégies de Rendu dans Next.js

Next.js propose plusieurs stratégies de rendu pour optimiser les performances et l'expérience utilisateur :

#### 1. SSG (Static Site Generation)
**Génération statique au moment du build.**

```
┌─────────────────────────────────────────────────────────────┐
│                     BUILD TIME                               │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐   │
│  │  Code    │───▶│  Next.js │───▶│  HTML/CSS/JS static  │   │
│  │  Source  │    │  Build   │    │  (prêt à servir)     │   │
│  └──────────┘    └──────────┘    └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     RUNTIME                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐   │
│  │  Client  │◀──▶│   CDN    │◀───│  Fichiers statiques  │   │
│  └──────────┘    └──────────┘    └──────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Avantages :**
- ⚡ Performances maximales (pages pré-rendues)
- 🌍 Distribuable sur CDN
- � Réduction des coûts serveur

**Cas d'usage :** Pages statiques (accueil, documentation, blog)

---

#### 2. SSR (Server-Side Rendering)
**Génération dynamique à chaque requête.**

```
┌─────────────────────────────────────────────────────────────┐
│                     À CHAQUE REQUÊTE                         │
│                                                              │
│  ┌────────┐    ┌────────────┐    ┌─────────┐    ┌────────┐  │
│  │ Client │───▶│ Serveur    │───▶│  API    │───▶│ Render │  │
│  │        │◀───│ Next.js    │◀───│ Externe │◀───│ HTML   │  │
│  └────────┘    └────────────┘    └─────────┘    └────────┘  │
│                                                              │
│  🔄 Le serveur génère une nouvelle page à chaque visite     │
└─────────────────────────────────────────────────────────────┘
```

**Implémentation :**
```typescript
// Force le SSR en désactivant le cache
fetch(url, { cache: 'no-store' })
```

**Avantages :**
- 🔄 Données toujours fraîches
- 🔐 Gestion des données sensibles côté serveur

**Inconvénients :**
- 🐢 Plus lent que SSG
- 💻 Charge serveur plus élevée

**Cas d'usage :** Tableaux de bord, pages personnalisées

---

#### 3. ISR (Incremental Static Regeneration)
**Le meilleur des deux mondes : statique + dynamique.**

```
┌─────────────────────────────────────────────────────────────┐
│                  ISR - REVALIDATION                          │
│                                                              │
│   Première requête    Requêtes suivantes    Après expiration│
│   ┌───────────┐       ┌───────────┐        ┌───────────┐    │
│   │  Génère   │       │  Sert     │        │ Régénère  │    │
│   │ + Cache   │──────▶│  depuis   │───────▶│ en        │    │
│   │           │       │  cache    │        │ arrière-  │    │
│   └───────────┘       └───────────┘        │ plan      │    │
│                                            └───────────┘    │
│                    ◀──── revalidate: 3600 ────▶             │
│                         (1 heure)                           │
└─────────────────────────────────────────────────────────────┘
```

**Implémentation dans ce projet :**
```typescript
// Revalidation toutes les heures
fetch(url, { next: { revalidate: 3600 } })

// Revalidation toutes les minutes (détail produit)
fetch(url, { next: { revalidate: 60 } })
```

**Avantages :**
- ⚡ Performances du statique
- 🔄 Fraîcheur des données
- 📈 Scalabilité

---

### 🏗️ Architecture App Router

Next.js 15 utilise l'App Router avec une architecture basée sur les fichiers :

```
app/
├── layout.tsx      ──────▶  Layout partagé (header, footer)
├── page.tsx        ──────▶  Route "/"
├── loading.tsx     ──────▶  État de chargement
├── error.tsx       ──────▶  Gestionnaire d'erreurs
├── not-found.tsx   ──────▶  Page 404
│
└── products/
    ├── page.tsx    ──────▶  Route "/products"
    ├── loading.tsx ──────▶  Loading spécifique aux produits
    ├── error.tsx   ──────▶  Error boundary produits
    │
    └── [id]/
        ├── page.tsx      ──▶  Route "/products/1", "/products/2"...
        └── loading.tsx   ──▶  Loading détail produit
```

---

### 🔄 Loading States (Suspense)

Le fichier `loading.tsx` utilise React Suspense pour afficher un état de chargement :

```
┌─────────────────────────────────────────────────────────────┐
│                   FLUX DE CHARGEMENT                         │
│                                                              │
│  1. Utilisateur navigue vers /products                       │
│           │                                                  │
│           ▼                                                  │
│  2. loading.tsx s'affiche immédiatement (Skeleton)          │
│           │                                                  │
│           ▼                                                  │
│  3. page.tsx fait le fetch des données                       │
│           │                                                  │
│           ▼                                                  │
│  4. page.tsx remplace loading.tsx avec les données          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Avantages :**
- 🎯 Améliore le [Largest Contentful Paint (LCP)](https://web.dev/lcp/)
- 👁️ Feedback visuel immédiat
- 🧠 Perception de rapidité améliorée

---

### ⚠️ Error Boundaries

Le fichier `error.tsx` capture les erreurs et empêche le crash de l'application :

```
┌─────────────────────────────────────────────────────────────┐
│                   GESTION DES ERREURS                        │
│                                                              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │    page.tsx  │────▶│   Erreur!    │────▶│  error.tsx   │ │
│  │  (throw)     │     │              │     │  (catch)     │ │
│  └──────────────┘     └──────────────┘     └──────────────┘ │
│                                                   │          │
│                                                   ▼          │
│                                            ┌──────────────┐ │
│                                            │   Affiche    │ │
│                                            │   UI erreur  │ │
│                                            │   + reset()  │ │
│                                            └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Fonctionnalités :**
- 🔄 Bouton "Réessayer" avec `reset()`
- 📝 Affichage du message d'erreur
- 🏠 Lien de retour à l'accueil

---

### 🔗 Navigation avec `<Link>`

Next.js utilise le composant `<Link>` pour la navigation client-side :

```typescript
// ✅ Correct - Navigation client-side
import Link from 'next/link';
<Link href="/products">Produits</Link>

// ❌ Incorrect - Recharge la page
<a href="/products">Produits</a>
```

**Avantages du `<Link>` :**
- ⚡ Navigation instantanée (pas de rechargement)
- 📦 Prefetching automatique des pages
- 🔄 Préservation de l'état React

---

### 📊 Système de Cache Next.js

```
┌─────────────────────────────────────────────────────────────┐
│                  COUCHES DE CACHE                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  1. Request Memoization                              │   │
│  │     └── Déduplique les requêtes identiques          │   │
│  │         dans le même render                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  2. Data Cache                                       │   │
│  │     └── Persiste les données entre les requêtes     │   │
│  │         Contrôlé par `revalidate`                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  3. Full Route Cache                                 │   │
│  │     └── Cache le HTML rendu des routes statiques    │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  4. Router Cache (côté client)                       │   │
│  │     └── Cache les pages visitées pour navigation    │   │
│  │         instantanée (back/forward)                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 🏷️ SEO avec Metadata

Next.js permet de définir les métadonnées pour le SEO :

```typescript
// Metadata statique
export const metadata = {
  title: 'Titre de la page',
  description: 'Description pour les moteurs de recherche'
};

// Metadata dynamique
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [product.image]
    }
  };
}
```

---

## 🚀 Technologies

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 15.x | Framework React avec App Router |
| **React** | 19.x | Bibliothèque UI |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 3.x | Framework CSS utilitaire |
| **FakeStore API** | - | API de produits fictifs |

---

## 📁 Structure du Projet

```
ecommerce-store/
├── app/
│   ├── lib/
│   │   └── api.ts              # Fonctions fetch API (ISR configuré)
│   ├── products/
│   │   ├── page.tsx            # Liste des produits (Server Component)
│   │   ├── loading.tsx         # Skeleton loading (Suspense)
│   │   ├── error.tsx           # Error boundary ('use client')
│   │   └── [id]/
│   │       ├── page.tsx        # Détail produit (Dynamic Route)
│   │       ├── loading.tsx     # Skeleton loading
│   │       └── not-found.tsx   # Page 404 personnalisée
│   ├── globals.css             # Styles globaux Tailwind
│   ├── layout.tsx              # Layout racine
│   └── page.tsx                # Page d'accueil
├── next.config.ts              # Configuration (domaines images)
├── tailwind.config.ts          # Configuration Tailwind
└── README.md
```

---

## 🛠️ Installation

```bash
# Cloner le repository
git clone <url-du-repo>

# Accéder au dossier
cd ecommerce-store

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

---

## 🌐 Routes Disponibles

| Route | Description | Stratégie | Revalidation |
|-------|-------------|-----------|--------------|
| `/` | Page d'accueil | SSG | Build time |
| `/products` | Catalogue produits | ISR | 1 heure |
| `/products/[id]` | Détail produit | ISR | 1 minute |

---

## 📖 Concepts Démontrés dans le Code

### 1. ISR (Incremental Static Regeneration)

```typescript
// app/lib/api.ts
export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    next: {
      revalidate: 3600 // Revalidation toutes les heures
    }
  });
  return res.json();
}
```

### 2. Server Components

```typescript
// app/products/page.tsx
// Composant serveur par défaut (pas de 'use client')
export default async function ProductsPage() {
  const products = await getAllProducts(); // Fetch côté serveur
  return <div>{/* Rendu avec données */}</div>;
}
```

### 3. Loading States avec Suspense

```typescript
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse bg-gray-200 h-64 rounded" />
      ))}
    </div>
  );
}
```

### 4. Error Boundaries

```typescript
// app/products/error.tsx
'use client'; // Obligatoire pour les error boundaries

export default function ErrorBoundary({ error, reset }) {
  return (
    <div>
      <h1>Une erreur est survenue</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

### 5. Metadata Dynamique

```typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  return {
    title: `${product.title} | E-Commerce Store`,
    description: product.description
  };
}
```

---

## 🧪 Tests et Vérification

### Vérifier ISR
1. Visitez `/products`
2. Notez l'heure de fetch dans les logs serveur
3. Rafraîchissez - les données viennent du cache
4. Attendez > 1 heure, rafraîchissez - régénération

### Vérifier Loading States
1. Ouvrez DevTools > Network > Slow 3G
2. Naviguez vers `/products`
3. Observez le skeleton pendant le chargement

### Vérifier Error Handling
1. Modifiez l'URL API dans `api.ts` (invalide)
2. Naviguez vers `/products`
3. L'error boundary s'affiche avec option "Réessayer"

---

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching](https://nextjs.org/docs/app/building-your-application/caching)

---

## 👨‍🏫 Auteur

**Abdelweheb GUEDDES**  
ISITCOM - Master 1 SWM  
Framework Frontend II - 2025/2026
