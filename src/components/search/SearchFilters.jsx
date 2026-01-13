"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SearchFilters({ category }) {
  const router = useRouter();
  const params = useSearchParams();

  function updateFilter(key, value) {
    const sp = new URLSearchParams(params.toString());
    value ? sp.set(key, value) : sp.delete(key);
    router.push(`?${sp.toString()}`);
  }

  return (
    <aside className="bg-white rounded shadow p-4">
      <h3 className="font-medium mb-3">Filters</h3>

      {category.filters.includes("area") && (
        <select onChange={e => updateFilter("area", e.target.value)}>
          <option value="">Area</option>
          <option value="patia">Patia</option>
          <option value="nayapalli">Nayapalli</option>
        </select>
      )}
    </aside>
  );
}
