import React, { useContext, useEffect, useState } from "react";
import FormFields from "../../../components/verification/FormFields";
import { MdOutlineSend } from "react-icons/md";

import axios from "axios";

import toast from "react-hot-toast";
import { auth } from "../../Firebase/firebaseConfig";
import { UserContext } from "../../../components/context/UserContext";

const Basic_info_account = ({ parsedUserData }) => {
  const [errorform, setErrorform] = useState("");
  // console.log(parsedUserData, "bhai");

  const [authenticated, setAuthenticated] = useContext(UserContext);

  const [sellerDetails, setSellerDetails] = useState({
    firstName: parsedUserData?.firstName || "",
    middleName: parsedUserData?.middleName || "",
    lastName: parsedUserData?.lastName || "",
    email: parsedUserData?.email || "",
    phoneNumber: parsedUserData?.phoneNumber || "",
    alternatePhoneNumber: parsedUserData?.alternatePhoneNumber || "",
    password: parsedUserData?.password || "",
  }); //sellerDetails

  const [formData, setFormData] = useState({
    firstName: parsedUserData?.firstName || "",
    middleName: parsedUserData?.middleName || "",
    lastName: parsedUserData?.lastName || "",
    phoneNumber: parsedUserData?.phoneNumber || "",
    alternatePhoneNumber: parsedUserData?.alternatePhoneNumber || "",
    addressLine: parsedUserData?.addressLine || "",
    city: parsedUserData?.city || "",
    pincode: parsedUserData?.pincode || "",
    state: parsedUserData?.state || "",
    country: parsedUserData?.country || "",
  });

  //addressDetails
  const handleChange = (newValue, fieldName) => {
    let validValue = newValue;

    
    if (fieldName === 'phoneNumber' || fieldName === 'alternatePhoneNumber') {
      // Allow only numbers and check the length
      if (/^\d+$/.test(newValue)) {
        if (newValue.length > 10) {
          validValue = newValue.slice(0, 10);
        } else {
          validValue = newValue;
        }
      } else {
        validValue = ''; // Clear the value if non-numeric characters are entered
      }
    } else if (fieldName === 'pincode') {
      // Allow only numbers and check the length
      if (/^\d+$/.test(newValue)) {
        if (newValue.length > 6) {
          validValue = newValue.slice(0, 6);
        } else {
          validValue = newValue;
        }
      } else {
        validValue = ''; // Clear the value if non-numeric characters are entered
      }
    }
    
    
  
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: validValue,
    }));
  };
  

  useEffect(() => {
    setFormData({
      firstName: parsedUserData?.firstName || "",
      middleName: parsedUserData?.middleName || "",
      lastName: parsedUserData?.lastName || "",
      phoneNumber: parsedUserData?.phoneNumber || "",
      alternatePhoneNumber: parsedUserData?.alternatePhoneNumber || "",
      addressLine: parsedUserData?.addressLine || "",
      city: parsedUserData?.city || "",
      pincode: parsedUserData?.pincode || "",
      state: parsedUserData?.state || "",
      country: parsedUserData?.country || "",
      // email:parsedUserData?.email || ""
    });
  }, [parsedUserData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.addressLine || !formData.firstName || !formData.lastName|| !formData.phoneNumber || !formData.pincode || !formData.country || !formData.state){
      toast.error("Please fill all fields with *");
      return 
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateSeller/${
          parsedUserData._id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response, "D");
      if (response.status === 200) {
        toast.success("Profile Updated Successfully");
      }
      setAuthenticated({
        ...authenticated,
        user: response.data,
      });
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
                  formData.firstName ? (
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
                value={formData.firstName}
                name="firstName"
                onChangeFun={handleChange}
              />

              <FormFields
                labelText="Middle Name"
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Name"
                value={formData.middleName}
                onChangeFun={handleChange}
                name="middleName"
              />
              <FormFields
                labelText={
                  formData.lastName ? (
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
                value={formData.lastName}
                name="lastName"
                onChangeFun={handleChange}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  sellerDetails.email ? (
                    "Email"
                  ) : (
                    <span>
                      Email <span style={{ color: "red" }}>*</span>
                      {/* e,a */}
                    </span>
                  )
                }
                classes="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="email"
                placeholder="user@gmail.com"
                value={parsedUserData.email}
                name="email"
                onChangeFun={handleChange}
              />
              <FormFields
                labelText={
                  formData.phoneNumber ? (
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
                value={formData.phoneNumber}
                name="phoneNumber"
                onChangeFun={handleChange}
              />
              <FormFields
                labelText="Alternate Phone Number"
                classes=" box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="tel"
                placeholder="(304) 555-0108"
                value={formData.alternatePhoneNumber}
                name="alternatePhoneNumber"
                onChangeFun={handleChange}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.pincode ? (
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
                value={formData.pincode}
                name="pincode"
                onChangeFun={handleChange}
              />
              <FormFields
                labelText={
                  formData.addressLine ? (
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
                value={formData.addressLine}
                name="addressLine"
                onChangeFun={handleChange}
              />
              <FormFields
                labelText="City"
                classes="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="city"
                value={formData.city}
                name="city"
                onChangeFun={handleChange}
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  formData.country ? (
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
                value={formData.country}
                name="country"
                onChangeFun={handleChange}
              />
              <FormFields
                labelText={
                  formData.state ? (
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
                value={formData.state}
                name="state"
                onChangeFun={handleChange}
              />
            </div>

            <div className="flex items-stretch m-5 focus:bg-gray-500">
              <button
                type="submit"
                className="flex py-2  bg-customPurple text-white hover:bg-gray-500  text-md items-center px-4 rounded-lg focus:outline-none  "
              >
                Update Profile
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
