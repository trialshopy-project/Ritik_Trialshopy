import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserContext } from "../context/UserContext";

const OTPpage = ({ setIsOtp, mobileNumber }) => {
  const inputRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useContext(UserContext);
  const [otp, setOTP] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, event) => {
    const newOTP = [...otp];
    // if otp length is less than 4, fill empty spaces
    while (newOTP.length < 4) newOTP.push("");
    
    newOTP[index] = event.target.value;
    setOTP(newOTP.join(""));

    if (event.target.value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleInputKeyPress = (index, event) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleOTPVerification = async () => {
    if (otp.length !== 4) {
      setVerificationMessage("Invalid OTP length. Please enter a 4-digit OTP.");
      return;
    }
    
    try {
      setLoading(true);
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/verify-login-otp`;
      const response = await axios.post(api, { mobileNumber, otp });

      if (response.data.success) {
        const storeStatus = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/v1/get-status/${response.data.seller.storeId}`
        );

        setAuthenticated({
          user: response.data.seller,
          token: response.data.token,
          storeStatus: storeStatus.data.sellerStatus.varification,
        });
        Cookies.set("tokenx", response.data.token);
        navigate("/dashboard");
        toast.success("Login Successfully");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setVerificationMessage(error?.response?.data?.message || "Failed to verify OTP");
    }
  };

  const [timeInSeconds, setTimeInSeconds] = useState(120);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeInSeconds <= 0) {
        clearInterval(interval);
        // setIsOtp(false); // Customer app goes back, but let's give an explicit resend option instead
      } else {
        setTimeInSeconds((prevTime) => prevTime - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeInSeconds]);

  const handleResendOTP = async () => {
    setVerificationMessage("");
    try {
      setLoading(true);
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/send-login-otp`;
      const response = await axios.post(api, { mobileNumber });
      if (response.data.success) {
        toast.success("OTP resent successfully");
        setTimeInSeconds(120);
        setOTP("");
        // clear inputs
        inputRefs.current.forEach(ref => {
          if (ref.current) ref.current.value = "";
        });
        if (inputRefs.current[0].current) {
          inputRefs.current[0].current.focus();
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setVerificationMessage(err?.response?.data?.message || "Failed to resend OTP");
    }
  };

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="">
      <div className="flex flex-col justify-center rounded-md">
        <div className="flex w-full flex-col sm:max-w-[450px] justify-between">
          <div className="flex w-full flex-col mb-2">
            <p className="flex-wrap text-[20px] text-center items-center font-semibold mb-4 my-2">
              An OTP has been
            </p>
            <p className="flex-wrap text-xs mb-2 text-center text-gray-500">
              Sent to {mobileNumber}
            </p>
            <button 
              onClick={() => setIsOtp(false)}
              className="text-xs text-blue-500 hover:underline mb-2 text-center"
            >
              Change Mobile Number
            </button>
          </div>

          <div className="flex w-full justify-center gap-5">
            {inputRefs.current.map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="text"
                maxLength={1}
                className="w-12 h-12 py-1 border border-gray-400 rounded-md text-center"
                onChange={(event) => handleInputChange(index, event)}
                onKeyDown={(event) => handleInputKeyPress(index, event)}
              />
            ))}
          </div>
        </div>
        
        {verificationMessage && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {verificationMessage}
          </p>
        )}
        
        <div className="w-full flex flex-col my-2">
          <button
            onClick={handleOTPVerification}
            disabled={loading}
            className="w-full text-white my-2 bg-orange-400 rounded-md h-[48px] text-center flex items-center justify-center disabled:bg-orange-300"
          >
            {loading ? "Please wait..." : "Submit"}
          </button>
        </div>

        <div className="w-full mt-5">
          {timeInSeconds > 0 ? (
            <p className="text-[14px] mb-1 text-center text-gray-400 font-normal">
              Resend OTP in
              <span className="font-semibold text-[16px] mb-2 ml-1 text-black">
                {formattedTime}
              </span>
            </p>
          ) : (
             <p className="text-[14px] mb-1 text-center text-gray-400 font-normal">
              Didn't receive OTP?
              <button 
                onClick={handleResendOTP} 
                className="font-semibold hover:font-bold text-[16px] mb-2 ml-1 text-orange-500"
              >
                Resend Now
              </button>
            </p>
          )}
        </div>
        <div className="w-full mt-2">
          <p className="text-[16px] mb-1 text-center text-gray-400 font-normal">
            Having trouble logging in?
            <button className="font-semibold hover:font-bold text-[16px] mb-2 ml-1 text-orange-400">
              Get help
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPpage;
