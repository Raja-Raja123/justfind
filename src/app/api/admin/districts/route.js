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
      label: "District name",
      pattern: TEXT_ONLY_PATTERN,
    });
    const stateValidation = validateUuid(body?.stateId, "State");

    if (nameValidation.error) {
      return NextResponse.json({ error: nameValidation.error }, { status: 400 });
    }

    if (stateValidation.error) {
      return NextResponse.json({ error: stateValidation.error }, { status: 400 });
    }

    const district = await prisma.district.create({
      data: {
        name: nameValidation.value,
        stateId: stateValidation.value,
      },
    });

    return NextResponse.json(district, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "District already exists in this state" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create district" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get("stateId");

  if (!stateId) {
    return NextResponse.json([], { status: 200 });
  }

  const stateValidation = validateUuid(stateId, "State");
  if (stateValidation.error) {
    return NextResponse.json({ error: stateValidation.error }, { status: 400 });
  }

  const districts = await prisma.district.findMany({
    where: { stateId: stateValidation.value },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(districts);
}
