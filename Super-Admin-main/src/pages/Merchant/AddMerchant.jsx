import React, { useState } from "react";
import axios from "axios";
import Topbar2 from "../../layouts/Topbar2";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { AiOutlineClose } from "react-icons/ai";
import { MdOutlineSend } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FFormElementsInputPlainLgRequired() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alternatePhoneNumber, setAlternatePhoneNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [productCategory, setProductCategory] = useState("Cake");
  const [productSubCategory, setProductSubCategory] = useState("Cake");
  const [shippingMethods, setShippingMethods] = useState([]);

  const handleFormSubmit = async () => {
    try {
      const formData = {
        fullName,
        email,
        phoneNumber,
        alternatePhoneNumber,
        aadhaarNumber,
        panNumber,
        country,
        state,
        city,
        address,
        zipCode,
        companyName,
        storeName,
        storeId,
        storeAddress,
        storeCity,
        productCategory,
        productSubCategory,
        shippingMethods,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/merchants`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      toast.success("Merchant Added!!")
      // Redirect to the desired page after successful submission
      // navigate('../Merchant'); // You can use navigate() function here if needed
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Topbar2 />
      <div className="bg-white">
        <div className="flex justify-between">
          <div className="font-bold m-5 flex items-center text-lg">
            <SiHomeassistantcommunitystore className="mr-2" />
            Add Merchant
          </div>

          {/* Close */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch my-4 focus:bg-gray-900"
              onClick={() => {
                navigate("../Merchant");
              }}
            >
              <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none  ">
                <AiOutlineClose className="mr-2 scale-125 border bg-white rounded-full fill-gray-900" />
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="ml-5 font-semibold text-lg">Personal information</div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Full Name</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="Enter Business name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">E-Mail</label>
            <input
              class="input-field"
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Phone no.</label>
            <input
              class="input-field"
              type="tel"
              placeholder="+91 - 7983163574"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Alternate Phone no.</label>
            <input
              class="input-field"
              type="tel"
              placeholder="+91 - 7983163574"
              value={alternatePhoneNumber}
              onChange={(e) => setAlternatePhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Aadhaar no.</label>
            <input
              class="input-field"
              type="tel"
              placeholder="name@gmail.com"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Pan no.</label>
            <input
              class="input-field"
              type="text"
              placeholder="Enter no."
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Country</label>
            <select
              name="Country"
              id=""
              className="mr-20"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="America">America</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div className="ml-24">
            <label className="block mb-2">State</label>
            <input
              class="input-field"
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">City</label>
            <input
              class="input-field"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Address</label>
            <input
              class="input-field"
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Zip Code</label>
            <input
              class="input-field"
              type="email"
              placeholder="Enter Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 ml-5 font-semibold text-lg">
          Company information
        </div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Company name</label>
            <input
              class="input-field"
              type="text"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Store name</label>
            <input
              class="input-field"
              type="text"
              placeholder="Store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Store ID</label>
            <input
              class="input-field"
              type="text"
              placeholder="STORE1234"
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
            />
          </div>
        </div>
        <div className="ml-5 mt-5 flex gap-20">
          <div>
            <label className="block mb-2">Store Address</label>
            <input
              class="input-field"
              type="text"
              placeholder="Enter Address"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Store City</label>
            <input
              class="input-field"
              type="email"
              placeholder="Store City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Zip Code</label>
            <input
              class="input-field"
              type="text"
              placeholder="STORE1234"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
        </div>

        

        {/* Add Button */}
        <div
          className="flex items-stretch m-5 focus:bg-gray-900"
          onClick={() => {
            navigate("../Merchant");
          }}
        >
          <button
            onClick={handleFormSubmit}
            className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none  "
          >
            Add a Merchant
            <MdOutlineSend className="ml-2 scale-125  fill-white" />
          </button>
        </div>
      </div>
    </>
  );
}
