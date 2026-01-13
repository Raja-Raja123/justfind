"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TEXT_ONLY_PATTERN, sanitizeTextOnlyInput, validateNameField } from "@/utils/formValidation";

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const validation = validateNameField(name, {
      label: "Category name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: validation.value }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to create category");
      }

      setName("");
      router.push("/admin/categories");
    } catch (requestError) {
      setError(requestError.message || "Unable to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[600px] bg-white p-6 rounded-xl shadow mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Create Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            value={name}
            onChange={(event) => setName(sanitizeTextOnlyInput(event.target.value))}
            placeholder="Category name"
            className="w-full border px-3 py-2 rounded"
            maxLength={80}
            aria-label="Category name"
            required
          />
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60 mt-6"
        >
          {isSubmitting ? "Saving..." : "Save Category"}
        </button>
      </form>
    </div>
  );
}
