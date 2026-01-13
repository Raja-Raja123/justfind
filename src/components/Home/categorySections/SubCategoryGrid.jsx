import SubCategoryCard from "./SubCategoryCard";

export default function SubCategoryGrid({ items }) {
  return (
    <div className="grid  gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <SubCategoryCard
          key={item.slug}
          item={item}
        />
      ))}
    </div>
  );
}
