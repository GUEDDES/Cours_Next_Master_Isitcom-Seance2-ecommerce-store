let prisma;

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  prisma = new PrismaClient();

  // Clean up existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  await prisma.category.createMany({
    data: [
      { name: "Vetements", slug: "vetements" },
      { name: "Electronique", slug: "electronique" },
      { name: "Accessoires", slug: "accessoires" },
    ],
  });

  const catList = await prisma.category.findMany();
  const getCatId = (slug) => catList.find((c) => c.slug === slug)?.id;

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        title: "T-shirt noir",
        slug: "t-shirt-noir",
        description: "T-shirt 100% coton, coupe regular.",
        price: 29.9,
        stock: 50,
        imageUrl: "https://picsum.photos/seed/tshirt/800/600",
        categoryId: getCatId("vetements"),
      },
      {
        title: "Casque Bluetooth",
        slug: "casque-bluetooth",
        description: "Casque audio sans fil, reduction de bruit.",
        price: 199.0,
        stock: 15,
        imageUrl: "https://picsum.photos/seed/headphones/800/600",
        categoryId: getCatId("electronique"),
      },
      {
        title: "Sac a dos",
        slug: "sac-a-dos",
        description: "Sac robuste, ideal pour ordinateur portable.",
        price: 89.0,
        stock: 20,
        imageUrl: "https://picsum.photos/seed/bag/800/600",
        categoryId: getCatId("accessoires"),
      },
    ],
  });

  console.log("Seed termine : categories et produits inseres.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });
