import React, { useContext, useEffect, useState,useRef } from "react";
import FormFields from "./FormFields";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
const MainBasicInfo = () => {
  const [errorform, setErrorform] = useState("");
  const [authenticated] = useContext(UserContext);
  const [sellerData, setSellerData] = useState({});
  const sellerIds = authenticated.user._id;
  const navigate = useNavigate();
  const [forward,setforward]=useState(false)
  console.log(authenticated, "d");
  const buttonRef=useRef()
useEffect(
   ()=>{
   if(authenticated.user){
    setFormData({
      firstName:authenticated.user?.firstName,
      middleName:authenticated.user?.middleName,
      lastName:authenticated.user?.lastName,
      phoneNumber:authenticated.user?.phoneNumber,
      alternatePhoneNumber:authenticated.user?.alternatePhoneNumber,
      addressLine:authenticated.user?.addressLine,
      city:authenticated?.user?.city,
      pincode:authenticated?.user?.pincode,
      state:authenticated?.user?.state,
      country:authenticated?.user?.country,
    })
  if (Object.keys(formData).every(key => formData[key])) {
    setforward(true)
  }
   }else{

   }
      
  },[authenticated.user]
)

const storeId=authenticated.user?.storeId||null;
const name=authenticated.user?.middleName||null
console.log(name, 'is name ')


  const fetchSingleSellers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/sellers/${sellerIds}`
      );
      console.log(data, "hello bro");
      setSellerData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    addressLine: "",
    city: "",
    pincode: "",
    landmark: "",
    state: "",
    country: "",
  });

  const handleChange = (newValue, fieldName) => {
    console.log(newValue,fieldName)
    const regex = /^[0-9]{0,10}$/;
    const regex_pin_code=/^[0-9]{0,6}$/;
    if(fieldName === 'phoneNumber'|| fieldName==='alternatePhoneNumber'){
      if(regex.test(newValue)){
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: newValue,
        }));
      }
    }
    else if(fieldName === 'pincode'){
      if(regex_pin_code.test(newValue)){
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: newValue,
        }));
      }
    }
    else{
      setFormData((prevData) => ({
        ...prevData,
        [fieldName]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData, "formdata");

    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "pincode",
      "addressLine",
      "country",
      "state",
      "city",
    ];
// console.log('form data is : ',formData)
    const isEmptyField = requiredFields.some((fieldName) => {
      return !formData[fieldName] && !formData[fieldName];
    });

    if (isEmptyField) {
      setErrorform("*Please fill all fields.");
      return;
    }

    try {
      // console.log(sellerIds,'is is is ..............')
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateSeller/${sellerIds}`,
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
        const url = `/become-seller/business-info`;
        navigate(url);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.error("Error saving form data:", error);
    }
  };

  return (
    <>
   {
  forward ? (
    navigate('/become-seller/business-info')
  ) : (
    <div className="flex flex-col items-start justify-start w-full mt-3">
      <div className=" w-full  my-10 flex flex-row justify-center items-center gap-0  ">
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
          <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
            1
          </div>
          <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
            Seller Info
            {/* Basic Info */}
          </span>
        </div>
        <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20  border border-gray-300"></div>
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
          <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-gray-300">
            2
          </div>
          <span className="sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 w-[129px] sm:font-normal text-center text-gray-400">
            Store Info
            {/* Business Info */}
          </span>
        </div>
        <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20 sm:border-[1px] border border-gray-300"></div>
        <div className="flex flex-col items-center p-0 gap-4  h-[90px]">
          <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-gray-300">
            3
          </div>
          <span className="sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 w-[100px] sm:font-normal text-center text-gray-400">
            Verification
          </span>
        </div>
      </div>
      <div className="w-full flex items-center justify-start px-10 lg:px-40 ">
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className=" flex flex-col justify-center items-center "
          >
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
                onChangeFun={handleChange}
                name="firstName"
              />

              <FormFields
                labelText="Middle Name"
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
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
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Name"
                value={formData.lastName}
                onChangeFun={handleChange}
                name="lastName"
              />
            </div>
            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                  <span>
                    Phone Number <span style={{ color: "red" }}>*</span>
                  </span>
                }
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="tel"
                placeholder="(304) 555-0108"
                value={formData.phoneNumber}
                onChangeFun={handleChange}
                name="phoneNumber"
              />
              <FormFields
                labelText="Alternate Phone Number"
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="tel"
                placeholder="(304) 555-0108"
                value={formData.alternatePhoneNumber}
                onChangeFun={handleChange}
                name="alternatePhoneNumber"
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
              (
                    <span>
                      Pincode <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="430023"
                value={formData.pincode}
                onChangeFun={handleChange}
                name="pincode"
              />
              <FormFields
                labelText={
                   (
                    <span>
                      Address line <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="address"
                value={formData.addressLine}
                onChangeFun={handleChange}
                name="addressLine"
              />
              <FormFields
                labelText="City*"
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="city"
                value={formData.city}
                onChangeFun={handleChange}
                name="city"
              />
            </div>

            <div className="flex w-full flex-col lg:flex-row items-center justify-between">
              <FormFields
                labelText={
                 (
                    <span>
                      Country <span style={{ color: "red" }}>*</span>
                    </span>
                  )
                }
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter the Country Name"
                value={formData.country}
                onChangeFun={handleChange}
                name="country"
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
                classes=" box-border  flex flex-row justify-center items-center p-2 gap-2  border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter your State name "
                value={formData.state}
                onChangeFun={handleChange}
                name="state"
              />
            </div>
            <div className="mt-6 flex justify-center text-[red]">
              {errorform}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="my-3 flex flex-row justify-center items-center px-4 py-2 rounded-lg bg-gradient-to-b from-[#EB8105] to-[#FAAC06]" ref={buttonRef}
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="md:mt-24 sm:mt-24"></div>
    </div>
  )
}
    </>
  );
};

export default MainBasicInfo;
