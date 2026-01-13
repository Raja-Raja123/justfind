import Link from "next/link";

export default function ResultCard({ business }) {
  const phone = business?.phone?.trim?.() || "";
  const hasPhone = Boolean(phone);

  const areaText = business?.area?.name || "";
  const cityText = business?.city?.name || "";
  const location = [areaText, cityText].filter(Boolean).join(", ");

  const hrefSlug = business?.slug
    ? `/business/${business.slug}`
    : null;

  const categoryLabel =
    business?.subCategory?.name ||
    business?.category?.name ||
    "";

  const imageUrl =
    business?.coverImage ||
    business?.images?.[0] ||
    "/placeholder-business.jpg";

  return (
    <div className="relative z-10 max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-white">
  
  {/* Image */}
  <div className="w-full h-44 relative rounded-xl overflow-hidden mb-4 bg-gray-100">
    <img
      src={imageUrl}
      alt={business?.name}
      className="w-full h-full object-cover"
    />
  </div>

  {/* Title */}
  <h2 className="text-2xl font-semibold text-gray-900 truncate">
    {business?.name}
  </h2>

  {/* Category */}
  {categoryLabel && (
    <p className="text-sm text-gray-600 mt-1">
      {categoryLabel}
    </p>
  )}

  {/* Details Section */}
  <div className="mt-6 space-y-3 text-sm">

    {/* Rating */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500">Rating</span>
      <span className="flex items-center gap-2">
        <span className="bg-green-600 text-black text-xs px-2 py-0.5 rounded">
          ⭐ {business?.rating ?? "0"}
        </span>
        <span className="text-xs text-gray-500">
          ({business?.reviewCount ?? 0})
        </span>
      </span>
    </div>

    {/* Location */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500">Location</span>
      {location ? (
        <span className="text-gray-700 truncate max-w-[60%] text-right">
          {location}
        </span>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </div>

    {/* Phone */}
    <div className="flex justify-between items-center">
      <span className="text-gray-500">Mobile</span>
      {hasPhone ? (
        <a
          href={`tel:${phone}`}
          className="text-blue-600 font-medium hover:underline"
        >
          {phone}
        </a>
      ) : (
        <span className="text-gray-400">N/A</span>
      )}
    </div>

    {/* View Details */}
    <div className="flex justify-between items-center pt-2">
      <span className="text-gray-500">Details</span>
      {hrefSlug ? (
        <Link
          href={hrefSlug}
          className="text-blue-300 font-medium hover:underline"
        >
          View Details
        </Link>
      ) : (
        <span className="text-blue-500">View Details</span>
      )}
    </div>

  </div>
</div>

  );
}



