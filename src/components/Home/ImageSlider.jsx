"use client";
import { useEffect, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl ">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-full h-80 object-cover shrink-0"
          />
        ))}
      </div>
    </div>
  );
}