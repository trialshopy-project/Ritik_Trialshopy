import React, { useContext, useEffect, useState } from "react";

import axios from "axios";

import FormFields from "../../../components/verification/FormFields";
import { MdOutlineSend } from "react-icons/md";
import toast from "react-hot-toast";
import { UserContext } from "../../../components/context/UserContext";
const Business_info = ({ businessData }) => {
  const [authenticated] = useContext(UserContext);
  const storeId = authenticated.user.storeId;

  console.log(businessData, "Dd");

  const [formData, setFormData] = useState({
    storeName: businessData?.storeName || "",
    storeDescription: businessData?.storeDescription || "",
    gstId: businessData?.gstId || "",
    addressLine: businessData?.addressLine || "",
    city: businessData?.city || "",
    pincode: businessData?.pincode || "",
    state: businessData?.state || "",
    country: businessData?.country || "",
  }); //addressDetails

  useEffect(() => {
    setFormData({
      storeName: businessData?.storeName || "",
      storeDescription: businessData?.storeDescription || "",
      gstId: businessData?.gstId || "",
      addressLine: businessData?.addressLine || "",
      city: businessData?.city || "",
      pincode: businessData?.pincode || "",
      state: businessData?.state || "",
      country: businessData?.country || "",
    });
  }, [businessData]);

  const handleChange = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData, "dsd");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateStore/${storeId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "aua");
      const id = response?.data?._id;

      if (id) {
        toast.success("Store Updated Successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
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
                value={formData.storeName}
                onChangeFun={handleChange}
                name="storeName"
              />

              <FormFields
                labelText="Store Description:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Description"
                value={formData.storeDescription}
                onChangeFun={handleChange}
                name="storeDescription"
              />

              <FormFields
                labelText="Store GSTIN:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter GSTIN"
                value={formData.gstId}
                onChangeFun={handleChange}
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
                value={formData.pincode}
                onChangeFun={handleChange}
                name="pincode"
              />
              <FormFields
                labelText="Address line 1:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="address1"
                value={formData.addressLine}
                onChangeFun={handleChange}
                name="addressLine"
              />
              <FormFields
                labelText="City:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="City"
                value={formData.city}
                onChangeFun={handleChange}
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
                value={formData.state}
                onChangeFun={handleChange}
                name="state"
              />

              <FormFields
                labelText="Country:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="India"
                value={formData.country}
                onChangeFun={handleChange}
                name="country"
              />
            </div>

            <div className="flex items-stretch m-5 focus:bg-gray-500">
              <button
                type="submit"
                className="flex bg-customPurple  p-2 hover:bg-gray-500 text-white text-md items-center px-4 rounded-lg focus:outline-none  "
              >
                Upload Profile
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
