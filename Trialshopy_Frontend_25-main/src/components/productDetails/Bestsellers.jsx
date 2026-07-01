import React from "react";
import Link from "next/link";
import SimilarProductCard from "./SimilarProductCard";

// "Bestsellers" — the standard e-commerce recommendation row. Products are
// ordered by rating.count (most-rated = most popular) upstream in
// ProductDetails.jsx, so we just render whatever we're handed.
const Bestsellers = ({ bestsellers = [] }) => {
  if (!bestsellers.length) return null;

  const categoryId = bestsellers[0]?.categories?.[0]?._id;

  return (
    <div className="px-4 lg:px-[100px] flex flex-col items-start w-full gap-4 py-4 lg:py-8">
      <div className="w-full h-px bg-gradient-to-r from-gray-700" />

      <div className="flex items-center justify-between w-full">
        <h1 className="flex items-center gap-2 text-xl font-semibold lg:text-3xl">
          Bestsellers
        </h1>

        {categoryId && (
          <Link href={`/subcategory/${categoryId}`}>
            <button className="flex items-center gap-1 p-2 text-white bg-black rounded-sm">
              See All
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.49988 4.5L6.44238 5.5575L9.87738 9L6.44238 12.4425L7.49988 13.5L11.9999 9L7.49988 4.5Z"
                  fill="white"
                />
              </svg>
            </button>
          </Link>
        )}
      </div>

      <div className="w-full mt-4 overflow-x-auto">
        <div className="flex items-stretch gap-4 md:gap-6 min-w-max">
          {bestsellers.map((product, key) => (
            <div key={product?._id || key} className="relative">
              {/* Rank badge — a nice bestseller touch */}
              {key < 3 && (
                <span className="absolute -top-2 -left-2 z-10 flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-[#EB8105] rounded-full shadow">
                  #{key + 1}
                </span>
              )}
              <SimilarProductCard productDetails={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bestsellers;
