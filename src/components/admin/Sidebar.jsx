import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="fixed mt-9 inset-y-0 left-0 hidden w-64 border-r bg-white shadow-sm md:block h-full">
            <div className="p-8 text-xl font-bold text-blue-600">.</div>

      <nav className="space-y-2 px-6 pb-6 text-sm mt-4">
        <Link href="/admin/dashboard" className="block rounded px-4 py-2 hover:bg-gray-100">
          Dashboard
        </Link>
        <Link href="/admin/categories" className="block rounded px-4 py-2 hover:bg-gray-100">
          Categories
        </Link>
        <Link href="/admin/sub-categories" className="block rounded px-4 py-2 hover:bg-gray-100">
          Sub Categories
        </Link>
        <Link href="/admin/states" className="block rounded px-4 py-2 hover:bg-gray-100">
          States
        </Link>
        <Link href="/admin/districts" className="block rounded px-4 py-2 hover:bg-gray-100">
          Districts
        </Link>
        <Link href="/admin/areas" className="block rounded px-4 py-2 hover:bg-gray-100">
          Areas
        </Link>
        <Link href="/admin/businesses" className="block rounded px-4 py-2 hover:bg-gray-100">
          Business Listings
        </Link>
      </nav>
    </aside>
  );
}
