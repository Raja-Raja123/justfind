"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  sanitizeTextOnlyInput,
  sanitizeDigits,
  sanitizeSelectValue,
  validateImageFiles,
  validateMobileNumber,
  validateNameField,
  validateUuid,
  TEXT_ONLY_PATTERN,
} from "@/utils/formValidation";

export default function BusinessFormPage() {
  const MAX_IMAGE_COUNT = 5;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
  const [form, setForm] = useState({
    businessName: "",
    mobile: "",
    categoryId: "",
    stateId: "",
    districtId: "",
    areaId: "",
    subCategoryId: "",
  });

  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const [images, setImages] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [catalog, setCatalog] = useState({ categories: [], states: [] });
  const router = useRouter();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setCatalogLoading(true);
        const res = await fetch("/api/business/form");
        if (!res.ok) {
          throw new Error("Failed to load catalog");
        }
        const data = await res.json();
        setCatalog({
          categories: data?.categories ?? [],
          states: data?.states ?? [],
        });
      } catch (err) {
        console.error(err);
        setCatalogError(
          "Unable to load categories or locations. Please retry."
        );
      } finally {
        setCatalogLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const selectedState = useMemo(() => {
    return catalog.states.find((state) => state.id === form.stateId) ?? null;
  }, [catalog.states, form.stateId]);

  const selectedCategory = useMemo(() => {
    return catalog.categories.find((category) => category.id === form.categoryId) ?? null;
  }, [catalog.categories, form.categoryId]);

  const subCategoryOptions = selectedCategory?.subCategories ?? [];
  const districtOptions = selectedState?.districts ?? [];

  const selectedDistrict = useMemo(() => {
    return (
      districtOptions.find((district) => district.id === form.districtId) ??
      null
    );
  }, [districtOptions, form.districtId]);

  const areaOptions = selectedDistrict?.areas ?? [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    if (name === "businessName") {
      const sanitized = sanitizeTextOnlyInput(value).slice(0, 80);
      setForm((prev) => ({ ...prev, businessName: sanitized }));
      return;
    }

    if (name === "mobile") {
      const digits = sanitizeDigits(value).slice(0, 10);
      setForm((prev) => ({ ...prev, mobile: digits }));
      return;
    }

    if (name === "categoryId") {
      const nextValue = sanitizeSelectValue(value);
      setForm((prev) => ({
        ...prev,
        categoryId: nextValue,
        subCategoryId: "",
      }));
      return;
    }

    if (name === "subCategoryId") {
      const nextValue = sanitizeSelectValue(value);
      setForm((prev) => ({ ...prev, subCategoryId: nextValue }));
      return;
    }

    if (name === "stateId") {
      const nextValue = sanitizeSelectValue(value);
      setForm((prev) => ({
        ...prev,
        stateId: nextValue,
        districtId: "",
        areaId: "",
      }));
      return;
    }

    if (name === "districtId") {
      const nextValue = sanitizeSelectValue(value);
      setForm((prev) => ({ ...prev, districtId: nextValue, areaId: "" }));
      return;
    }

    if (name === "areaId") {
      const nextValue = sanitizeSelectValue(value);
      setForm((prev) => ({ ...prev, [name]: nextValue }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetImagePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      setImages([]);
      setImageError("");
      resetImagePicker();
      return;
    }

    const { files: validFiles, error: validationError } = validateImageFiles(
      files,
      {
        maxFiles: MAX_IMAGE_COUNT,
        maxFileSize: MAX_IMAGE_SIZE,
        allowedMimePrefixes: ["image/"],
      }
    );

    if (validationError) {
      setImages([]);
      setImageError(validationError);
      resetImagePicker();
      return;
    }

    setImageError("");
    setImages(validFiles);
    resetImagePicker();
  };

  const uploadImages = async (files) => {
    const urls = [];

    for (const file of files) {
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      // later replace this with Cloudinary upload
      urls.push(base64);
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImageError("");

    const nameValidation = validateNameField(form.businessName, {
      label: "Business name",
      pattern: TEXT_ONLY_PATTERN,
    });
    if (nameValidation.error) {
      setError(nameValidation.error);
      return;
    }

    const mobileValidation = validateMobileNumber(form.mobile);
    if (mobileValidation.error) {
      setError(mobileValidation.error);
      return;
    }

    const categoryValidation = validateUuid(form.categoryId, "Category");
    if (categoryValidation.error) {
      setError(categoryValidation.error);
      return;
    }

      const subCategoryValidation = validateUuid(form.subCategoryId, "Sub category");
      if (subCategoryValidation.error) {
        setError(subCategoryValidation.error);
        return;
      }

    const areaValidation = validateUuid(form.areaId, "Area");
    if (areaValidation.error) {
      setError(areaValidation.error);
      return;
    }

    const { files: validFiles, error: validationError } = validateImageFiles(
      images,
      {
        maxFiles: MAX_IMAGE_COUNT,
        maxFileSize: MAX_IMAGE_SIZE,
        allowedMimePrefixes: ["image/"],
      }
    );

    if (validationError) {
      setImageError(validationError);
      return;
    }

    const imageUrls = validFiles.length ? await uploadImages(validFiles) : [];

    try {
      const res = await fetch("/api/business/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: nameValidation.value,
          mobile: mobileValidation.value,
          categoryId: categoryValidation.value,
          subCategoryId: subCategoryValidation.value,
          areaId: areaValidation.value,
          images: imageUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Submission failed");
        return;
      }
      setForm({
        businessName: "",
        mobile: "",
        categoryId: "",
            subCategoryId: "",
        stateId: "",
        districtId: "",
        areaId: "",
      });
      setImages([]);
      setImageError("");
      alert("Business submitted successfully ✅");
      if (res.ok) {
        router.push(`/business/${data.businessId}`);
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50  to-indigo-50 overflow-hidden ">
      {/* BACKGROUND DECOR ELEMENTS */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[600px] w-[600px] rounded-full bg-indigo-200/30 blur-3xl" />

      {/* Decorative blurred background shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 mt-5">
        {/* LEFT – FORM (Glassmorphism) */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Business Details
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Tell us about your business to start receiving customers near you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium">Business Name *</label>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="e.g. Sharma Electricals"
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Mobile Number *</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category *</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={catalogLoading}
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                <option value="">Select category</option>
                {catalog.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

              <div>
                <label className="text-sm font-medium">Sub Category *</label>
                <select
                  name="subCategoryId"
                  value={form.subCategoryId}
                  onChange={handleChange}
                  disabled={!form.categoryId}
                  className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                >
                  <option value="">Select sub category</option>
                  {subCategoryOptions.map((subCategory) => (
                    <option key={subCategory.id} value={subCategory.id}>
                      {subCategory.name}
                    </option>
                  ))}
                </select>
              </div>

            <div>
              <label className="text-sm font-medium">State *</label>
              <select
                name="stateId"
                value={form.stateId}
                onChange={handleChange}
                disabled={catalogLoading || catalog.states.length === 0}
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                <option value="">Select state</option>
                {catalog.states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">District *</label>
              <select
                name="districtId"
                value={form.districtId}
                onChange={handleChange}
                disabled={!form.stateId}
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                <option value="">Select district</option>
                {districtOptions.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Area *</label>
              <select
                name="areaId"
                value={form.areaId}
                onChange={handleChange}
                disabled={!form.districtId}
                className="mt-1 w-full bg-white/70 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              >
                <option value="">Select area</option>
                {areaOptions.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Business Images</label>

             
                <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelection}
                className="hidden"
              />
              {/* Custom file selector */}
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center rounded-lg border border-dashed border-blue-400 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  <p className="text-left">Choose Image&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;</p>
                 
                <span className="text-xs text-gray-600">
                  {images.length > 0 ? (
                    images.length === 1 ? (
                      images[0].name
                    ) : (
                      <>
                        {images[0].name}
                        <span className="text-gray-400">
                          {" "}
                          +{images.length - 1} more
                        </span>
                      </>
                    )
                  ) : (
                    "No images selected (up to 5)"
                  )}
                </span>
             
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Upload photos of your shop, office, or work (max 5 images)
              </p>

              {imageError && (
                <p className="text-xs text-red-500 mt-1" role="alert">
                  {imageError}
                </p>
              )}

              {/* Preview */}
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {images.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-20 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {(error || catalogError) && (
              <p className="text-sm text-red-500" role="alert">
                {error || catalogError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              disabled={catalogLoading}
            >
              {catalogLoading ? "Loading..." : "Submit Business"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your details are safe & verified before publishing
            </p>
          </form>
        </div>

        {/* RIGHT – VISUAL PANEL (More Width) */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c"
            alt="Business growth"
            fill
            className="object-cover"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-2xl font-semibold mb-2">
              Grow your local business with ApnaBiz
            </h3>
            <p className="text-sm text-white/90 max-w-lg">
              Join thousands of businesses getting discovered by customers
              searching nearby every day.
            </p>

            <ul className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <li>✔ Free listing</li>
              <li>✔ Local visibility</li>
              <li>✔ Genuine leads</li>
              <li>✔ Easy management</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Trusted by local businesses across India
        </h2>

        <p className="mt-4 max-w-3xl mx-auto text-gray-600 leading-relaxed">
          From electricians and salons to restaurants and service providers,
          ApnaBiz helps businesses connect with real customers searching nearby.
          Your listing appears where people are already looking.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            "Verified Listings",
            "Local Search Visibility",
            "Direct Customer Calls",
            "Zero Listing Cost",
          ].map((item) => (
            <div
              key={item}
              className="bg-white/70 backdrop-blur-md rounded-xl px-5 py-4 text-sm font-medium shadow-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}










