import React, { useEffect, useState } from "react";
import FormFields from "../../../components/verification/FormFields";
import { MdOutlineSend } from "react-icons/md";

import axios from "axios";

import toast from "react-hot-toast";

const Basic_info_account = ({ sellerData, addressData }) => {
  const [errorform, setErrorform] = useState("");

  const [sellerDetails, setSellerDetails] = useState({
    firstName: sellerData?.firstName || "",
    middleName: sellerData?.middleName || "",
    lastName: sellerData?.lastName || "",
    email: sellerData?.email || "",
    phoneNumber: sellerData?.phoneNumber || "",
    alternatePhoneNumber: sellerData?.alternatePhoneNumber || "",
    password: sellerData?.password || "",
  }); //sellerDetails

  const [addressDetails, setAddressDetails] = useState({
    addressLine: addressData?.addressLine || "",
    city: addressData?.city || "",
    pincode: addressData?.pincode || "",
    state: addressData?.state || "",
    country: addressData?.country || "",
  }); //addressDetails

  const [formData, setFormData] = useState({
    sellerDetails,
    addressDetails,
  });

  useEffect(() => {
    setFormData({
      sellerDetails: {
        firstName: sellerData?.firstName || "",
        middleName: sellerData?.middleName || "",
        lastName: sellerData?.lastName || "",
        email: sellerData?.email || "",
        phoneNumber: sellerData?.phoneNumber || "",
        alternatePhoneNumber: sellerData?.alternatePhoneNumber || "",
        password: sellerData?.password || "",
      },
      addressDetails: {
        addressLine: addressData?.addressLine || "",
        city: addressData?.city || "",
        pincode: addressData?.pincode || "",
        state: addressData?.state || "",
        country: addressData?.country || "",
      },
    });
  }, [sellerData, addressData]);

  const handleChange1 = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      sellerDetails: {
        ...prevData.sellerDetails,
        [fieldName]: newValue,
      },
    }));
  };

  const handleChange2 = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      addressDetails: {
        ...prevData.addressDetails,
        [fieldName]: newValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/sellerUpdate/${
        sellerData._id
      }`;
      const response = await axios.put(api, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success === true) {
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start w-full mt-3">
      <div className="w-full flex items-center justify-start">
        <div className="w-full">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.sellerDetails.firstName ? (
                    "First Name"
                  ) : (
                    <span>
                      First Name <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Name"
                value={formData.sellerDetails.firstName}
                name="firstName"
                onChangeFun={handleChange1}
              />

              <FormFields
                labelText="Middle Name"
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Name"
                value={formData.sellerDetails.middleName}
                onChangeFun={handleChange1}
                name="middleName"
              />
              <FormFields
                labelText={
                  formData.sellerDetails.lastName ? (
                    "Last Name"
                  ) : (
                    <span>
                      Last Name <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Name"
                value={formData.sellerDetails.lastName}
                name="lastName"
                onChangeFun={handleChange1}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.sellerDetails.email ? (
                    "Email"
                  ) : (
                    <span>
                      Email <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="email"
                placeholder="user@gmail.com"
                value={formData.sellerDetails.email}
                name="email"
                onChangeFun={handleChange1}
              />
              <FormFields
                labelText={
                  formData.sellerDetails.phoneNumber ? (
                    "Phone Number"
                  ) : (
                    <span>
                      Phone Number <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes="box-border  flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="tel"
                placeholder="(304) 555-0108"
                value={formData.sellerDetails.phoneNumber}
                name="phoneNumber"
                onChangeFun={handleChange1}
              />
              <FormFields
                labelText="Alternate Phone Number"
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="tel"
                placeholder="(304) 555-0108"
                value={formData.sellerDetails.alternatePhoneNumber}
                name="alternatePhoneNumber"
                onChangeFun={handleChange1}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.addressDetails.pincode ? (
                    "Pincode"
                  ) : (
                    <span>
                      Pincode <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes="box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="430023"
                value={formData.addressDetails.pincode}
                name="pincode"
                onChangeFun={handleChange2}
              />
              <FormFields
                labelText={
                  formData.addressDetails.addressLine ? (
                    "Address Line"
                  ) : (
                    <span>
                      Address line <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="address"
                value={formData.addressDetails.addressLine}
                name="addressLine"
                onChangeFun={handleChange2}
              />
              <FormFields
                labelText="City"
                classes="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="city"
                value={formData.addressDetails.city}
                name="city"
                onChangeFun={handleChange2}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.addressDetails.country ? (
                    "Country"
                  ) : (
                    <span>
                      Country <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes="box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="India"
                value={formData.addressDetails.country}
                name="country"
                onChangeFun={handleChange2}
              />
              <FormFields
                labelText={
                  formData.addressDetails.state ? (
                    "State"
                  ) : (
                    <span>
                      State <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="state"
                value={formData.addressDetails.state}
                name="state"
                onChangeFun={handleChange2}
              />
              <FormFields
                labelText={
                  formData.sellerDetails.password ? (
                    "Password"
                  ) : (
                    <span>
                      Password <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Create Password"
                value={formData.sellerDetails.password}
                name="password"
                onChangeFun={handleChange1}
              />
            </div>

            <div className="flex items-stretch m-5 focus:bg-gray-500">
              <button
                type="submit"
                className="flex bg-purple-700 p-2 hover:bg-gray-500 text-white text-md items-center px-4 rounded-lg focus:outline-none  "
              >
                Edit Profile
                <MdOutlineSend className="ml-2 scale-125  fill-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Basic_info_account;
