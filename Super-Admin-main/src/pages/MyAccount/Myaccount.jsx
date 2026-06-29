import React, { useEffect, useState } from "react";
import Topbar3 from "../../layouts/Topbar3";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";

import Basic_info_account from "./MyAccountPages/Basic_info_account";
import Business_info from "./MyAccountPages/Business_info";
import Varification_info from "./MyAccountPages/Varification_info";
import axios from "axios";

const Myaccount = () => {
  const storedUserData = localStorage.getItem("seller");
  const parsedUserData = JSON.parse(storedUserData);

  // Data fached for basic info
  const [sellerData, setSellerData] = useState({});
  const [addressData, setAddressData] = useState({});

  //data fetcehed for business info
  const [businessData, setBusinessData] = useState({});
  const [addressDataBusiness, setAddressDataBusiness] = useState({});

  ///data fetched for verification
  const [verificationData, setVerificationData] = useState({});

  useEffect(() => {
    fetchSingleSellers();
    fetchSingleBusinessInfo();
    fetchSingleAddress();
    fetchSingleBusinnesAddress();
    fetchSingleVerification();
  }, []);

  const fetchSingleSellers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/sellers/${
          parsedUserData?._id
        }`
      );
      console.log(data);
      setSellerData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const fetchSingleAddress = async () => {
    try {
      console.log(sellerData._id, "kashif");
      const type = "seller";
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/${
          parsedUserData?._id
        }/address/${type}`
      );
      console.log(data);
      setAddressData(data[0]);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const fetchSingleBusinessInfo = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/${
          parsedUserData._id
        }/store`
      );
      console.log(data);
      setBusinessData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const fetchSingleBusinnesAddress = async () => {
    try {
      const type = "store";
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/${
          parsedUserData?._id
        }/address/${type}`
      );
      console.log(data);
      setAddressDataBusiness(data[0]);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const fetchSingleVerification = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getFormData/${
          parsedUserData?._id
        }`
      );
      console.log(data);
      setVerificationData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  //route controller
  const [selectedTab, setSelectedTab] = useState("");

  const renderIt = (nextTab) => {
    setSelectedTab(nextTab);
  };

  const renderingIt = () => {
    switch (selectedTab) {
      case "/basic_info":
        return (
          <>
            <Basic_info_account
              sellerData={sellerData}
              addressData={addressData}
            />
          </>
        );
        break;

      case "/business_info":
        return (
          <>
            <Business_info
              businessData={businessData}
              addressDataBusiness={addressDataBusiness}
            />
          </>
        );
        break;
      case "/verification":
        return (
          <>
            <Varification_info verificationData={verificationData} />
          </>
        );
        break;

      default:
        return (
          <>
            <Basic_info_account
              sellerData={sellerData}
              addressData={addressData}
            />
          </>
        );
        break;
    }
  };

  return (
    <>
      <section>
        <section>
          <Topbar3 />
        </section>

        <div className="flex flex-col items-start justify-start">
          <div className="font-bold pl-1 m-5 flex  text-lg">My Account</div>

          <div className="flex items-center justify-start ml-5 mb-4 gap-3">
            <img
              src="https://source.unsplash.com/random/200x200?sig=1"
              alt=""
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
              }}
            />
            <input type="file" />
          </div>
        </div>

        <section className="px-6">
          <ul className="flex">
            <li className="w-fit">
              <button
                className={
                  selectedTab === "/"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/");
                }}
              >
                <AiOutlineInfoCircle />
                <p className="text-sm ">Basic info</p>
              </button>
            </li>

            <li className="w-fit">
              <button
                className={
                  selectedTab === "/business_info"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/business_info");
                }}
              >
                <HiOutlineCurrencyRupee />
                <p className="text-sm ">Business Info</p>
              </button>
            </li>

            <li className="w-fit">
              <button
                className={
                  selectedTab === "/verification"
                    ? "flex  p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/verification");
                }}
              >
                <MdOutlineLocalShipping />
                <p className="text-sm ">Varification</p>
              </button>
            </li>
          </ul>
          <section>{renderingIt()}</section>
        </section>
      </section>
    </>
  );
};

export default Myaccount;
