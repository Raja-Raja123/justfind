import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateUuid } from "@/utils/formValidation";

export async function PATCH(_, { params }) {
  const validation = validateUuid(params?.id, "Category id");
  if (validation.error) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const category = await prisma.category.findUnique({
    where: { id: validation.value },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.category.update({
    where: { id: validation.value },
    data: { status: !category.status },
  });

  return NextResponse.json(updated);
}
