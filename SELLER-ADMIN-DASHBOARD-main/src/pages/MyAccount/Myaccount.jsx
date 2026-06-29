import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../layouts/Topbar";

import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Basic_info_account from "./MyAccountPages/Basic_info_account";
import Business_info from "./MyAccountPages/Business_info";
import Varification_info from "./MyAccountPages/Varification_info";
import axios from "axios";
import Password from "./MyAccountPages/Password";
import { UserContext } from "../../components/context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Myaccount = () => {
  const [authenticated] = useContext(UserContext);
  const parsedUserData = authenticated.user;

  const navigate = useNavigate();

  // Data fached for basic info
  const [sellerData, setSellerData] = useState({});

  //data fetcehed for business info
  

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

  console.log(parsedUserData, "dd");

  const renderingIt = () => {
    switch (selectedTab) {
      case "/basic_info":
        return (
          <>
            <Basic_info_account parsedUserData={parsedUserData} />
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
      case "/password":
        return (
          <>
            <Password />
          </>
        );
        break;

      default:
        return (
          <>
            <Basic_info_account parsedUserData={parsedUserData} />
          </>
        );
        break;
    }
  };

  const [images, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    parsedUserData?.avatar?.url || "/images/Profile.png"
  );

  const registerDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview([reader.result]);
        setAvatar([reader.result]);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const [loading, setLoading] = useState(false);

  const handleProfileUpload = async () => {
    try {
      setLoading(true);

      if (!images) {
        toast.error("Please Upload Profile");
        return;
      }

      const responseData = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
        { images }
      );

      console.log(responseData.data.urls[0], "ok");

      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateProfile/${
          parsedUserData._id
        }`,
        {
          avatar: responseData.data.urls[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "aaya");
      if (response.status === 200) {
        toast.success("Profile Updated Successfully");
        navigate("/dashboard/myaccount");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const downloadQrCode = ()=>{
  //   alert('clicked!')
  // }
  function downloadQrCode() {
    // Get the QR code URL from authenticated user
    const src_img = authenticated.user.qrCode;
  
    if (!src_img) {
      console.error("QR Code URL is not available.");
      return;
    }
    fetch(src_img)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "qr_code.png";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(error => console.error("Error downloading the QR code:", error));
  }
  

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <div className="flex w-full  flex-col">
        <section>
          <Topbar />
        </section>
        <input className="hidden" type='file' src={authenticated.user.qrCode} />

        <div className="font-bold pl-1 m-5 flex items-center justify-end text-lg mt-24 ">
          {/* <p className="hidden xl:block">My Account</p> */}
          <div className="flex flex-col gap-4 w-auto justify-center items-center">
          <button
            onClick={() => navigate("/dashboard/mystore")}
            className="bg-customPurple font-normal text-lg text-white px-4 py-1 rounded-lg"
          >
            My Store
          </button>
          <button className="bg-customPurple font-normal text-lg text-white px-4 py-1 rounded-lg mx-auto" onClick={()=>downloadQrCode()} >
            Download your Qr Code
          </button>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full">
          <div className="flex items-center justify-start  mb-7 gap-3 lg:flex-row flex-col w-full">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-10 h-10 rounded-full m-4 bg-customPurple order-3 lg:order-none "
            />
            <input
              className="w-64 order-1 lg:order-none"
              type="file"
              name="avatar"
              accept="image/*" //any type of image acceptable
              autoComplete="off"
              onChange={registerDataChange}
            />
            <div className="flex flex-col gap-4">
            <button
              disabled={loading}
              onClick={handleProfileUpload}
              className="bg-customPurple text-white rounded-lg px-4 py-2 float-left order-3 lg:order-none"
            >
              {loading ? "Please wait..." : "Update Profile Picture"}
            </button>
            {/* <img src={authenticated.user.qrCode} className="h-60 w-60" alt="user qr code " /> */}
            </div>
          </div>
        </div>

        <section className="px-6">
          <ul className="flex flex-col lg:flex-row gap-3 lg:gap-0">
            <li className="w-fit">
              <button
                className={
                  selectedTab === "/"
                    ? "flex  lg:w-32 p-1 w-full border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex w-full lg:w-32 border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
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
                  selectedTab === "/verification"
                    ? "flex w-full lg:w-36 p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex w-full lg:w-36 border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/verification");
                }}
              >
                <MdOutlineLocalShipping />
                <p className="text-sm ">Verification</p>
              </button>
            </li>
            <li className="w-fit">
              <button
                className={
                  selectedTab === "/password"
                    ? "flex w-full lg:w-36 p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex w-full lg:w-36 border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/password");
                }}
              >
                <RiLockPasswordFill />
                <p className="text-sm ">Password</p>
              </button>
            </li>
          </ul>
          <section>{renderingIt()}</section>
        </section>
      </div>
    </div>
  );
};

export default Myaccount;
