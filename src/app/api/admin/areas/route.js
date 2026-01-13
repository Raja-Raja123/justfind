import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  TEXT_ONLY_PATTERN,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const nameValidation = validateNameField(body?.name, {
      label: "Area name",
      pattern: TEXT_ONLY_PATTERN,
    });
    const districtValidation = validateUuid(body?.districtId, "District");

    if (nameValidation.error) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    if (districtValidation.error) {
      return NextResponse.json({ error: districtValidation.error }, { status: 400 });
    }

    const area = await prisma.area.create({
      data: {
        name: nameValidation.value,
        districtId: districtValidation.value,
      },
    });

    return NextResponse.json(area, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Area already exists in this district" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create area" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const districtId = new URL(req.url).searchParams.get("districtId");

  if (!districtId) {
    return NextResponse.json([]);
  }

  const districtValidation = validateUuid(districtId, "District");
  if (districtValidation.error) {
    return NextResponse.json({ error: districtValidation.error }, { status: 400 });
  }

  const areas = await prisma.area.findMany({
    where: { districtId: districtValidation.value },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(areas);
}
