"use client";

import React from "react";

// Keep original structure: support `compact` and `id` props.
export default function Input({ id = 'main-search' }) {
  return (
    <div id={id} className="bg-white shadow-md rounded-lg flex items-center p-3 gap-3 max-w-4xl">
      <input
        type="text"
        placeholder="📍 Bhubaneswar"
        className="border px-4 py-2 rounded w-1/4 outline-none"
      />

      <input
        type="text"
        placeholder="Search for Spa, Salon, Restaurant..."
        className="border px-4 py-2 rounded w-2/4 outline-none"
      />

      <button className="bg-orange-500 text-white px-6 py-2 rounded">🔍 Search</button>
    </div>
  );
}
              
