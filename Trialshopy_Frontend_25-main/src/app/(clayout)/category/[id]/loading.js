import React from "react";
import SkeletonLoader from "@/components/productCards/SkeletonLoader";

export default function Loading() {
  return (
    <div className="w-full px-5 lg:px-10 lg:py-10 my-5">
      <div className="flex w-full gap-5">
        <div className="hidden lg:block w-1/4 h-screen bg-gray-100 animate-pulse rounded-md"></div>
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
