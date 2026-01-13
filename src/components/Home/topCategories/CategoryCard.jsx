// components/home/CategoryCard.js
import Link from 'next/link'
import {categoryIcons} from '@/components/icons/categoryIcons';

export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/search/${category.slug}`}
      className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded bg-gray-50 text-2xl">
        {categoryIcons[category.slug] || '❓'}
      </div>

      <p className="text-sm font-medium text-center">
        {category.label}
      </p>
    </Link>
  )
}
