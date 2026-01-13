"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ResultCard from "@/components/search/ResultCard";

export default function CategorySearchPage() {
  const { category } = useParams();

  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    if (!category) return;

    async function fetchData() {
      try {
        const res = await fetch(
          `/api/search/category?category=${category}`
        );

        const data = await res.json();

        setCategoryData(data.category);
        setBusinesses(data.businesses || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!categoryData) {
    return <p className="p-6">Category not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-xl font-semibold mb-6">
        {categoryData.name}
      </h1>

      {businesses.length === 0 ? (
        <p className="text-gray-500">No businesses found.</p>
      ) : (
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 xl:grid-cols-3 place-items-center h-full bg-gray-200">
          {businesses.map((business) => (
            <ResultCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
}
