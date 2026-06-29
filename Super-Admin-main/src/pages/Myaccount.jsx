import React, { useState } from "react";
import { MdOutlineSend } from "react-icons/md";
import { BsImageFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import CopmanyLogo from "../images/Logo.jpg";

export default function AdminRegistrationForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    name: "",
    gender: "",
    profilePic: null,
    dateOfBirth: "",
    role: "admin",
    access_level: 1,
    password: "",
    confirmPassword: "",
    status: "active",
    language: "",
    bankName: "",
    bankAddress: "",
    accountNumber: "",
    ifscCode: "",
    custId: "",
    thirdParty: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profilePic: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/accounts`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      toast.success('Successfully Submitted!!');
      navigate('../');
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('Error submitting form.');
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-6 bg-customGray text-white shadow-lg">
        <div className="flex justify-center items-center min-h-screen w-full bg-gradient-to-r from-gray-700 via-gray-900 to-customGray">
          <div div className="flex justify-between items-start max-w-6xl w-full p-6 space-x-6">
          <div className="text-white text-center py-20 px-10 flex-1">
            <h1 className="text-5xl font-bold mb-6">TRIALSHOPY</h1>
            
            <p className="text-lg mb-8">
            Manage products, track orders, and analyze sales with ease. Ensure seamless operations and drive growth for your e-commerce business. Enter your credentials to manage the e-commerce store.
            </p>
            <p className="text-lg mb-8">Already registered?
              </p>
            <button onClick={() => {
                navigate("/login");
              }}className="bg-yellow-500 text-black px-6 py-3 rounded-full hover:bg-yellow-600">Login</button>
          </div>
          <div className="bg-gray-100 p-8 rounded-lg  shadow-lg w-full max-w-2xl">
          <div className="flex justify-between">
          
            <div className="font-bold mb-5 text-lg text-black text-center w-full">
              Admin SignUp
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-4">
              <input 
                type="file" 
                onChange={handleImageChange} 
                className="hidden"
                id="profilePic"
              />
              <label 
                htmlFor="profilePic" 
                className="cursor-pointer flex items-center gap-2 text-gray-700"
              >
                <BsImageFill />
                <span>Upload Image</span>
              </label>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">Name</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="name"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">E-Mail</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="email"
                  name="email"
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Phone Number</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="phone_number"
                  placeholder="Enter Your Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Gender</label>
                <select
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Date of Birth</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Password</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="password"
                  name="password"
                  placeholder="******"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Confirm Password</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="password"
                  name="confirmPassword"
                  placeholder="******"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Language</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="language"
                  placeholder="Enter Your Language"
                  value={formData.language}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Bank Name</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="bankName"
                  placeholder="Enter Your Bank Name"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Bank Address</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="bankAddress"
                  placeholder="Enter Your Bank Address"
                  value={formData.bankAddress}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Account Number</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="accountNumber"
                  placeholder="Enter Your Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">IFSC Code</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="ifscCode"
                  placeholder="Enter Your IFSC Code"
                  value={formData.ifscCode}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Customer ID</label>
                <input
                  className="input-field w-full p-2 border border-gray-300 rounded"
                  type="text"
                  name="custId"
                  placeholder="Enter Your Customer ID"
                  value={formData.custId}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="thirdParty"
                  name="thirdParty"
                  checked={formData.thirdParty}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="thirdParty" className="text-gray-700">Third Party</label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none"
              >
                Submit
                <MdOutlineSend className="ml-2 scale-125 fill-white" />
              </button>
            </div>
          </form>
        </div>
          </div>
        
        </div>
      </div>
    </>
  );
}
