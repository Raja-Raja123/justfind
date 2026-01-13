"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login({ open, onClose }) {
  const [mobile, setMobile] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (open === false) return null;

  const handleSubmit = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    if (!agree) {
      setError("Please accept Terms & Conditions");
      return;
    }

    setError("");
    alert("OTP flow will be added later ✅");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Logo */}
        <h2 className="text-xl font-bold text-blue-600 mb-1">
          ApnaBiz
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Login for a seamless experience
        </p>

        {/* Mobile Input */}
        <label className="text-sm font-medium text-gray-700">
          Enter Mobile Number
        </label>

        <div className="mt-2 flex items-center rounded-lg border px-3 py-2">
          <span className="text-gray-600 mr-2">+91</span>
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter mobile number"
            className="w-full outline-none"
          />
        </div>

        {/* Checkbox */}
        <div className="mt-4 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          <span>
            I agree to the{" "}
            <span className="text-blue-600 cursor-pointer">
              Terms & Conditions
            </span>
          </span>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full rounded-lg bg-blue-600 py-3 text-white font-medium hover:bg-blue-700"
        >
          Login with OTP
        </button>

        {/* Divider */}
        <div className="my-4 text-center text-xs text-gray-400">
          OR
        </div>

        {/* Google (UI only) */}
        <button
          type="button"
          onClick={() => {
            onClose();
            router.push("/auth/admin-login");
          }}
          className="w-full rounded-lg border py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <i className="fa-solid fa-user-tie fa-lg text-gray-600"></i>
          Login as admin
        </button>

        {/* Skip */}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
