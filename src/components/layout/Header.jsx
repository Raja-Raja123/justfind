"use client";

import Link from "next/link";
import { useState } from "react";
import LoginModal from "@/components/authComponent/LoginModal";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white p-2 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            Apna<span className="text-orange-500">Biz</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-700">
          <Link href="#" className="hover:text-blue-600">EN</Link>
          <Link href="/advertise" className="hover:text-blue-600">Advertise</Link>
          <Link href="/free-listing" className="hover:text-blue-600">Free Listing</Link>

          {/* Login Button (opens modal) */}
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer"
          >
            Login / Sign Up
          </button>

          <Link
            href="/auth/admin-login"
            className="rounded-md border border-blue-200 px-4 py-2 font-medium text-blue-600 hover:border-blue-300 hover:text-blue-700"
          >
            Admin Login
          </Link>
        </div>

        {/* Render modal controlled by header */}
        {open && <LoginModal open={open} onClose={() => setOpen(false)} />}
      </div>
    </header>
  );
};

export default Header;
