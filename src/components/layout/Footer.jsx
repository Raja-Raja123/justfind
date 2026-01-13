import Link from "next/link";


export default function Footer() {
  return (
    <footer className="bg-white text-gray-700  ">
    <hr />

            <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left: Follow Us */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            Follow us on
          </span>

          <div className="flex items-center gap-3 text-xl">
            <Link href="#" aria-label="Facebook">📘</Link>
            <Link href="#" aria-label="YouTube">▶️</Link>
            <Link href="#" aria-label="Instagram">📸</Link>
            <Link href="#" aria-label="LinkedIn">💼</Link>
            <Link href="#" aria-label="X">❌</Link>
          </div>
        </div>

        {/* Right: App Buttons */}
        <div className="flex items-center gap-3">
          <Link href="#">
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="Download on App Store"
              className="h-10"
            />
          </Link>

          <Link href="#">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-10"
            />
          </Link>
        </div>

      </div>
    </div>

      {/* =======================
          TOP DESCRIPTION
      ======================= */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          One-Stop for All Local Businesses, Services & Stores Nearby Across India
        </h2>

        <p className="text-sm leading-relaxed mb-4">
          Welcome to ApnaBiz, your one-stop platform to discover trusted local
          businesses, services, and professionals near you. From daily needs
          to exclusive planning and purchasing decisions, ApnaBiz connects you
          with verified businesses across India.
        </p>

        <p className="text-sm leading-relaxed mb-4">
          Our services range from Hotels, Restaurants, Auto Care, Home Decor,
          Personal & Pet Care, Fitness, Insurance, Real Estate, Education,
          Medical services and much more. We help users find the best deals,
          compare vendors, and make informed decisions.
        </p>

        <p className="text-sm leading-relaxed">
          Through features like Free Business Listing, Reviews & Ratings, and
          Live Quotes, we ensure transparency, reliability, and convenience
          for both customers and businesses.
        </p>
      </div>

      {/* =======================
          SERVICES GRID
      ======================= */}
       <div className="bg-gray-50">
    
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">B2B</h3>
            <p>
              Explore India’s largest B2B marketplace. Find manufacturers,
              suppliers, wholesalers, and service providers across industries.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">All India</h3>
            <p>
              Discover businesses across all major cities and towns in India
              with verified listings and customer reviews.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Packers & Movers</h3>
            <p>
              Get reliable packers and movers with transparent pricing and
              genuine customer feedback.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Order Food Online</h3>
            <p>
              Find restaurants, browse menus, read reviews, and order your
              favourite food online.
            </p>
          </div>

        </div>
      </div>

      {/* =======================
          LINK SECTIONS
      ======================= */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm border-t">

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>About Us</li>
            <li>Advertise</li>
            <li>Free Listing</li>
            <li>Customer Care</li>
            <li>We’re Hiring</li>
          </ul>
        </div>

        {/* JD Verticals */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Business Verticals</h4>
          <ul className="space-y-2">
            <li>B2B</li>
            <li>Doctors</li>
            <li>Restaurants</li>
            <li>Education</li>
            <li>Home Services</li>
          </ul>
        </div>

        {/* Popular Cities */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Popular Cities</h4>
          <ul className="space-y-2">
            <li>Bhubaneswar</li>
            <li>Cuttack</li>
            <li>Delhi</li>
            <li>Mumbai</li>
            <li>Bangalore</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
          <ul className="space-y-2">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Refund Policy</li>
            <li>Sitemap</li>
          </ul>
        </div>

      </div>

      {/* =======================
          BOTTOM BAR
      ======================= */}
      <div className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} ApnaBiz. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made in India 🇮🇳</p>
        </div>
      </div>

    </footer>
  );
}
