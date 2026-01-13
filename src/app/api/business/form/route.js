import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeDataUrlImages,
  sanitizeTextInput,
  validateMobileNumber,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export async function GET() {
  try {
    const [categories, states] = await Promise.all([
      prisma.category.findMany({
        where: { status: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          subCategories: {
            where: { status: "ACTIVE" },
            orderBy: { name: "asc" },
            select: { id: true, name: true },
          },
        },
      }),
      prisma.state.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          districts: {
            orderBy: { name: "asc" },
            select: {
              id: true,
              name: true,
              areas: {
                orderBy: { name: "asc" },
                select: { id: true, name: true },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ categories, states });
  } catch (error) {
    console.error("Business form GET error:", error);
    return NextResponse.json(
      { error: "Unable to load form data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const nameValidation = validateNameField(body?.businessName, { label: "Business name" });
    if (nameValidation.error) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    const mobileValidation = validateMobileNumber(body?.mobile);
    if (mobileValidation.error) {
      return NextResponse.json({ error: mobileValidation.error }, { status: 400 });
    }

    const categoryValidation = validateUuid(body?.categoryId, "Category");
    if (categoryValidation.error) {
      return NextResponse.json({ error: categoryValidation.error }, { status: 400 });
    }

    const subCategoryValidation = validateUuid(body?.subCategoryId, "Sub category");
    if (subCategoryValidation.error) {
      return NextResponse.json({ error: subCategoryValidation.error }, { status: 400 });
    }

    const areaValidation = validateUuid(body?.areaId, "Area");
    if (areaValidation.error) {
      return NextResponse.json({ error: areaValidation.error }, { status: 400 });
    }

    const [area, category, subCategory] = await Promise.all([
      prisma.area.findUnique({ where: { id: areaValidation.value } }),
      prisma.category.findFirst({
        where: { id: categoryValidation.value, status: true },
        select: { id: true },
      }),
      prisma.subCategory.findFirst({
        where: {
          id: subCategoryValidation.value,
          status: "ACTIVE",
        },
        select: { id: true, categoryId: true },
      }),
    ]);

    if (!area) {
      return NextResponse.json(
        { error: "Invalid area selected" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Invalid category selected" },
        { status: 400 }
      );
    }

    if (!subCategory) {
      return NextResponse.json(
        { error: "Invalid sub category selected" },
        { status: 400 }
      );
    }

    if (subCategory.categoryId !== category.id) {
      return NextResponse.json(
        { error: "Sub category does not belong to selected category" },
        { status: 400 }
      );
    }

    const sanitizedImages = sanitizeDataUrlImages(body?.images, 5);

    const business = await prisma.business.create({
      data: {
        name: sanitizeTextInput(nameValidation.value),
        phone: mobileValidation.value,
        categoryId: category.id,
        areaId: area.id,
        images: sanitizedImages,
      },
    });

    return NextResponse.json(
      {
        success: true,
        businessId: business.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create business error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
