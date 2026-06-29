import React, { useState, useEffect } from "react";

const Prices_info = ({
  price,
  setPrice,
  oldPrice,
  setOldPrice,
  isDiscountAllowed,
  setIsDiscountAllowed,
  discount,
  setDiscount,
}) => {
  return (
    <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="w-full lg:w-[80%]">
        <div className="border border-b-slate-300 bg-white rounded-lg shadow-lg mt-7">
          <div className="font-semibold mt-5 text-center">Pricing</div>
          <div className="ml-5 mt-5 flex gap-2 flex-wrap items-center justify-between mb-5">
            <div>
              <label className="block mb-2 font-bold text-xs">
                Price <span className="text-[#F60002]">*</span>
              </label>
              <input
                className="bg-transparent border border-b-black text-sm p-2"
                type="number"
                placeholder="Enter price"
                name="price"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-xs">Old Price</label>
              <input
                className="bg-transparent border border-b-black text-sm p-2"
                type="number"
                placeholder="Enter old price"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={isDiscountAllowed}
                onChange={(e) => setIsDiscountAllowed(e.target.checked)}
              />
              <label htmlFor="">Is Discount Allowed</label>
            </div>

            <div className="w-1/3 sm:m-4 flex flex-col">
              <label className="block mb-1 font-bold text-xs">Discount</label>
              <input
                className="bg-transparent border border-b-black text-sm p-2"
                type="number"
                placeholder="Enter Discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prices_info;
