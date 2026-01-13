"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TEXT_ONLY_PATTERN,
  sanitizeTextOnlyInput,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export default function AdminStates() {
  const [name, setName] = useState("");
  const [states, setStates] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  const fetchStates = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/states", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unable to load states");
      }
      const data = await res.json();
      setStates(Array.isArray(data) ? data : []);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to load states" });
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const validation = validateNameField(name, {
      label: "State name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (validation.error) {
      setFeedback({ type: "error", message: validation.error });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: validation.value }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to add state");
      }

      setName("");
      setFeedback({ type: "success", message: "State added successfully" });
      fetchStates();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to add state" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (state) => {
    setEditingId(state.id);
    setEditValue(state.name);
    setFeedback(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    setFeedback(null);
    const idValidation = validateUuid(editingId, "State id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const nameValidation = validateNameField(editValue, {
      label: "State name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setFeedback({ type: "error", message: nameValidation.error });
      return;
    }

    setPendingAction(`update-${editingId}`);
    try {
      const res = await fetch(`/api/admin/states/${idValidation.value}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValidation.value }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to update state");
      }

      setStates((prev) =>
        prev.map((item) => (item.id === payload.id ? payload : item))
      );
      setFeedback({ type: "success", message: "State updated" });
      cancelEditing();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to update state" });
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async (stateId) => {
    setFeedback(null);
    const idValidation = validateUuid(stateId, "State id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const confirmed = typeof window !== "undefined" ? window.confirm("Delete this state?") : true;
    if (!confirmed) return;

    setPendingAction(`delete-${stateId}`);
    try {
      const res = await fetch(`/api/admin/states/${idValidation.value}`, {
        method: "DELETE",
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to delete state");
      }

      setStates((prev) => prev.filter((item) => item.id !== stateId));
      setFeedback({ type: "success", message: "State deleted" });
      if (editingId === stateId) {
        cancelEditing();
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to delete state" });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="px-6 py-6 max-w-[600px] mx-auto">
      <h1 className="text-xl font-bold mb-4">State Management</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4 md:flex-row">
        <input
          className="border px-4 flex-1 rounded bg-white"
          placeholder="Enter state name"
          value={name}
          maxLength={80}
          onChange={(event) => setName(sanitizeTextOnlyInput(event.target.value))}
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {isSubmitting ? "Adding..." : "Add"}
        </button>
      </form>

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

      <ul className="border rounded bg-white">
        {states.map((state) => {
          const isEditing = editingId === state.id;
          const pendingUpdate = pendingAction === `update-${state.id}`;
          const pendingDelete = pendingAction === `delete-${state.id}`;

          return (
            <li
              key={state.id}
              className="border-b p-2 last:border-none"
            >
              {isEditing ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    value={editValue}
                    maxLength={80}
                    onChange={(event) => setEditValue(sanitizeTextOnlyInput(event.target.value))}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={pendingUpdate}
                      className="bg-green-600 text-black border px-3 py-1 rounded disabled:opacity-60"
                    >
                      {pendingUpdate ? "Saving..." : "Save"}
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
                <div className="flex items-center justify-between w-[600px] gap-3 p-2">
                  <span>{state.name}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(state)}
                      className="text-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(state.id)}
                      className="text-red-600 text-sm"
                      disabled={pendingDelete}
                    >
                      {pendingDelete ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
