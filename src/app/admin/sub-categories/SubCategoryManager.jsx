"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TEXT_ONLY_PATTERN,
  sanitizeSelectValue,
  sanitizeTextOnlyInput,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export default function SubCategoryManager({ categories, subCategories }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingToggleId, setPendingToggleId] = useState(null);
  const [subCategoryList, setSubCategoryList] = useState(subCategories);

  useEffect(() => {
    setSubCategoryList(subCategories);
  }, [subCategories]);

  useEffect(() => {
    if (!statusMessage) return undefined;
    const timeoutId = setTimeout(() => {
      setStatusMessage(null);
      setStatusType(null);
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, [statusMessage]);

  const showStatus = (message, type) => {
    setStatusMessage(message);
    setStatusType(type);
  };

  const toggleStatus = async (id, currentStatus) => {
    const idValidation = validateUuid(id, "Sub category");
    if (idValidation.error) {
      showStatus(idValidation.error, "error");
      return;
    }

    setPendingToggleId(id);
    showStatus(null, null);
    try {
      const response = await fetch(`/api/admin/sub-categories/${idValidation.value}/status`, {
        method: "PATCH",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error || "Unable to update sub category status");
      }

      const updatedStatus = payload?.status ?? (currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE");
      setSubCategoryList((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: updatedStatus,
              }
            : item
        )
      );

      showStatus(`Sub category marked ${updatedStatus.toLowerCase()}.`, "success");
      router.refresh();
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      setPendingToggleId(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showStatus(null, null);

    const nameValidation = validateNameField(name, {
      label: "Sub category name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      showStatus(nameValidation.error, "error");
      return;
    }

    const categoryValidation = validateUuid(categoryId, "Category");
    if (categoryValidation.error) {
      showStatus(categoryValidation.error, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/sub-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValidation.value,
          categoryId: categoryValidation.value,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Unable to create sub category");
      }

      setName("");
      setCategoryId("");
      showStatus("Sub category created", "success");
      if (data?.id) {
        setSubCategoryList((prev) => [data, ...prev]);
      }
      router.refresh();
    } catch (error) {
      showStatus(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col mx-auto gap-4 w-[600px] mt-2">
      <div className="">
        <h1 className="text-2xl font-semibold">Sub Categories</h1>
        <p className="text-sm text-gray-500">Manage business sub categories</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm flex my-4 gap-4 md:flex-row"
      >
        <input
          name="name"
          type="text"
          placeholder="Sub Category Name"
          className="border rounded-lg px-4 py-2 w-full"
          value={name}
          maxLength={80}
          onChange={(event) =>
            setName(sanitizeTextOnlyInput(event.target.value))
          }
        />
        <select
          name="categoryId"
          className="border rounded-lg px-4 py-2"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(sanitizeSelectValue(event.target.value))
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 rounded-lg disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

      {statusMessage && (
        <div
          className={`rounded-lg px-4 py-3 text-sm transition-opacity duration-500 ${
            statusType === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {statusMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4">
        <table className="w-full text-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Sub Category</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Status</th>
              <th className="text-right p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {subCategoryList.map((sc) => (
              <tr key={sc.id} className="border-t">
                <td className="p-3">{sc.name}</td>
                <td className="p-3">{sc.category.name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      sc.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {sc.status.toLowerCase()}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleStatus(sc.id, sc.status)}
                    className="text-blue-600 text-sm underline-offset-2 hover:underline disabled:opacity-60"
                    disabled={pendingToggleId === sc.id}
                  >
                    {pendingToggleId === sc.id
                      ? "Updating..."
                      : sc.status === "ACTIVE"
                      ? "Mark Inactive"
                      : "Mark Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
