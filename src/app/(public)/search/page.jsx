export default function SearchPage({ searchParams }) {
  const { category, subcategory, city, q } = searchParams;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-4">
        Results for {subcategory || category || q}
      </h1>

      {/* Business cards will go here */}
    </div>
  );
}
