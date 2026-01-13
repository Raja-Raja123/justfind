"use client";
import { useEffect, useState } from "react";
import Input from "../layout/Input";
const numbers = ["4.9 Crore+ Businesses", "5.9 Crore+ Products & Services"];

export default function SearchSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % numbers.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" px-5 ">
        <br />
      {/* TEXT */}
      <div className="text-3xl font-semibold flex gap-3 overflow-hidden h-12">
        <span>Search across</span>

        <div className="relative h-12 overflow-hidden">
          <div
            className="transition-transform duration-700"
            style={{
              transform: `translateY(-${index * 48}px)`,
            }}
          >
            {numbers.map((text, i) => (
              <div key={i} className="h-12 text-blue-600">
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
       <Input />
    </div>
  );
}