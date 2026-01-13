import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  TEXT_ONLY_PATTERN,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

/* GET all sub categories */
export async function GET() {
  const data = await prisma.subCategory.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(data);
}

/* CREATE sub category */
export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let name;
    let categoryId;

    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      ({ name, categoryId } = body ?? {});
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      name = formData.get("name");
      categoryId = formData.get("categoryId");
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 415 }
      );
    }

    const nameValidation = validateNameField(name, {
      label: "Sub category name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const categoryValidation = validateUuid(categoryId, "Category");
    if (categoryValidation.error) {
      return NextResponse.json({ error: categoryValidation.error }, { status: 400 });
    }

    const subCategory = await prisma.subCategory.create({
      data: {
        name: nameValidation.value,
        categoryId: categoryValidation.value,
      },
      include: { category: true },
    });

    return NextResponse.json(subCategory, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Sub category already exists" },
        { status: 400 }
      );
    }

    console.error("Create sub category error:", error);
    return NextResponse.json(
      { error: "Unable to create sub category" },
      { status: 500 }
    );
  }
}
