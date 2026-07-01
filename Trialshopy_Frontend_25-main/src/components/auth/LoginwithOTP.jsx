"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const LoginwithOTP = ({ setIsOtp, mobileNumber, setMobileNumber }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const serverURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  // Keep only the raw 10 digits in the input; +91 is shown as a fixed prefix.
  const digits = (mobileNumber || "").replace(/\D/g, "").slice(-10);

  const handleSendOTP = async () => {
    setError("");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const formattedMobileNumber = "+91" + digits;
    setMobileNumber(formattedMobileNumber);

    try {
      setLoading(true);
      await axios.post(`${serverURL}/api/v1/send-otp`, {
        mobileNumber: formattedMobileNumber,
      });

      if (rememberMe) {
        localStorage.setItem("rememberedMobile", digits);
      } else {
        localStorage.removeItem("rememberedMobile");
      }
      setIsOtp(true);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    const storedRememberedMobile = localStorage.getItem("rememberedMobile");
    if (storedRememberedMobile) {
      setMobileNumber(storedRememberedMobile);
      setRememberMe(true);
    }
  }, []);

  return (
    <div>
      <div className="flex w-full flex-col mb-2">
        <p className="flex-wrap text-xl text-center items-center font-semibold my-2">
          Login
        </p>
        <p className="flex-wrap text-xs mb-2 text-center text-gray-500">
          Continue to Trialshopy
        </p>
      </div>

      <div className="flex w-full flex-col">
        <div
          className={`flex items-center w-full h-[48px] border rounded-md overflow-hidden ${
            Error ? "border-red-500" : "border-gray-300 focus-within:border-[#EB8105]"
          }`}
        >
          <span className="px-3 h-full flex items-center bg-gray-50 text-gray-600 border-r border-gray-300 select-none">
            +91
          </span>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            maxLength={10}
            className="flex-1 h-full py-1 px-3 outline-none"
            value={digits}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendOTP();
            }}
          />
        </div>
      </div>
      {Error && <p className="text-red-500 text-xs mt-2">{Error}</p>}

      <div className="grid-flow-col max-md:gap-3 justify-between">
        <div className="flex justify-start">
          <input
            type="checkbox"
            className="w-4 h-4 mt-4 mr-2 p-1 border border-gray-400 rounded-sm accent-orange-400"
            checked={rememberMe}
            onChange={handleRememberMeChange}
          />

          <span className="text-xs mb-2 text-[14px] text-gray-900 mt-4">
            Remember Me
          </span>
        </div>

        <div className="w-full flex flex-col my-1">
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full text-white my-2 bg-orange-400 rounded-md h-[48px] text-center flex items-center justify-center"
          >
            {loading ? "Sending OTP…" : "Request OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginwithOTP;
