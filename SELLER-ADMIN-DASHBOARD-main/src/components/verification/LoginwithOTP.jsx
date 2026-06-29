import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LoginwithOTP = ({ setIsOtp, mobileNumber, setMobileNumber }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setError("");
    if (!mobileNumber) {
      setError("Please enter mobile number");
      return;
    }

    try {
      setLoading(true);
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/send-login-otp`;
      const response = await axios.post(api, { mobileNumber });

      if (response.data.success) {
        setIsOtp(true);
        toast.success(response.data.message || "OTP sent successfully");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || "Failed to send OTP");
    }
  };

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
          type="tel"
          placeholder="Mobile number"
          className={`w-full h-[47px] py-1 px-2 border ${
            error ? "border-red-500" : "border-gray-400"
          } rounded-md`}
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      <div className="grid-flow-col max-md:gap-3 justify-between">
        <div className="flex justify-start items-center my-2">
          <input
            type="checkbox"
            className="w-4 h-4 mr-2 p-1 border border-gray-400 rounded-sm accent-orange-400"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="text-xs text-[14px] text-gray-900">
            Remember Me
          </span>
        </div>

        <div className="w-full flex flex-col my-1">
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full text-white my-2 bg-orange-400 rounded-md h-[48px] text-center flex items-center justify-center disabled:bg-orange-300"
          >
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginwithOTP;
