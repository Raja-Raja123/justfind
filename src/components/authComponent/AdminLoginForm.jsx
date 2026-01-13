"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  email: "",
  password: "",
};

function validateEmail(value) {
  return /.+@.+\..+/.test(value.trim());
}

export default function AdminLoginForm() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateEmail(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Unable to login");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 mx-auto w-[50vw] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_65%)]"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col gap-8 px-6 py-6">
        {/* Header */}
        <div className="space-y-8 text-center flex flex-col">
          <div className="mx-auto inline-flex w-1/2 items-center justify-center rounded-full bg-blue-100 px-4 py-1 text-[12px] font-semibold uppercase tracking-[0.35em] text-blue-600">
  Secure Access
</div>


          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-gray-900">
              Admin Sign In
            </h1>
            <p className="mx-auto max-w-xs text-sm text-gray-500">
              Manage listings, approvals, and state-wide data from the ApnaBiz
              console.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto space-y-5"
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Work email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        <div className="flex justify-center">
  <button
    type="submit"
    disabled={loading}
    className="h-18 w-2/4 min-w-[340px] rounded-lg bg-blue-600 px-10 py-2 text-white transition hover:bg-blue-700 cursor-pointer"
  >
    {loading ? "Logging in..." : "Login"}
  </button>
</div>


        
        </form>

        {/* Footer */}
        <div className="pt-4 text-center text-xs text-gray-500">
          <div className="mb-3 flex items-center justify-center gap-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
            <span>Audit</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>SSL</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>24/7 Ops</span>
          </div>

          <p>
            Need help?{" "}
            <span className="font-medium text-gray-700">
              support@apnabiz.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
