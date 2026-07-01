"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import LoginwithOTP from "./LoginwithOTP";
import LoginwithPwd from "./LoginwithPwd";
import OTPpage from "./OTPpage";

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("otp");
  const [isOTP, setIsOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <>
      <div className="flex  justify-center items-center sm:justify-start sm:items-start h-[100vh]">
        <div className="mt-4 sm:pl-4 flex sm:w-[480px] h-fit sm:ml-20 w-[340px] bg-white flex-col mx-29 p-3 justify-center rounded-md">
          <div className="flex items-center justify-center mt-5 md:mt-10">
            <Image
              width={200}
              height={200}
              src={"/images/NameLogo.png"}
              className="ml-[-100px] sm:w-[260px] w-[210px] h-[47px] sm:ml-0 sm:h-[60px] sm:justify-center sm:items-center"
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
                    className="w-full text-white my-2 bg-orange-400  rounded-md h-[48px] text-center flex items-center justify-center"
                  >
                    Login with Password
                  </button>
                )}

                {loginMethod === "pwd" && (
                  <button
                    onClick={() => setLoginMethod("otp")}
                    className="w-full text-white my-2 bg-orange-400  rounded-md h-[48px] text-center flex items-center justify-center"
                  >
                    Login with OTP
                  </button>
                )}
              </div>

              {loginMethod === "pwd" && (
                <div className="w-full my-2">
                  <p className="mb-1 mr-2 text-sm font-semibold text-center text-gray-800">
                    New to Trialshopy?
                    <Link
                      href={"/account/register"}
                      className="mb-2 mx-4 text-base font-semibold text-orange-400 hover:font-fontBold"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              )}
            </>
          )}
          <div className="flex flex-row justify-center mb-1">
            <Link
              href="/pages/help"
              className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold"
            >
              Help
            </Link>
            <Link
              href="/pages/privacy"
              className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold"
            >
              Privacy
            </Link>
            <Link
              href="/pages/terms"
              className="text-[14px] mb-1 text-gray-600 mx-2 hover:font-semibold"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
