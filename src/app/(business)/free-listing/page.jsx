"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function FreeListingLogin() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate processing (OTP / validation)
    setTimeout(() => {
      router.push("/free-listing/form");
    }, 1200);
  };

  return (
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">

        <div className=" relative h-[5vh] w-[95vw] bg-white">
             {/* TOP LOADING BAR (YouTube-style) */}
        {loading && (
          <div className="absolute bottom-0 z-50 w-[90%] h-[3px] bg-transparent">
            <div className="h-full bg-blue-600 animate-loading-bar" />
          </div>
        )}
          
           </div>
      {/* PAGE CONTENT (blur when loading) */}
      <div className={loading ? "blur-sm pointer-events-none select-none" : ""}>
       
        {/* HERO SECTION */}
        <section className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT CONTENT */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Grow Your Business Online —{" "}
                <span className="text-blue-600">Free</span>
              </h1>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Get discovered by customers searching for services near them.
                List your business on <strong>ApnaBiz</strong> and receive
                genuine enquiries every day.
              </p>

              <div className="mt-6">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                  alt="Business growth"
                  width={520}
                  height={360}
                  className="rounded-xl object-cover"
                  priority
                />
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                <li>✔ Free business listing</li>
                <li>✔ Reach local customers instantly</li>
                <li>✔ Calls, leads & enquiries</li>
                <li>✔ Manage your profile anytime</li>
              </ul>
            </div>

            {/* RIGHT LOGIN CARD */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  List Your Business for FREE
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Login using your mobile number to continue
                </p>

                <label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-2 flex items-center border rounded-lg px-3 py-2">
                  <span className="text-gray-500 mr-2">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobile}
                    disabled={loading}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter mobile number"
                    className="w-full outline-none bg-transparent"
                  />
                </div>

                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className={`mt-5 w-full py-3 rounded-lg font-medium transition
                    ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {loading ? "Processing..." : "Continue"}
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By continuing, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* HOW IT WORKS */}{" "}
        <section className="max-w-7xl mx-auto px-6 py-16">
          {" "}
          <h2 className="text-2xl font-semibold text-center mb-10">
            {" "}
            How Free Listing Works{" "}
          </h2>{" "}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {" "}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0"
                alt="Login"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />{" "}
              <h3 className="font-semibold mb-2">1. Login with Mobile</h3>{" "}
              <p className="text-sm text-gray-600">
                {" "}
                Verify your number to get started.{" "}
              </p>{" "}
            </div>{" "}


            <div className="bg-white p-6 rounded-xl shadow-sm">
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
                alt="Business form"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />{" "}
              <h3 className="font-semibold mb-2">2. Add Business Details</h3>{" "}
              <p className="text-sm text-gray-600">
                {" "}
                Fill basic info like name, category & city.{" "}
              </p>{" "}
            </div>{" "}


            <div className="bg-white p-6 rounded-xl shadow-sm">
              {" "}
              <Image
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284"
                alt="Customer calls"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />{" "}
              <h3 className="font-semibold mb-2">3. Start Getting Leads</h3>{" "}
              <p className="text-sm text-gray-600">
                {" "}
                Customers contact you directly.{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </section>



        {/* TRUST STRIP */}
        <section className="bg-white border-t">
          {" "}
          <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-center text-sm text-gray-700">
            {" "}
            <div>
              {" "}
              <p className="font-semibold text-lg">10M+</p>{" "}
              <p>Monthly Searches</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="font-semibold text-lg">5L+</p>{" "}
              <p>Businesses Listed</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="font-semibold text-lg">100+</p>{" "}
              <p>Cities Covered</p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="font-semibold text-lg">Trusted</p>{" "}
              <p>By Local Businesses</p>{" "}
            </div>{" "}
          </div>{" "}
        </section>
      </div>

      {/* OPTIONAL OVERLAY TEXT */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <p className="text-sm text-gray-600">loading…</p>
        </div>
      )}

      {/* CSS FOR LOADING BAR */}
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          20% {
            width: 20%;
          }
          30% {
            width: 30%;
          }
          60% {
            width: 60%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-loading-bar {
          animation: loading 2.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
