import { PrismaClient } from "@/generated/prisma";

// Prisma Client is generated under src/generated/prisma (see prisma/schema.prisma).
const globalForPrisma = globalThis;

const prismaClient =
  globalForPrisma.__prismaClient ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prismaClient = prismaClient;
}

export const prisma = prismaClient;
