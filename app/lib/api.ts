// app/lib/api.ts

const API_URL = 'https://fakestoreapi.com';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Fetch tous les produits
 * @returns Liste des produits
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: {
        revalidate: 3600 // ISR : 1 heure
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const products = await res.json();
    return products;
  } catch (error) {
    console.error('Erreur fetch products:', error);
    throw new Error('Impossible de récupérer les produits');
  }
}

/**
 * Fetch un produit par ID
 * @param id - ID du produit
 * @returns Produit
 */
export async function getProductById(id: string): Promise<Product> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: {
        revalidate: 60 // ISR : 1 minute
      }
    });

    if (!res.ok) {
      throw new Error(`Produit ${id} non trouvé`);
    }

    const product = await res.json();
    return product;
  } catch (error) {
    console.error(`Erreur fetch product ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch toutes les catégories
 * @returns Catégories
 */
export async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/products/categories`, {
      next: {
        revalidate: 86400 // ISR : 24 heures
      }
    });

    if (!res.ok) {
      throw new Error('Erreur catégories');
    }

    return res.json();
  } catch (error) {
    console.error('Erreur fetch categories:', error);
    return [];
  }
}

/**
 * Fetch produits par catégorie
 * @param category - Nom de la catégorie
 * @returns Produits de la catégorie
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products/category/${category}`, {
      next: {
        revalidate: 3600 // ISR : 1 heure
      }
    });

    if (!res.ok) {
      throw new Error(`Catégorie ${category} non trouvée`);
    }

    return res.json();
  } catch (error) {
    console.error(`Erreur fetch category ${category}:`, error);
    throw error;
  }
}
