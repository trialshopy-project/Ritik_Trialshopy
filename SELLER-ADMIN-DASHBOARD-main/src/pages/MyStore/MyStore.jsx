import React, { useContext, useEffect, useState } from "react";
import Topbar from "../../layouts/Topbar";

import { HiOutlineCurrencyRupee } from "react-icons/hi";

import axios from "axios";

import toast from "react-hot-toast";
import { UserContext } from "../../components/context/UserContext";
import Business_info from "../MyAccount/MyAccountPages/Business_info";
import { useNavigate } from "react-router-dom";

const MyStore = () => {
  const [authenticated] = useContext(UserContext);
  const parsedUserData = authenticated.user;

  console.log(authenticated, "aayaaaaaaaaaaaaaaaaaaaaaaa");

  const storeId = authenticated.user.storeId;

  //data fetcehed for business info
  const [businessData, setBusinessData] = useState({});

  //route controller
  const [selectedTab, setSelectedTab] = useState("");

  const renderIt = (nextTab) => {
    setSelectedTab(nextTab);
  };

  useEffect(() => {
    fetchSingleStore();
  }, []);

  const fetchSingleStore = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getStore/${storeId}`
      );
      console.log(data);
      setBusinessData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  console.log(businessData, "han");

  const navigate = useNavigate();

  const renderingIt = () => {
    switch (selectedTab) {
      case "/":
        return (
          <>
            <Business_info businessData={businessData} />
          </>
        );

      default:
        return (
          <>
            <Business_info businessData={businessData} />
          </>
        );
    }
  };

  const [images, setProductImageFile] = useState([]);

  const [avatarPreview, setAvatarPreview] = useState([]);

  const registerDataChange = (e) => {
    const files = Array.from(e.target.files);

    setProductImageFile([]);
    setAvatarPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview((old) => [...old, reader.result]);
          setProductImageFile((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const [loading, setLoading] = useState(false);

  const handleProfileUpload = async () => {
    try {
      setLoading(true);

      if (!images) {
        toast.error("Please Upload Profile");
        setLoading(false);
        return;
      }

      const responseData = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
        { images }
      );

      if (responseData.data.urls) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateStore/${storeId}`,
          {
            images: responseData?.data?.urls,
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
          navigate("/dashboard/MyStore");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <div className="flex w-full  flex-col">
        <section>
          <Topbar />
        </section>

        <div className="font-bold pl-1 m-5 flex items-center justify-between text-lg mt-24 ">
          <p>My Store</p>
          <button
            onClick={() => navigate("/dashboard/myaccount")}
            className="bg-customPurple font-normal text-lg text-white px-4 py-1 rounded-lg"
          >
            My Account
          </button>
        </div>
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center justify-center ml-5 mb-7 gap-3  flex-col md:flex-row">
            <section className="flex sm:mt-4 items-start flex-col">
              <p className="text-[#FF0000] mb-2 font-bold">
                {/* You can Upload multiple images* */}
                Upload image here
                {/* You can Upload Single image */}
              </p>
              <input
                type="file"
                accept="image/*"
                name="images"
                multiple
                onChange={registerDataChange}
              />

              <div className=" mt-4 gap-5 flex">
                {avatarPreview.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Product Preview"
                    className="w-10 h-10"
                  />
                ))}
              </div>

              <div className=" mt-4 gap-5 flex">
                {businessData &&
                  businessData?.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image?.url}
                      alt="Product Preview"
                      className="w-10 h-10"
                    />
                  ))}
              </div>
            </section>
            <div className="flex flex-col gap-4">
            <button
              disabled={loading}
              onClick={handleProfileUpload}
              className="bg-customPurple text-white rounded-lg px-4 py-2 float-left"
            >
              {loading ? "Please wait..." : "Upload Picture"}
            </button>
            {/* <img src={authenticated.user.qrCode} className="h-fit w-fit" alt="user qr code " /> */}
          </div>
          </div>
        </div>

        <section className="px-6">
          <ul className="flex flex-col lg:flex-row gap-3 lg:gap-0">
            <li className="w-fit">
              <button
                className={
                  selectedTab === "/"
                    ? "flex w-full lg:w-36 p-1 border-2 border-t-gray-500 border-x-gray-500 rounded-t-[5px] items-center gap-1 px-2"
                    : "flex w-full lg:w-36 border-2 opacity-[0.4] p-1 border-y-black border-x-black rounded-t-[5px] items-center gap-1 px-2"
                }
                onClick={() => {
                  renderIt("/");
                }}
              >
                <HiOutlineCurrencyRupee />
                <p className="text-sm ">Business Info</p>
              </button>
            </li>
          </ul>
          <section>{renderingIt()}</section>
        </section>
      </div>
    </div>
  );
};

export default MyStore;
