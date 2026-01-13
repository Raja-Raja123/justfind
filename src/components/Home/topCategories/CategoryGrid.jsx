import CategoryCard from './CategoryCard'

export default function CategoryGrid({ categories }) {
  return (
    <section className="w-full py-6">
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
          />
        ))}
      </div>
    </section>
  )
}
