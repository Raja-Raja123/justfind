import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUuid } from "@/utils/formValidation";

const extractBusinessId = (req, params) => {
  if (params?.id) return params.id;

  const pathname = req.nextUrl?.pathname;
  if (!pathname) return undefined;

  const segments = pathname.split("/").filter(Boolean);
  const statusIndex = segments.lastIndexOf("status");
  if (statusIndex > 0) {
    return segments[statusIndex - 1];
  }

  const businessesIndex = segments.lastIndexOf("businesses");
  if (businessesIndex >= 0 && segments[businessesIndex + 1]) {
    return segments[businessesIndex + 1];
  }

  return undefined;
};

const ALLOWED_STATUS_UPDATES = new Set(["ACTIVE", "INACTIVE", "REJECTED"]);

export async function PATCH(req, context = {}) {
  try {
    const id = extractBusinessId(req, context.params);
    const idValidation = validateUuid(id, "Business id");
    if (idValidation.error) {
      return NextResponse.json(
        { error: idValidation.error },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const status = body?.status;

    if (!status || !ALLOWED_STATUS_UPDATES.has(status)) {
      return NextResponse.json(
        { error: "Status must be ACTIVE, INACTIVE or REJECTED" },
        { status: 400 }
      );
    }

    const business = await prisma.business.update({
      where: { id: idValidation.value },
      data: { status },
    });

    return NextResponse.json(business, { status: 200 });
  } catch (error) {
    console.error("Update business status error", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json(
        { error: "Business request not found or already processed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update business status" },
      { status: 500 }
    );
  }
}
