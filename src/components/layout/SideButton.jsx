"use client"

export default function SideButton() {
  return (
    <div className="fixed left-[95vw] top-1/2 -translate-y-1/2 z-50 flex flex-col gap-20">
      <a
        href=""
        className="bg-orange-500 text-white rotate-270 px-3 py-3 text-sm font-semibold rounded-tl-lg rounded-tr-lg shadow-lg hover:cursor-pointer transition w-26 text-center"
      >
        Advertise
      </a>
      <a
        href="/free-listing"
        className="bg-blue-600 text-white rotate-270 px-3 py-3 text-sm font-semibold rounded-tl-lg rounded-tr-lg shadow-lg hover:cursor-pointer transition w-26"
      >
        Free Listing
      </a>

    </div>
  );
}

