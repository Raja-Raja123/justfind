import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { validateUuid } from "@/utils/formValidation";

async function toggleCategoryStatus(formData) {
  "use server";

  const categoryId = formData.get("categoryId");
  const validation = validateUuid(categoryId, "Category id");
  if (validation.error) {
    return;
  }

  const category = await prisma.category.findUnique({
    where: { id: validation.value },
    select: { status: true },
  });

  if (!category) {
    return;
  }

  await prisma.category.update({
    where: { id: validation.value },
    data: { status: !category.status },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/sub-categories");
  revalidatePath("/(business)/free-listing/form");
  revalidatePath("/api/business/form");
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="m-6 flex flex-col gap-6 justify-center">
      <div className="bg-white flex mx-auto gap-4 justify-between pb-4 w-[600px] p-6 mt-4">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Link
          href="/admin/categories/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Add Category
        </Link>
      </div>

      <div className="rounded-xl shadow overflow-hidden p-2 flex justify-center">
        <table className="w-[600px] text-md ">
          <thead className="bg-gray-100 border">
            <tr>
              <th className="p-4 text-left">Category Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody className="bg-gray-100">
            {categories.map(cat => (
              <tr key={cat.id} className="border">
                <td className="p-4">{cat.name}</td>

                <td className="p-4 align-middle">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      cat.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cat.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="text-right pr-4">
                  <form action={toggleCategoryStatus}>
                    <input type="hidden" name="categoryId" value={cat.id} />
                    <button className="text-blue-600 text-sm underline-offset-2 hover:underline">
                      {cat.status ? "Mark Inactive" : "Mark Active"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
