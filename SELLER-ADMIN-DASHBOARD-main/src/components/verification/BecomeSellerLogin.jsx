import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import LoginwithPwd from "./LoginWithPassward.jsx";
import LoginwithOTP from "./LoginwithOTP.jsx";
import OTPpage from "./OTPpage.jsx";
import logo from '../../images/trialshopy_bg.png';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("pwd");
  const [isOTP, setIsOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <>
      <div className="flex justify-center items-center h-[100vh]">
        <div className="border-2 border-gray-200 sm:shadow-2xl flex sm:w-[480px] h-fit w-[340px] bg-white flex-col p-3 justify-center rounded-md">
          <div className="flex items-center justify-center mt-5 md:mt-10">
            <img
              src={logo}
              className="ml-[-100px] sm:w-[260px] w-[210px] h-[47px] sm:ml-0 sm:h-[60px] sm:justify-center sm:items-center bg-white"
              alt="Logo"
            />
          </div>

          <div className="flex w-full flex-col sm:max-w-[450px] justify-between">
            {loginMethod === "otp" && !isOTP && (
              <LoginwithOTP
                setIsOtp={setIsOtp}
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
              />
            )}
            {loginMethod === "otp" && isOTP && (
              <OTPpage setIsOtp={setIsOtp} mobileNumber={mobileNumber} />
            )}
            {loginMethod === "pwd" && <LoginwithPwd />}
          </div>

          {!isOTP && (
            <>
              <div className="items-center justify-center text-center">
                <span className="mt-3 text-center">OR</span>
                <br />
                {loginMethod === "otp" && (
                  <button
                    onClick={() => setLoginMethod("pwd")}
                    className="w-full text-white my-2 bg-orange-400 rounded-md h-[48px] text-center flex items-center justify-center"
                  >
                    Login with Password
                  </button>
                )}

                {loginMethod === "pwd" && (
                  <button
                    onClick={() => setLoginMethod("otp")}
                    className="w-full text-white my-2 bg-orange-400 rounded-md h-[48px] text-center flex items-center justify-center"
                  >
                    Login with OTP
                  </button>
                )}
              </div>

              <div className="w-full my-2">
                <p className="mb-1 mr-2 text-sm font-semibold text-center text-gray-800">
                  New to Trialshopy?
                  <Link
                    href="/account/become-seller-growth"
                    className="mb-2 mx-4 text-base font-semibold text-orange-400 hover:font-bold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </>
          )}

          <div className="flex flex-row justify-center mt-2 mb-1">
            <button className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold">
              Help
            </button>
            <button className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold">
              Privacy
            </button>
            <button className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold">
              Terms
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
