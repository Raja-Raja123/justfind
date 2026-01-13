const { PrismaClient } = require("../src/generated/prisma");

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.business.count();
    console.log("Business count:", count);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("Prisma check failed", err);
  process.exit(1);
});
