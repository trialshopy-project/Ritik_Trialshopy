import React, { useState, } from "react";
import axios from "axios";

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
    name: "",
    gender: "",
    profilePic: "",
    dateOfBirth: "",
    role: "admin",
    access_level: 1,
    password: "",
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

  const handleSubmit = async(e) => {
    e.preventDefault();
     
    try {
     
  
        const response = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/admins`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(response.data, "swati");
        navigate("../customers")
  
        toast.success('Succesfully Submitted!!');
        // Redirect to the desired page after successful submission
        // navigate('../Merchant'); // You can use navigate() function here if needed
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    // Handle form submission logic here
    console.log("Form data submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="profilePic" className="block text-sm font-medium">
                Profile Picture URL
              </label>
              <input
                type="text"
                id="profilePic"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              readOnly
              className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="access_level" className="block text-sm font-medium">
              Access Level
            </label>
            <input
              type="number"
              id="access_level"
              name="access_level"
              value={formData.access_level}
              onChange={handleChange}
              className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium">
              Language
            </label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium">
                Bank Name
              </label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div>
              <label htmlFor="bankAddress" className="block text-sm font-medium">
                Bank Address
              </label>
              <input
                type="text"
                id="bankAddress"
                name="bankAddress"
                value={formData.bankAddress}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div>
              <label htmlFor="ifscCode" className="block text-sm font-medium">
                IFSC Code
              </label>
              <input
                type="text"
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="custId" className="block text-sm font-medium">
                Customer ID
              </label>
              <input
                type="text"
                id="custId"
                name="custId"
                value={formData.custId}
                onChange={handleChange}
                className="mt-1 p-2 block w-full bg-gray-700 border border-gray-400 rounded-md text-white"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="thirdParty"
                name="thirdParty"
                checked={formData.thirdParty}
                onChange={handleChange}
                className="mt-1 p-2 bg-gray-700 border border-gray-400 rounded-md text-white"
              />
              <label htmlFor="thirdParty" className="ml-2 text-sm font-medium">
                Third Party
              </label>
            </div>
          </div>
          <button type="submit" className="w-full p-2 bg-white7text-black font-semibo4d rounded-md">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistrationForm;
