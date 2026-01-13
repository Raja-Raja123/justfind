"use client";

import { useEffect, useState } from "react";
import {
  TEXT_ONLY_PATTERN,
  sanitizeSelectValue,
  sanitizeTextOnlyInput,
  validateNameField,
  validateUuid,
} from "@/utils/formValidation";

export default function AdminAreas() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
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
      setDistrictId("");
      return;
    }

    const validation = validateUuid(stateId, "State");
    if (validation.error) {
      setFeedback({ type: "error", message: validation.error });
      setDistricts([]);
      setDistrictId("");
      return;
    }

    fetch(`/api/admin/districts?stateId=${validation.value}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load districts"))))
      .then((data) => setDistricts(Array.isArray(data) ? data : []))
      .catch((error) => setFeedback({ type: "error", message: error.message }));
  }, [stateId]);

  useEffect(() => {
    if (!districtId) {
      setAreas([]);
      return;
    }

    const validation = validateUuid(districtId, "District");
    if (validation.error) {
      setFeedback({ type: "error", message: validation.error });
      setAreas([]);
      return;
    }

    fetch(`/api/admin/areas?districtId=${validation.value}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Unable to load areas"))))
      .then((data) => setAreas(Array.isArray(data) ? data : []))
      .catch((error) => setFeedback({ type: "error", message: error.message }));
  }, [districtId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    const nameValidation = validateNameField(name, {
      label: "Area name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setFeedback({ type: "error", message: nameValidation.error });
      return;
    }

    const districtValidation = validateUuid(districtId, "District");
    if (districtValidation.error) {
      setFeedback({ type: "error", message: districtValidation.error });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameValidation.value,
          districtId: districtValidation.value,
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to add area");
      }

      setName("");
      setFeedback({ type: "success", message: "Area added successfully" });
      setAreas((prev) => (payload?.id ? [payload, ...prev] : prev));
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to add area" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStateChange = (event) => {
    setStateId(sanitizeSelectValue(event.target.value));
    setFeedback(null);
    setEditingId(null);
    setEditValue("");
  };

  const handleDistrictChange = (event) => {
    setDistrictId(sanitizeSelectValue(event.target.value));
    setFeedback(null);
    setEditingId(null);
    setEditValue("");
  };

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const startEditing = (area) => {
    setEditingId(area.id);
    setEditValue(area.name);
    setFeedback(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingId) return;

    const idValidation = validateUuid(editingId, "Area id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const nameValidation = validateNameField(editValue, {
      label: "Area name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setFeedback({ type: "error", message: nameValidation.error });
      return;
    }

    setPendingAction(`update-${editingId}`);
    try {
      const res = await fetch(`/api/admin/areas/${idValidation.value}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValidation.value }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to update area");
      }

      setAreas((prev) => prev.map((area) => (area.id === payload.id ? payload : area)));
      setFeedback({ type: "success", message: "Area updated" });
      cancelEditing();
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to update area" });
    } finally {
      setPendingAction(null);
    }
  };

  const handleDelete = async (areaId) => {
    const idValidation = validateUuid(areaId, "Area id");
    if (idValidation.error) {
      setFeedback({ type: "error", message: idValidation.error });
      return;
    }

    const confirmed = typeof window !== "undefined" ? window.confirm("Delete this area?") : true;
    if (!confirmed) return;

    setPendingAction(`delete-${areaId}`);
    try {
      const res = await fetch(`/api/admin/areas/${idValidation.value}`, {
        method: "DELETE",
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to delete area");
      }

      setAreas((prev) => prev.filter((area) => area.id !== areaId));
      setFeedback({ type: "success", message: "Area deleted" });
      if (editingId === areaId) {
        cancelEditing();
      }
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to delete area" });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="px-6 py-8 w-[600px] mx-auto mt-6 bg-white">
      <h1 className="text-xl font-bold mb-4">Area Management</h1>

      <select
        className="border p-2 w-full mb-3 rounded"
        value={stateId}
        onChange={handleStateChange}
      >
        <option value="">-- Select State --</option>
        {states.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      {districts.length > 0 && (
        <select
          className="border p-2 w-full mb-3 rounded"
          value={districtId}
          onChange={handleDistrictChange}
        >
          <option value="">-- Select District --</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      )}

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

      {districtId && (
        <>
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              className="border p-2 flex-1 rounded"
              placeholder="Enter area name"
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

          <ul className="border rounded bg-white">
            {areas.map((a) => (
              <li
                key={a.id}
                className="border-b p-2 last:border-none"
              >
                {editingId === a.id ? (
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
                        disabled={pendingAction === `update-${a.id}`}
                        className="bg-green-600 text-black border px-3 py-1 rounded disabled:opacity-60"
                      >
                        {pendingAction === `update-${a.id}` ? "Saving..." : "Save"}
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
                    <span>{a.name}</span>
                    <div className="flex gap-2 text-sm">
                      <button
                        type="button"
                        onClick={() => startEditing(a)}
                        className="text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600"
                        disabled={pendingAction === `delete-${a.id}`}
                      >
                        {pendingAction === `delete-${a.id}` ? "Deleting..." : "Delete"}
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
