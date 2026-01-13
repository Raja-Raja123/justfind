import Link from "next/link";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <section
      className="fixed inset-0 min-h-screen min-w-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <AdminLoginForm />
      <div className="absolute top-5 left-8 z-50">
  <Link
    href="/"
    className="inline-flex items-center gap-2 rounded-lg bg-white p-3 text-sm font-medium text-gray-700 shadow-lg ring-1 ring-black/5 hover:bg-gray-50"
  >
    ← Back to Home
  </Link>
</div>

    </section>
     
  
  );
}
