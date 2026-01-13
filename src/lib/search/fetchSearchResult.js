// lib/search/fetchSearchResults.js
import { prisma } from "@/lib/prisma";

export async function fetchSearchResults({ category, filters }) {
  return prisma.business.findMany({
    where: {
      categorySlug: category,
      area: filters.area || undefined,
      rating: filters.rating ? { gte: Number(filters.rating) } : undefined,
      status: "ACTIVE",
    },
    orderBy: { isFeatured: "desc" },
    take: 20,
  });
}
