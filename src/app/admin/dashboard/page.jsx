import { prisma } from "@/lib/prisma";
import ApprovedBusinessList from "./ApprovedBusinessList";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const businesses = await prisma.business.findMany({
    where: { status: { in: ["ACTIVE", "INACTIVE"] } },
    orderBy: { updatedAt: "desc" },
    include: {
      category: true,
      area: {
        include: {
          district: {
            include: {
              state: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="flex flex-col gap-6 w-[600px] mx-auto p-8 mt-6">
      <section className="rounded-xl bg-white px-6 py-4 shadow-sm">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">Manage approved businesses and their visibility.</p>
      </section>

      <ApprovedBusinessList initialBusinesses={businesses} />
    </div>
  );
}