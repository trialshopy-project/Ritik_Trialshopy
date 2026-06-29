import React, { useState, useEffect, use, useContext } from "react";
import axios from "axios";
import FormFields from "./FormFields";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

const MainBusinessInfo = () => {
  const [authenticated] = useContext(UserContext);
  const storeId = authenticated.user.storeId;
  const [navigate_forward,setNatigateForward]=useState(false)
  const navigate = useNavigate();
  const [errorform, setErrorform] = useState("");
  const [forward,setforward]=useState(false)
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    gstId: "",
    addressLine: "",
    city: "",
    pincode: "",
    landmark: "",
    state: "",
    country: ""
  });


  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/v1/getStoreDetails/${storeId}`);
      const data = response.data?.data;      
      setFormData({
        storeName: data?.storeName,
        storeDescription: data?.storeDescription,
        gstId: data?.gstId,
        addressLine: data?.addressLine,
        city: data?.city,
        pincode: data?.pincode,
        state: data?.state,
        country: data?.country,
      });

      if (Object.keys(data).every(key => data[key])) {
        setforward(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (authenticated?.user?.storeId) {
      fetchData();
    }
  }, [authenticated.user,storeId]);

  const handleChange = (newValue, fieldName) => {
    console.log(newValue,fieldName)
 
    const pin_code=/^[0-9]{0,6}$/;
   
    if(fieldName === 'pincode'){
      if(pin_code.test(newValue)){
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

    console.log(formData, "dsd");

    const requiredFields = [
      "storeName",
      "storeDescription",
      "gstId",
      "pincode",
      "addressLine",
      "country",
      "state",
      "city",
    ];

    const isEmptyField = requiredFields.some((fieldName) => {
      return !formData[fieldName] && !formData[fieldName];
    });

    if (isEmptyField) {
      setErrorform("*Please fill all fields.");
      return;
    }

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
      // console.log(response, "aukkkkkkkkkkkkkkkkka");
      const id = response?.data?._id;

      if (id) {
        const url = `/become-seller/verification`;
        navigate(url);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.error("Error saving form data:", error);
    }
  };

  return (
    <>
    <div className="flex flex-col items-start justify-start w-full mt-3">
    <div className=" w-full  my-10 flex flex-row justify-center items-center gap-0  ">
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
        <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
            1
          </div>
          <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
            Seller Info
          </span>
        </div>
        <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20  border border-gray-300"></div>
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
        <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
            2
          </div>
          <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
            Store Info
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

      <div className="w-full flex items-center justify-start px-10 lg:px-40 pt-5">
        <div className="w-full p-1">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center justify-between lg:flex-row w-full">
              <FormFields
                labelText="Store*"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="En/liveproduct/LiveproductPageter Name"
                value={formData.storeName}
                onChangeFun={handleChange}
                name="storeName"
              />

              <FormFields
                labelText="Store Description*"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="Enter Description"
                value={formData.storeDescription}
                onChangeFun={handleChange}
                name="storeDescription"
              />

              <FormFields
                labelText="Store GSTIN*"
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
                labelText="Pincode*"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="number"
                placeholder="430023"
                value={formData.pincode}
                onChangeFun={handleChange}
                name="pincode"
              />
              <FormFields
                labelText="Address *"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="address1"
                value={formData.addressLine}
                onChangeFun={handleChange}
                name="addressLine"
              />
              <FormFields
                labelText="City*"
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
                labelText="State*"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="State"
                value={formData.state}
                onChangeFun={handleChange}
                name="state"
              />

              <FormFields
                labelText="Country*"
                classes="w-full box-border flex flex-row justify-center items-center p-2 gap-2  bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700 "
                type="text"
                placeholder="India"
                value={formData.country}
                onChangeFun={handleChange}
                name="country"
              />
            </div>
            <div className="mt-6 flex justify-center px-3 text-[red]">
              {errorform}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="my-3 flex flex-row justify-center items-center px-4 py-2 rounded-lg bg-gradient-to-b from-[#EB8105] to-[#FAAC06]"
              >
                Save & Next
              </button>
            </div>
          </form>
        </div>
        <div className="md:mt-24 sm:mt-24"></div>
      </div>
    </div>
    </>
  );
};
export default MainBusinessInfo;
