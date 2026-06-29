import React, { useContext, useState } from "react";
import { MdOutlineSend } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

import { UserContext } from "../../../components/context/UserContext";

const Password = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  const [authenticated] = useContext(UserContext);
  const token = authenticated.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/password/update`;

      const response = await axios.put(
        api,
        { oldPassword, newPassword, reEnterPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success === true) {
        toast.success("Password Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving form data:", error.message);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full mt-6 ms-2">
      <form onSubmit={handleSubmit} className="w-full ">
        <div className="flex flex-col items-start justify-start gap-3 w-full ">
          <label htmlFor="oldPassword" className="text-lg">
            Old Password
          </label>
          <input
            className=" lg:w-1/3 w-full border-0 border-b-2 border-gray-500 p-2 text-gray-700"
            type="password"
            placeholder="********"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <label htmlFor="newPassword" className="text-lg">
            New Password
          </label>
          <input
            className="lg:w-1/3 w-full border-0 border-b-2 border-gray-500 p-2 text-gray-700"
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label htmlFor="reEnterPassword" className="text-lg">
            Re-enter Password
          </label>
          <input
            className="lg:w-1/3 w-full border-0 border-b-2 border-gray-500 p-2 text-gray-700"
            type="password"
            placeholder="Re-type New Password"
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
          />
        </div>

        <div className="flex items-stretch mt-5">
          <button
            type="submit"
            className="flex bg-customPurple p-2 hover:bg-gray-500 text-white text-md items-center px-4 rounded-lg focus:outline-none"
          >
            Update Password
            <MdOutlineSend className="ml-2 scale-125 fill-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;
