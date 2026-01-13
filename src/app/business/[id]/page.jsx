import { prisma } from "@/lib/prisma";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function BusinessProfile(props) {
  const params = await props.params;
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Business not found</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-200 to-orange-200 flex flex-col-reverse items-center justify-center px-4 relative overflow-hidden">

    {/* Background Decorative Elements */}
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60"></div>

    {/* BACK TO HOME (background position) */}
    <div className="fixed bottom-6 left-20 z-10 bg-blue-100 p-3 rounded-lg">
      <Link
        href="/"
        className="text-sm text-blue-600 hover:underline font-medium "
      >
        ← Back to Home
      </Link>
    </div>

    {/* PROFILE CARD */}
    <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white">

     {/* Business Image */}
<div className="w-full h-44 relative rounded-xl overflow-hidden mb-4 bg-gray-100">
  <img
    src={
      business.images?.[0] ||
      "https://images.unsplash.com/photo-1556761175-4b46a572b786"
    }
    alt="Business"
    className="w-full h-full object-cover"
  />
</div>


      {/* Business Info */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {business.name}
      </h1>

      <p className="text-sm text-gray-600 mt-1">
        {business.category?.name}
      </p>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Mobile</span>
          <span>{business.phone}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">City</span>
          <span>{business.city || "—"}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-yellow-600 font-semibold">
            Under Verification
          </span>
        </div>
      </div>
    </div>

    
      {/* Verification Message */}
      <div className="fixed top-5 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
        ⏳ <strong>Your business listing is under review.</strong>
        <br />
        Our team is verifying the details you submitted.
        Once approved, your business will be visible to customers.
      </div>

  </div>
);
}