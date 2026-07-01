"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const Confirmation = ({ data }) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 8);

  return (
    <div className="my-3 flex flex-col items-center gap-2">
      <Image
        height={200}
        width={200}
        alt="Order"
        src="/images/NameLogo.png"
        className="block mx-auto"
      />
      <div className="flex">
        <div className="">
          <h3 className="text-[#7C7C7C] font-semibold font-poppins text-[11px] sm:text-[17px] ">
            SHOPPING CART
          </h3>
        </div>

        <hr className="border border-dashed w-[100px] ml-[15px] mt-[12.5px] border-[#7C7C7C]" />
        <h3 className="text-[#7C7C7C] font-poppins ml-[15px] text-[11px] sm:text-[17px] ">
          PAYMENT
        </h3>
        <hr className="border border-dashed w-[100px] ml-[15px] mt-[12.5px] border-[#7C7C7C]" />
        <div>
          <h3 className=" text-[#EB8105]  font-poppins ml-[10px] text-[11px] sm:text-[17px]">
            CONFIRMATION
          </h3>
          <hr className=" border-[#EB8105] border-[1.5px] w-[90px] sm:w-[130px] ml-[15px] mt-[1px] " />
        </div>
      </div>
      {/* Confirmation Card */}
      <div className="w-full sm:w-[700px] bg-white shadow-lg p-6 sm:p-8 rounded-xl border border-gray-100">
        {/* Success header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-800">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#7C7C7C] max-w-md">
            Thank you for shopping with us. Your order was placed successfully — you
            can track its status anytime from your account.
          </p>
        </div>

        {/* Order summary strip */}
        <div className="mt-6 rounded-lg bg-[#FAFAFA] border border-gray-100 p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-3">
            <span className="text-[13px] text-[#7C7C7C]">Order No.</span>
            <span className="text-[13px] sm:text-sm font-semibold text-gray-800 text-right break-all">
              #{data?._id}
            </span>
          </div>
          <div className="flex justify-between items-start gap-3">
            <span className="text-[13px] text-[#7C7C7C] whitespace-nowrap">
              Shipping to
            </span>
            <span className="text-[13px] sm:text-sm text-gray-700 text-right">
              {`${data?.shippingAddress?.addressLine || ""}, ${
                data?.shippingAddress?.city || ""
              }, ${data?.shippingAddress?.state || ""}, ${
                data?.shippingAddress?.pincode || ""
              }`.replace(/,\s*$/, "")}
            </span>
          </div>
          <div className="flex justify-between items-center gap-3 border-t border-dashed border-gray-200 pt-3">
            <span className="text-[13px] text-[#7C7C7C]">Delivery by</span>
            <span className="text-[13px] sm:text-sm font-semibold text-green-700">
              {futureDate.toDateString()}
            </span>
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Items in this order
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data?.products?.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 border border-gray-100 rounded-lg p-2"
              >
                <Image
                  height={96}
                  width={96}
                  alt="Product"
                  className="h-24 w-24 object-cover rounded-md flex-shrink-0"
                  src={item?.productId?.productImage || "/images/Rectangle.jpg"}
                />
                <div className="min-w-0">
                  <h2 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item?.productId?.productName}
                  </h2>
                  <p className="text-xs text-[#7C7C7C] mt-1">Size: {item?.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="gap-3 flex flex-col sm:flex-row mt-7">
          <Link href="/products" className="flex-1">
            <div className="h-[44px] border border-primary text-primary font-semibold w-full px-3 py-2 rounded-md text-center flex items-center justify-center hover:bg-orange-50 transition-colors">
              Continue Shopping
            </div>
          </Link>
          <Link href="/account/orders" className="flex-1">
            <div className="h-[44px] bg-gradient-to-b from-primary to-secondary text-white font-semibold w-full px-3 py-2 rounded-md text-center flex items-center justify-center hover:opacity-95 transition-opacity">
              Track Order
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
