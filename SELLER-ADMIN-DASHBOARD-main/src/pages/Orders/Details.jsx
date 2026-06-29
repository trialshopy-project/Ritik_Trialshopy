

import React, { useState } from "react";

import { RxCrossCircled } from "react-icons/rx";

import Basicinfo from "./Basicinfo";
import Shippingdetails from "./Shippingdetails";
import Ordernote from "./Ordernote";
import Paymentdetails from "./Paymentdetails";
import Topbar2 from "../../layouts/Topbar2";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { MdOutlineLocalShipping, MdPayment } from "react-icons/md";
import { BiNote } from "react-icons/bi";

const AllBasicInfoPage = () => {
  const [selectedTab, setSelectedTab] = useState("");

  const renderIt = (nextTab) => {
    setSelectedTab(nextTab);
  };

  const renderingIt = () => {
    switch (selectedTab) {
      case "/basicinfo":
        return (
          <>
            <Basicinfo />
          </>
        );
        break;
      case "/shippingdetails":
        return (
          <>
            <Shippingdetails />
          </>
        );
        break;
      case "/ordernote":
        return (
          <>
            <Ordernote />
          </>
        );
        break;
      case "/paymentdetails":
        return (
          <>
            <Paymentdetails />
          </>
        );
        break;
      // case "/": return <><Pictures_Basic_info/></>
      //     break;
      // case "/seo": return <><Seo_Basic_info/></>
      //     break;
      // case "/productAttribute": return <><ProductAttributesBasic_info/></>
      //     break;

      default:
        return (
          <>
            <Basicinfo />
          </>
        );
        break;
    }
  };

  return (
    <>
      <section >
        <section>
          <Topbar2 />
        </section>

        <section className="px-7 mt-4">
          <ul className="flex">
            <li className="w-fit">
              <button
                className={
                  selectedTab === "/basicinfo"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/basicinfo");
                }}
              >
                <AiOutlineInfoCircle />
                <p className="text-sm ">Basic info</p>
              </button>
            </li>

            <li className="w-fit ">
              <button
                className={
                  selectedTab === "/shippingdetails"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/shippingdetails");
                }}
              >
                <MdOutlineLocalShipping />
                <p className="text-sm ">Shipping Details</p>
              </button>
            </li>

            <li className="w-fit">
              <button
                className={
                  selectedTab === "/ordernote"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/ordernote");
                }}
              >
                <BiNote />
                <p className="text-sm ">Order note</p>
              </button>
            </li>

            <li className="w-fit">
              <button
                className={
                  selectedTab === "/paymentdetails"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/paymentdetails");
                }}
              >
                <MdPayment />
                <p className="text-sm ">Payment Details</p>
              </button>
            </li>
            <li className="w-fit border-b-2">
              
            </li>
          </ul>

          <section>{renderingIt()}</section>
        </section>
      </section>
    </>
  );
};

export default AllBasicInfoPage;
