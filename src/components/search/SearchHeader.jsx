"use client";

import Link from "next/link";
import Input from "../layout/Input";
export default function SearchHeader({
  LocationInput,
  SearchInput,
  onSearch,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto  py-3 flex items-center gap-4 justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          JustFind
        </Link>

        {/* Location Input Slot */}
        <div className="">
         <Input/>
        </div>

             <div className="flex gap-3">
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
        </div>
    </header>
  );
}
