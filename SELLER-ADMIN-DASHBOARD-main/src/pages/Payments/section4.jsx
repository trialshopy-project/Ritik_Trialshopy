import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useEffect,useRef,useState } from "react";
import { Link } from "react-router-dom";
function Section4() {
  return (
    <div className="lg:grid lg:grid-cols-3 justify-center gap-4 w-full flex flex-col mx-auto ">
      <Left_section />
      <Middle_section />
      <Right_section />
    </div>
  );
}

export default Section4;
const Left_section = () => {
  return (
    <>
      <div className="flex flex-col gap-4 justify-evenly items-start bg-white text-black shadow-lg rounded-lg m-1 p-4 w-auto">
        {/* first part */}
        <div className="flex justify-between items-center gap-4">
          <h1 className="font-semibold text-customDark text-sm">
            Compensation & Recoveries
          </h1>
          <Link className="text-sky-600 font-semibold cursor-pointer" to="/payments/compensation">
            View Details
          </Link>
        </div>
        <span className="text-[13px] text-gray-400">No data to show</span>
        <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center gap-4 w-full ">
          <h1 className="font-semibold text-customDark text-[12px]">
            compensation
          </h1>
          <span className="font-semibold">
            $ 0
          </span>
        </div>
        <div className="h-[10px] bg-gray-200 w-full rounded-xl">

        </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center gap-4 w-full ">
          <h1 className="font-semibold text-customDark text-[12px]">
            recoveries
          </h1>
          <span className="font-semibold">
            $ 0
          </span>
        </div>
        <div className="h-[10px] bg-gray-200 w-full rounded-xl">

        </div>
        </div>

        <div className="flex justify-between items-center gap-4 w-full ">
          <h1 className="font-semibold text-customDark text-[12px]">
            Total
          </h1>
          <span className="font-semibold">
            $ 0
          </span>
        </div>

      </div>
    </>
  );
};

// middle section----------------------------------------------------------------------------!

const Middle_section = () => {
    return (
      <>
        <div className="flex flex-col gap-4 justify-between items-start bg-white text-black shadow-lg rounded-lg m-1 p-4">
          {/* first part */}
          <div className="flex justify-between items-start w-full">
            <h1 className="font-semibold text-customDark text-sm">
              Ads Cost
            </h1>
            <span className="text-sky-600 font-semibold cursor-pointer">
              View Details
            </span>
          </div>
          <span className="text-[13px] text-gray-400">You have not spent on Ads in the last 30 days</span>
          
          <span className="text-[13px] font-bold mx-auto text-center">Boost order Growth using Ads</span>
          <span className="text-[11px] font-semibold mx-auto text-center">More than 2 Lac sellers have run Ads to grow their business,<a className="text-sky-500">Try Ads</a></span>
          </div>
      </>
    );
  };


  const Right_section = () => {
    const referralPaymentRef=useRef(null)
    return (
      <div className="flex flex-col justify-center gap-11 items-start bg-white text-black shadow-lg rounded-lg m-1 p-4">
        {/* First part */}
        <span className="text-sm font-semibold">Order Links</span>
        
        <Link className="flex justify-between items-center w-full" to="/Payments/Refferal_Payments">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Referral Payments</span>
            <span className="text-[13px] text-gray-400 font-semibold whitespace-nowrap">
              No referral payments to show
            </span>
          </div>
          <MdOutlineKeyboardArrowRight className="text-gray-500 w-7 h-7" />
        </Link>
  
        <hr className="w-full" />
  
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Have a Query?</span>
            <span className="text-[13px] text-gray-400 font-semibold w-full">
              Raise a ticket for your payment related matters
            </span>
          </div>
          <MdOutlineKeyboardArrowRight className="text-gray-500 h-7 w-7" />
        </div>
      </div>
    );
  };