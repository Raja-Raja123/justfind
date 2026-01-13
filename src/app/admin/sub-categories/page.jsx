import { prisma } from "@/lib/prisma";
import SubCategoryManager from "./SubCategoryManager";

export default async function SubCategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { status: true },
    orderBy: { name: "asc" },
  });

  const subCategories = await prisma.subCategory.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <SubCategoryManager
      categories={categories}
      subCategories={subCategories}
    />
  );
}
