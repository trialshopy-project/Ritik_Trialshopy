import React, { useEffect, useState } from "react";

import axios from "axios";

import FormFields from "../../../components/verification/FormFields";
import { MdOutlineSend } from "react-icons/md";
import toast from "react-hot-toast";
const Business_info = ({ businessData, addressDataBusiness }) => {
  const [storeDetails, setStoreDetails] = useState({
    storeName: businessData?.storeName || "",
    storeDescription: businessData?.storeDescription || "",
    gstId: businessData?.gstId || "",
  });
  const [addressDetails, setAddressDetails] = useState({
    addressLine: addressDataBusiness?.addressLine || "",
    city: addressDataBusiness?.city || "",
    pincode: addressDataBusiness?.pincode || "",
    state: addressDataBusiness?.state || "",
    country: addressDataBusiness?.country || "",
  }); //addressDetails

  const [formData, setFormData] = useState({
    storeDetails,
    addressDetails,
  });

  useEffect(() => {
    setFormData({
      storeDetails: {
        storeName: businessData?.storeName || "",
        storeDescription: businessData?.storeDescription || "",
        gstId: businessData?.gstId || "",
      },
      addressDetails: {
        addressLine: addressDataBusiness?.addressLine || "",
        city: addressDataBusiness?.city || "",
        pincode: addressDataBusiness?.pincode || "",
        state: addressDataBusiness?.state || "",
        country: addressDataBusiness?.country || "",
      },
    });
  }, [businessData, addressDataBusiness]);

  const handleChange1 = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      storeDetails: {
        ...prevData.storeDetails,
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
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateStore/${
        businessData._id
      }`;
      console.log(api);
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
        <div className="w-full p-1">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-between lg:flex-row w-full">
              <FormFields
                labelText="Store:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="En/liveproduct/LiveproductPageter Name"
                value={formData.storeDetails.storeName}
                onChangeFun={handleChange1}
                name="storeName"
              />

              <FormFields
                labelText="Store Description:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Description"
                value={formData.storeDetails.storeDescription}
                onChangeFun={handleChange1}
                name="storeDescription"
              />

              <FormFields
                labelText="Store GSTIN:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter GSTIN"
                value={formData.storeDetails.gstId}
                onChangeFun={handleChange1}
                name="gstId"
              />
            </div>
            <br />
            <div className="flex flex-col justify-center lg:flex-row ">
              <FormFields
                labelText="Pincode:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="430023"
                value={formData.addressDetails.pincode}
                onChangeFun={handleChange2}
                name="pincode"
              />
              <FormFields
                labelText="Address line 1:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="address1"
                value={formData.addressDetails.addressLine}
                onChangeFun={handleChange2}
                name="addressLine"
              />
              <FormFields
                labelText="City:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="City"
                value={formData.addressDetails.city}
                onChangeFun={handleChange2}
                name="city"
              />
            </div>
            <br />

            <div className="flex flex-col justify-center lg:flex-row w-full">
              <FormFields
                labelText="State:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="State"
                value={formData.addressDetails.state}
                onChangeFun={handleChange2}
                name="state"
              />

              <FormFields
                labelText="Country:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="India"
                value={formData.addressDetails.country}
                onChangeFun={handleChange2}
                name="country"
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
export default Business_info;
