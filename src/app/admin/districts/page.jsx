"use client";

import { useEffect, useState } from "react";
import {
  TEXT_ONLY_PATTERN,
  sanitizeSelectValue,
  sanitizeTextOnlyInput,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export default function AdminDistricts() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stateId, setStateId] = useState("");
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    fetch("/api/admin/states", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load states"))))
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch((error) => setFeedback({ type: "error", message: error.message }));
  }, []);

  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      return;
    }

    const validation = validateUuid(stateId, "State");
    if (validation.error) {
      setFeedback({ type: "error", message: validation.error });
      setDistricts([]);
      return;
    }

    fetch(`/api/admin/districts?stateId=${validation.value}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load districts"))))
      .then((data) => setDistricts(Array.isArray(data) ? data : []))
      .catch((error) => setFeedback({ type: "error", message: error.message }));
  }, [stateId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const nameValidation = validateNameField(name, {
      label: "District name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setFeedback({ type: "error", message: nameValidation.error });
      return;
    }

    const stateValidation = validateUuid(stateId, "State");
    if (stateValidation.error) {
      setFeedback({ type: "error", message: stateValidation.error });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/districts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValidation.value,
          stateId: stateValidation.value,
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to add district");
      }

      setName("");
      setFeedback({ type: "success", message: "District added successfully" });
      setDistricts((prev) => (payload?.id ? [payload, ...prev] : prev));
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to add district" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStateChange = (event) => {
    const nextValue = sanitizeSelectValue(event.target.value);
    setStateId(nextValue);
    setFeedback(null);
    setEditingId(null);
    setEditValue("");
  };

  const startEditing = (district) => {
    setEditingId(district.id);
    setEditValue(district.name);
    setFeedback(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    const idValidation = validateUuid(editingId, "District id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const nameValidation = validateNameField(editValue, {
      label: "District name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setFeedback({ type: "error", message: nameValidation.error });
      return;
    }

    setPendingAction(`update-${editingId}`);
    try {
      const res = await fetch(`/api/admin/districts/${idValidation.value}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValidation.value }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to update district");
      }

      setDistricts((prev) =>
        prev.map((district) => (district.id === payload.id ? payload : district))
      );
      setFeedback({ type: "success", message: "District updated" });
      cancelEditing();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to update district" });
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async (districtId) => {
    const idValidation = validateUuid(districtId, "District id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const confirmed = typeof window !== "undefined" ? window.confirm("Delete this district?") : true;
    if (!confirmed) return;

    setPendingAction(`delete-${districtId}`);
    try {
      const res = await fetch(`/api/admin/districts/${idValidation.value}`, {
        method: "DELETE",
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to delete district");
      }

      setDistricts((prev) => prev.filter((district) => district.id !== districtId));
      setFeedback({ type: "success", message: "District deleted" });
      if (editingId === districtId) {
        cancelEditing();
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to delete district" });
    } finally {
      setPendingAction(null);
    }
  };

    useEffect(() => {
      if (!feedback) return undefined;
      const timer = setTimeout(() => setFeedback(null), 3500);
      return () => clearTimeout(timer);
    }, [feedback]);

  return (
    <div className="px-6 py-6 w-[600px] mx-auto mt-6 bg-white">
      <h1 className="text-xl font-bold mb-4">District Management</h1>

      <select
        className="border p-2 px-8 w-full mb-3 rounded"
        value={stateId}
        onChange={handleStateChange}
      >
        <option value="">-- Select State --</option>
        {states.map((state) => (
          <option key={state.id} value={state.id}>
            {state.name}
          </option>
        ))}
      </select>

      {feedback && (
        <p
          className={`mb-4 rounded px-4 py-2 text-sm ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
          role="alert"
        >
          {feedback.message}
        </p>
      )}

      {stateId && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4 w-full">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="Enter district name"
              value={name}
              maxLength={80}
              onChange={(event) => setName(sanitizeTextOnlyInput(event.target.value))}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 rounded disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </form>

          <ul className="border rounded bg-white p-4 w-full">
            {districts.map((d) => (
              <li
                key={d.id}
                className="border-b p-2 last:border-none"
              >
                {editingId === d.id ? (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-2 sm:flex-row">
                    <input
                      className="border rounded px-4 py-2 flex-1"
                      value={editValue}
                      maxLength={80}
                      onChange={(event) => setEditValue(sanitizeTextOnlyInput(event.target.value))}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={pendingAction === `update-${d.id}`}
                        className="bg-green-600 text-black border px-3 py-1 rounded disabled:opacity-60"
                      >
                        {pendingAction === `update-${d.id}` ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="border px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <span>{d.name}</span>
                    <div className="flex gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => startEditing(d)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        className="text-red-600"
                        disabled={pendingAction === `delete-${d.id}`}
                      >
                        {pendingAction === `delete-${d.id}` ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
