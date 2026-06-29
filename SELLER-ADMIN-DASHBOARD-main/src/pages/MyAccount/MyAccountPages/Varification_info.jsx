import React, { useEffect, useState } from "react";
import { MdOutlineSend } from "react-icons/md";
import axios from "axios";
import FormFields from "../../../components/verification/FormFields";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Varification_info = ({ verificationData }) => {
  const [verificationDetails, setVerificationDetails] = useState({
    aadharNumber: verificationData?.aadharNumber || "",
    panNumber: verificationData?.panNumber || "",
    GstinNumber: verificationData?.GstinNumber || "",
    fullName: verificationData?.fullName || "",
    accountNumber: verificationData?.accountNumber || "",
    ifscNumber: verificationData?.ifscNumber || "",
  });

  const [formData, setFormData] = useState({
    verificationDetails,
  });

  useEffect(() => {
    setFormData({
      verificationDetails: {
        aadharNumber: verificationData?.aadharNumber || "",
        panNumber: verificationData?.panNumber || "",
        GstinNumber: verificationData?.GstinNumber || "",
        fullName: verificationData?.fullName || "",
        accountNumber: verificationData?.accountNumber || "",
        ifscNumber: verificationData?.ifscNumber || "",
      },
    });
  }, [verificationData]);

  const handleChange = (newValue, fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      verificationDetails: {
        ...prevData.verificationDetails,
        [fieldName]: newValue,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateFormData/${
        verificationData._id
      }`;

      const response = await axios.put(api, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);

      if (response.data.success === true) {
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start w-full mt-3">
      <div className="w-full flex items-center justify-start">
        <div className="w-full p-1">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-between lg:flex-row w-full">
              <FormFields
                labelText="Aadhar OR Vid:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="567431112234"
                value={formData.verificationDetails.aadharNumber}
                onChangeFun={handleChange}
                name="aadharNumber"
              />
              <FormFields
                labelText="Pan:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="RIKD2844N"
                value={formData.verificationDetails.panNumber}
                onChangeFun={handleChange}
                name="panNumber"
              />
            </div>
            <br />
            <div className="flex flex-col justify-center lg:flex-row">
              <FormFields
                labelText="GSTIN:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="6169551651496AG56196"
                value={formData.verificationDetails.GstinNumber}
                onChangeFun={handleChange}
                name="GstinNumber"
              />
              <FormFields
                labelText="Account Holder Name:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="Account Holder Name"
                value={formData.verificationDetails.fullName}
                onChangeFun={handleChange}
                name="fullName"
              />
            </div>
            <br />
            <div className="flex flex-col justify-center lg:flex-row w-full">
              <FormFields
                labelText="Bank Account Number:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="6169551651496AG56196"
                value={formData.verificationDetails.accountNumber}
                onChangeFun={handleChange}
                name="accountNumber"
              />
              <FormFields
                labelText="Enter IFSC Code:"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                type="text"
                placeholder="6169551651496AG56196"
                value={formData.verificationDetails.ifscNumber}
                onChangeFun={handleChange}
                name="ifscNumber"
              />
            </div>
            <div className="flex items-stretch m-5 focus:bg-gray-500">
              <button
                type="submit"
                className="flex bg-customPurple p-2 hover:bg-gray-500 text-white text-md items-center px-4 rounded-lg focus:outline-none"
              >
                Update
                <MdOutlineSend className="ml-2 scale-125 fill-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Varification_info;
