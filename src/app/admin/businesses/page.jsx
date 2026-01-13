"use client";

import { useEffect, useState } from "react";

export default function AdminBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/admin/businesses?status=PENDING", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Unable to load businesses");
      }
      const data = await res.json();
      setBusinesses(data);
    } catch (error) {
      console.error("Fetch businesses error", error);
      setErrorMessage("Unable to load business requests");
    }
  };

  const updateStatus = async (id, status) => {
    setErrorMessage(null);
    setPendingAction(`${id}-${status}`);
    try {
      const res = await fetch(`/api/admin/businesses/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to update status");
      }

      setBusinesses((prev) => prev.filter((business) => business.id !== id));
    } catch (error) {
      console.error("Update status error", error);
      setErrorMessage(error.message || "Failed to update business");
      await fetchBusinesses();
    } finally {
      setPendingAction(null);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <div className="px-6 py-6 w-[600px] mx-auto mt-6 bg-white">
      <h1 className="text-xl font-bold mb-4">
        Business Listing Requests
      </h1>

      {errorMessage && (
        <p className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}

      {businesses.length === 0 && (
        <p className="text-gray-500">No pending requests</p>
      )}

      <div className="space-y-4">
        {businesses.map((b) => (
          <div
            key={b.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{b.name}</h2>
              <p className="text-sm text-gray-600">
                📞 {b.phone}
              </p>
              <p className="text-sm text-gray-600">
                📍 {b.area.name}, {b.area.district.name},{" "}
                {b.area.district.state.name}
              </p>
              <p className="text-xs text-gray-500">
                Requested on {new Date(b.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(b.id, "ACTIVE")}
                className="bg-green-100 text-black px-3 py-1 rounded disabled:opacity-60"
                disabled={pendingAction === `${b.id}-ACTIVE`}
              >
                {pendingAction === `${b.id}-ACTIVE` ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => updateStatus(b.id, "REJECTED")}
                className="bg-red-100 text-black px-3 py-1 rounded disabled:opacity-60"
                disabled={pendingAction === `${b.id}-REJECTED`}
              >
                {pendingAction === `${b.id}-REJECTED` ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
