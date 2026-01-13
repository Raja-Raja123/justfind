import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BUSINESS_STATUSES = new Set(["PENDING", "ACTIVE", "INACTIVE", "REJECTED"]);

export async function GET(req) {
  const url = new URL(req.url, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  const requestedStatus = url.searchParams.get("status")?.toUpperCase() ?? "PENDING";

  let whereClause = { status: "PENDING" };
  if (requestedStatus === "ALL") {
    whereClause = undefined;
  } else if (BUSINESS_STATUSES.has(requestedStatus)) {
    whereClause = { status: requestedStatus };
  }

  const orderBy = whereClause?.status === "PENDING" ? { createdAt: "desc" } : { updatedAt: "desc" };

  const businesses = await prisma.business.findMany({
    where: whereClause,
    orderBy,
    include: {
      area: {
        include: {
          district: {
            include: {
              state: true
            }
          }
        }
      },
      category: true
    }
  });

  return NextResponse.json(businesses);
}
