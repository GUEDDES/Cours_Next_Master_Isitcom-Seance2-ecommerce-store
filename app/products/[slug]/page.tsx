import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Produit non trouve",
    };
  }

  return {
    title: `${product.title} - My Shop`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image produit optimisee */}
        <div className="relative aspect-square">
          <Image
            src={product.imageUrl || "/placeholder-product.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-lg"
            priority // Image importante pour LCP
          />
        </div>

        {/* Details produit */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {product.title}
          </h1>
          
          {product.category && (
            <p className="text-gray-500 mt-2">
              Categorie : {product.category.name}
            </p>
          )}

          <p className="text-3xl font-bold text-blue-600 mt-4">
            {product.price.toFixed(2)} DT
          </p>

          <p className="text-gray-600 mt-4">
            {product.description}
          </p>

          <div className="mt-6">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
