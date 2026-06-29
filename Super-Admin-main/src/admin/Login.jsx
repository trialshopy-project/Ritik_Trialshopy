// import Link from "next/link";
import React, { useState } from "react";

import logo from "../images/NameLogo.svg";
import LoginwithPwd from "../pages/LoginwithPwd";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="flex justify-center  items-center  h-screen">
        <div className=" border-2 border-gray-200  sm:shadow-2xl flex sm:w-[480px] h-fit  w-[340px] bg-white flex-col p-3 justify-center rounded-md">
          <div className="flex items-center justify-center mt-5 md:mt-10">
            <img
              width={20}
              height={20}
              src={logo}
              className="ml-[-100px] sm:w-[260px] w-[210px] h-[47px] sm:ml-0 sm:h-[60px] sm:justify-center sm:items-center"
              alt="Logo"
            />
          </div>

          <div className="flex w-full flex-col sm:max-w-[450px] justify-between">
            <LoginwithPwd />
          </div>

          <>
            <div className="items-center justify-center text-center">
              <span className="mt-3 text-center">Or</span>
              <br />
            </div>

            {/* <div className="w-full my-2">
              <p className="mb-1 mr-2 text-sm font-semibold text-center text-gray-800">
                New to Trialshopy?
                <Link
                  to="/account/become-seller-growth"
                  className="mb-2 text-sm font-semibold text-orange-400 hover:font-fontBold"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
            <div className="flex flex-row items-center justify-center">
              <div className="mr-2">
                <hr className="sm:w-[198px] w-[130px] ml-[5px] mt-4 h-px border-1 border-gray-500"></hr>
              </div>
              <div className="mt-2 mr-2">
                <span className="mt-6 text-[14px] text-gray-500">Or</span>
              </div>
              <div>
                <hr className="sm:w-[198px] w-[130px] ml-[5px] mt-4 border-1 border-gray-500"></hr>
              </div>
            </div>
          </>

          <div className="flex flex-row justify-center mb-1">
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
