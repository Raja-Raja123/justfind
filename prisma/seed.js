import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Electrician" },
      { name: "Restaurant" },
      { name: "Salon" },
      { name: "Packers & Movers" },
    ],
  });

  console.log("Seed data inserted ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
