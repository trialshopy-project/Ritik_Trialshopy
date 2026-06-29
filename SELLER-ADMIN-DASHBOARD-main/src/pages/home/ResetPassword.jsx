import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/password/reset/${token}`,
        { password, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        toast.success("Password Reset Successfully");
        navigate("/become-seller/sellerlogin");
      }
      console.log(response, "satyam ");
    } catch (error) {
      console.error("Error saving form data:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <Fragment>
      <div className="h-screen flex-col w-full flex items-center justify-center bg-gray-200">
        <h1 className="bg-white font-bold shadow-lg flex items-center justify-center p-4 mb-4 rounded-lg w-full sm:w-1/3">
          Welcome to Trialshopy
        </h1>

        <div className="bg-white w-full sm:w-1/3 h-72 p-2 overflow-hidden shadow-lg rounded-lg px-4">
          <h2 className="text-center text-gray-700 font-medium text-lg mt-5 mb-8">
            Reset Password
          </h2>

          <form
            className="flex flex-col items-center space-y-4"
            onSubmit={resetPasswordSubmit}
          >
            <div className="relative w-full flex items-center">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-2 pr-4 py-2 border border-gray-400 rounded-md outline-none text-base"
              />
            </div>
            <div className="relative w-full flex items-center mt-4">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-2 pr-4 py-2 border border-gray-400 rounded-md outline-none text-base"
              />
            </div>
            <input
              type="submit"
              value="Update"
              className="w-full py-2 bg-customPurple text-white rounded-md cursor-pointer hover:bg-customPurple transition duration-500 shadow-md mt-4"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ResetPassword;
