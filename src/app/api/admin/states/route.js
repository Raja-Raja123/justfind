import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TEXT_ONLY_PATTERN, validateNameField } from "@/utils/formValidation";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    const validation = validateNameField(body?.name, {
      label: "State name",
      pattern: TEXT_ONLY_PATTERN,
    });

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const state = await prisma.state.create({
      data: { name: validation.value },
    });

    return NextResponse.json(state, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "State already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create state" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(states);
}
