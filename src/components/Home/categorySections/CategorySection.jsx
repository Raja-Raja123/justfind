export default function CategorySection({ title, children }) {
  return (
    <section className="rounded-xl border bg-white p-5 w-[47%] ">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {title}
      </h2>

      {children}
     
    </section>
      
  );
}
