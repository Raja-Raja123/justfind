import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("category");


    if (!slug) {
      return NextResponse.json({ error: "Category slug required" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });

    if (!category) {
      return NextResponse.json({ category: null, businesses: [] });
    }

    const businesses = await prisma.business.findMany({
      where: {
        status: "ACTIVE",
        categoryId: category.id,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        category: { select: { name: true, slug: true } },
        area: { select: { name: true } },
      },
    });

    return NextResponse.json({ category, businesses });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
