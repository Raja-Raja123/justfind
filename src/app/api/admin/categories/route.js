import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TEXT_ONLY_PATTERN, validateNameField } from "@/utils/formValidation";

/* GET all categories */
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(categories);
}

/* CREATE category */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const validation = validateNameField(body?.name, {
      label: "Category name",
      pattern: TEXT_ONLY_PATTERN,
    });

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name: validation.value },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create category" },
      { status: 500 }
    );
  }
}
