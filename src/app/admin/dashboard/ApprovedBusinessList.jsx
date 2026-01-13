"use client";

import { useEffect, useState } from "react";

const statusBadgeClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "INACTIVE":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

export default function ApprovedBusinessList({ initialBusinesses }) {
  const [businesses, setBusinesses] = useState(initialBusinesses ?? []);
  const [pendingAction, setPendingAction] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!feedback) return undefined;
    const timeoutId = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(timeoutId);
  }, [feedback]);

  const activeCount = businesses.filter((b) => b.status === "ACTIVE").length;
  const inactiveCount = businesses.length - activeCount;

  const updateStatus = async (id, nextStatus) => {
    setFeedback(null);
    setPendingAction(`${id}-${nextStatus}`);
    try {
      const res = await fetch(`/api/admin/businesses/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to update business status");
      }

      const updatedBusiness = payload?.id ? payload : null;
      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === id
            ? {
                ...business,
                status: nextStatus,
                updatedAt: updatedBusiness?.updatedAt ?? new Date().toISOString(),
              }
            : business
        )
      );
      setFeedback({ type: "success", message: `Business marked ${nextStatus.toLowerCase()}.` });
    } catch (error) {
      console.error("Approved business status toggle error", error);
      setFeedback({ type: "error", message: error.message || "Failed to update business" });
    } finally {
      setPendingAction(null);
    }
  };

  if (businesses.length === 0) {
    return (
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Approved Businesses</h3>
        <p className="mt-2 text-sm text-gray-500">No businesses have been approved yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4  lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold">Approved Businesses</h3>
          <p className="text-sm text-gray-500">Manage live listings and switch visibility as needed.</p>
        </div>
        <div className="grid gap-3 grid-cols-2 lg:w-auto">
          <div className="rounded-lg border border-green-100 bg-green-50 px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-green-700">Active</p>
            <p className="text-lg font-semibold text-green-900">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Inactive</p>
            <p className="text-lg font-semibold text-amber-900">{inactiveCount}</p>
          </div>
        </div>
      </div>

      {feedback && (
        <p
          className={`mt-4 rounded-md px-4 py-2 text-sm transition-opacity duration-500 ${
            feedback.type === "success" ? "bg-green-200 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {feedback.message}
        </p>
      )}

      <div className="mt-6 flex flex-wrap  gap-4">
        {businesses.map((business) => {
          const isActive = business.status === "ACTIVE";
          const nextStatus = isActive ? "INACTIVE" : "ACTIVE";
          const pendingKey = `${business.id}-${nextStatus}`;

          return (
            <div
              key={business.id}
              className="rounded-lg border bg-white p-4 shadow-sm flex"
            >
              <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(180px,1fr)]">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-gray-900">{business.name}</h4>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {business.category?.name || "Uncategorized"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    📞 {business.phone} · {business.area?.name}, {business.area?.district?.name}, {" "}
                    {business.area?.district?.state?.name}
                  </p>
                  <p className="text-xs text-gray-500">Updated {formatDateTime(business.updatedAt)}</p>
                </div>

                <div className="flex justify-between gap-3 rounded-lg bg-gray-50 p-3 text-sm md:items-end">
                  <div className="flex items-center justify-between gap-3 md:flex-col md:items-end md:gap-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(business.status)}`}
                    >
                      {business.status.toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => updateStatus(business.id, nextStatus)}
                    className={`rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"
                    }`}
                    disabled={pendingAction === pendingKey}
                  >
                    {pendingAction === pendingKey
                      ? "Updating..."
                      : isActive
                      ? "Mark inactive"
                      : "Mark active"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
