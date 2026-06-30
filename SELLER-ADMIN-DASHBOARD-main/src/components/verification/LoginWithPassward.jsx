import React, { useContext, useEffect, useState } from "react";

import { HiEye } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserContext } from "../context/UserContext";
import { GoEyeClosed } from "react-icons/go";

const LoginwithPwd = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useContext(UserContext);
  const sellerIsPresent = authenticated?.user?._id;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/login`;
      const response = await axios.post(
        api,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success === true) {
        let storeStatusData = null;
        if (response.data.seller.storeId) {
          const storeStatus = await axios.get(
            `${import.meta.env.VITE_API_ENDPOINT}/api/v1/get-status/${response.data.seller.storeId}`
          );
          storeStatusData = storeStatus?.data?.sellerStatus?.varification;
        }

        setAuthenticated({
          user: response.data.seller,
          token: response.data.token,
          storeStatus: storeStatusData,
        });
        Cookies.set("tokenx", response.data.token);
        navigate("/dashboard");
        setLoading(false);
        toast.success("Login Successfully");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (sellerIsPresent) {
      navigate("/dashboard");
    }
  }, [sellerIsPresent, navigate]);

  return (
    <>
      <div className="flex w-full flex-col mb-2">
        <p className="flex-wrap text-xl text-center items-center font-semibold my-2">
          Login
        </p>
        <p className="flex-wrap text-xs mb-2 text-center text-gray-500">
          Continue to Trialshopy
        </p>
      </div>

      <div className="flex w-full flex-col">
        <input
          type="email"
          placeholder="Email or Mobile number"
          className={`w-full h-[47px] px-2 py-1 border border-gray-400 rounded-md `}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid-flow-col max-md:gap-3 justify-between">
        <div className="relative flex">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`flex border w-full h-[47px] border-gray-400 py-1 px-2 rounded-md my-2 `}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {showPassword ? (
            <HiEye
              name="eye-fill"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
            />
          ) : (
            <GoEyeClosed
              name="eye-fill"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/password/forgot")}
            className="hover:underline text-blue-500"
          >
            Forgot Password ?
          </button>
          <div className="flex items-center">
            <input type="checkbox" className="w-4 h-4 mr-2" />
            <span className="text-xs text-[14px] text-gray-900">
              Remember Me
            </span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col my-1">
        <button
          onClick={handleLogin}
          className="w-full text-white bg-orange-400 rounded-md my-2 py-2 text-center flex items-center justify-center h-[48px]"
        >
          {loading ? "Please wait..." : "Login"}
        </button>
      </div>
    </>
  );
};

export default LoginwithPwd;
