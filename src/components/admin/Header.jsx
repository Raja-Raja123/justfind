"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/admin-login", { method: "DELETE" });
    } finally {
      router.push("/auth/admin-login");
      router.refresh();
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-white px-6 backdrop-blur gap-5 w-60">
      
        <div className="p-6 text-xl font-bold text-blue-600">ApnaBiz Admin</div>
      
         <button
        onClick={handleLogout}
        disabled={signingOut}
        className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 cursor-pointer"
      >
        {signingOut ? "Signing out…" : "Log out"}
      </button>
     
    </header>
  );
}
