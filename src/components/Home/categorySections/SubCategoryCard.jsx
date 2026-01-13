import Link from "next/link";
import Image from "next/image";

export default function SubCategoryCard({ item }) {
  return (
    <Link
      href={`/search?subcategory=${item.slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl ">
        <Image
          src={item.image}
          alt={item.label}
          width={300}
          height={200}
          className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <p className="mt-2 text-center text-sm font-medium text-gray-800">
        {item.label}
      </p>
    </Link>
  );
}
