import ResultCard from "./ResultCard";
import EmptyState from "./EmptyState";

export default function SearchResults({ results }) {
  if (!results.length) return <EmptyState />;

  return (
    <section className="lg:col-span-3 space-y-4">
      {results.map(item => (
        <ResultCard key={item.id} data={item} />
      ))}
    </section>
  );
}
