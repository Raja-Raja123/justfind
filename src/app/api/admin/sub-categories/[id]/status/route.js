import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { validateUuid } from "@/utils/formValidation";

export async function PATCH(_request, context) {

   const { id } = await context.params;
  const validation = validateUuid(id, "Sub category id");

  if (validation.error) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  const existing = await prisma.subCategory.findUnique({
    where: { id: validation.value },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Sub category not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.subCategory.update({
    where: { id: validation.value },
    data: {
      status: existing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    },
  });

  revalidatePath("/admin/sub-categories");
  revalidatePath("/api/admin/sub-categories");

  return NextResponse.json(updated);
}
