import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEXT_ONLY_PATTERN, validateNameField, validateUuid } from "@/utils/formValidation";

export async function PATCH(req, context) {
     const { id } = await context.params;
  const idValidation = validateUuid(id, "Area id");
  if (idValidation.error) {
    return NextResponse.json({ error: idValidation.error }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const nameValidation = validateNameField(body?.name, {
    label: "Area name",
    pattern: TEXT_ONLY_PATTERN,
  });
  if (nameValidation.error) {
    return NextResponse.json({ error: nameValidation.error }, { status: 400 });
  }

  try {
    const updated = await prisma.area.update({
      where: { id: idValidation.value },
      data: { name: nameValidation.value },
    });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Area already exists" }, { status: 400 });
      }
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Area not found" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "Unable to update area" }, { status: 500 });
  }
}

export async function DELETE(_req, context) {
     const { id } = await context.params;
  const idValidation = validateUuid(id, "Area id");
  if (idValidation.error) {
    return NextResponse.json({ error: idValidation.error }, { status: 400 });
  }

  try {
    await prisma.area.delete({ where: { id: idValidation.value } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Area not found" }, { status: 404 });
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Remove businesses linked to this area before deleting" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ error: "Unable to delete area" }, { status: 500 });
  }
}
