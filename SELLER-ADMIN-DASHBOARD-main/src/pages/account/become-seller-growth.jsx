import React, { useContext, useEffect, useState } from "react";
import useOtp from "../../hooks/useOtp";
import toast from "react-hot-toast";
import "./seller.css";
import useSignupSeller from "../../hooks/useRegister";
import { IoIosPeople } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { GiIndianPalace } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import logo from "../../images/LOGO.png";
import { UserContext } from "../../components/context/UserContext";
import axios from "axios";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
const Become_sheller_otp = () => {
  const { timer, sellerOTP } = useOtp();

  const [eyeOpen, seteyeopen] = useState(false);
  const { signupSeller, loadingSeller } = useSignupSeller();

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [requirementsMet, setRequirementsMet] = useState({
    minLength: false,
    specialChar: false,
    capitalLetter: false,
    number: false,
  });
  const [authenticated] = useContext(UserContext);
  const sellerIsPresent = authenticated?.user?._id;

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    const isMinLength = newPassword.length >= 8;
    const hasSpecialChar = /[!@#$%^&*]/.test(newPassword);
    const hasCapitalLetter = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    setRequirementsMet({
      minLength: isMinLength,
      specialChar: hasSpecialChar,
      capitalLetter: hasCapitalLetter,
      number: hasNumber,
    });
  };
const [load,setload]=useState(false)
  const [user, setUser] = useState({
    email: "",
    otp: "",
  });

  const handleChangeMobileNumber = (e) => {
    const mobileNumber = e.target.value;
    const regex = /^[0-9]{0,10}$/;

    if (regex.test(mobileNumber)) {
      setMobileNumber(mobileNumber);
    }
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("sellerEmail");
    if (storedEmail) {
      setUser((prevUser) => ({ ...prevUser, email: storedEmail }));
    }
  }, []);

  const registerData = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const { email, otp } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
    }

    const { minLength, specialChar, capitalLetter, number } = requirementsMet;
    if (!minLength || !specialChar || !capitalLetter || !number) {
      if (!minLength)
        toast.error("Password must be at least 8 characters long");
      if (!specialChar)
        toast.error("Password must contain a special character");
      if (!capitalLetter) toast.error("Password must contain a capital letter");
      if (!number) toast.error("Password must contain a number");
      return;
    }

    await signupSeller(email, password, otp, navigate, mobileNumber);
  };

  const handleSendButton = async (e) => {
    e.preventDefault();
    setload(true)
    await sellerOTP(email);
    setload(false)
  };

  useEffect(() => {
    if (sellerIsPresent) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="flex w-full flex-col md:flex-row md:px-5 justify-center items-center md:space-x-8 mt-5">
      <div className=" mx-auto mt-5 md:px-4 shadow-lg bg-white rounded-lg p-4">
        <img className="mb-5 h-16 " src="/images/n-t.png" />
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-left">
            Welcome To Trialshopy
          </h1>
          <p className="text-gray-700 text-left">
            Create your account to start selling
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter Email Id"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-indigo-500"
              onChange={registerData}
              required
            />
          </div>
          <div className="mb-4 flex gap-3">
            <input
              type="text"
              name="otp"
              value={otp}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-#F19305"
              onChange={registerData}
              required
            />

            <button
              type="button"
              onClick={handleSendButton}
              disabled={load || timer > 0 || email.length === 0}
              className={`w-[150px] px-4 py-1 text-sm rounded bg-[#F19305] text-white ${
                timer > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
             { load ? "sending..." : (timer > 0 ? `send otp (${timer}s)` : "send otp")}

              {/* {timer > 0 ? `Resend in ${timer}s` : load?"sending....":'send otp'} */}
            </button>
          </div>
          <div className="mb-4 flex items-center">
            <span className="px-4 py-2 rounded-l border border-gray-300 bg-gray-200">
              +91
            </span>
            <input
              type="text"
              value={mobileNumber}
              placeholder="Enter Mobile Number"
              className="w-full px-4 py-2 rounded-r border border-gray-300 focus:outline-none focus:border-#F19305"
              onChange={handleChangeMobileNumber}
              required
            />
          </div>

          <div className="mb-4 flex flex-row justify-between border-gray-300 focus:outline-none w-full px-4 py-2 rounded border items-center flex-grow">
            <input
              type={`${eyeOpen ? "text" : "password"}`}
              name="password"
              value={password}
              placeholder="Set Password"
              className=" border-none focus:no-underline focus:border-none w-full focus:outline-none outline-none"
              onChange={handleChangePassword}
              required
            />
            <div className="flex-shrink-0 w-fit">
              {eyeOpen ? (
                <FaEye onClick={() => seteyeopen(false)} />
              ) : (
                <FaEyeSlash onClick={() => seteyeopen(true)} />
              )}
            </div>
          </div>

          <div className="rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">
              Make your password strong by adding:
            </h2>
            <ul className="list-disc">
              <div className="mb-1">
                {" "}
                <input
                  type="checkbox"
                  checked={requirementsMet.minLength}
                  readOnly
                  className={`mr-1 ${
                    requirementsMet.minLength
                      ? "text-green-500"
                      : "text-red-500"
                  } rounded-full`}
                />
                Minimum 8 characters (letters & numbers)
              </div>
              <div className="mb-1">
                {" "}
                <input
                  type="checkbox"
                  checked={requirementsMet.specialChar}
                  readOnly
                  className={`mr-1 ${
                    requirementsMet.specialChar
                      ? "text-green-500"
                      : "text-red-500"
                  } rounded-full`}
                />
                Minimum 1 special character (@ # $ % ! ^ & *)
              </div>
              <div className="mb-1">
                <input
                  type="checkbox"
                  checked={requirementsMet.capitalLetter}
                  className={`mr-1 ${
                    requirementsMet.capitalLetter
                      ? "text-green-500"
                      : "text-red-500"
                  } rounded-full`}
                />
                Minimum 1 capital letter (A-Z)
              </div>

              <div>
                <input
                  type="checkbox"
                  disabled
                  checked={requirementsMet.number}
                  readOnly
                  className={`mr-1 ${
                    requirementsMet.number ? "text-green-500" : "text-red-500"
                  } rounded-full`}
                />
                Minimum 1 number (0-9)
              </div>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded bg-[#F19305] text-white"
              disabled={loadingSeller}
            >
              {loadingSeller ? "Please Wait..." : "Create Account"}
            </button>
          </div>

          <div className="mt-5">
            <p>
              By creating account you agree to our{" "}
              <button
                onClick={() => navigate("/becomes-seller/terms-and-condition")}
                className="text-indigo-700 hover:underline"
              >
                Terms & Conditions{" "}
              </button>{" "}
              and <span className="text-indigo-700">Privacy Policy</span>
            </p>
          </div>
        </form>
      </div>
      <div className="pe-4 mt-5">
        <div className="flex items-center justify-center gap-3 mb-5">
          <p>Already a user?</p>
          <button
            onClick={() => navigate("/become-seller/sellerlogin")}
            className="px-4 py-2 rounded bg-[#F19305] text-white"
          >
            Login
          </button>
        </div>
        <div className="gap-4 mt-5">
          <p className="font-bold mb-5 mt-5">
            Grow your business faster by selling on Trialshopy
          </p>
          <div className="items-center justify-center gap-2">
            <div className="flex gap-4 mb-5 items-center justify-between">
              <div className="flex gap-2 items-center">
                <IoIosPeople
                  style={{
                    fontSize: "35px",
                  }}
                />
                <div className="flex flex-col">
                  <span>1000+</span>
                  <p>Suppliers are selling commission-free</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <FaLocationDot
                  style={{
                    fontSize: "30px",
                  }}
                />
                <div className="flex flex-col">
                  <span>1900+</span>
                  Pincodes supported for delivery
                </div>
              </div>
            </div>
            <div className="flex gap-4 mb-5 items-center justify-between ">
              <div className="flex gap-2 items-center">
                <GiIndianPalace
                  style={{
                    fontSize: "30px",
                  }}
                />
                <div className="flex flex-col">
                  <span>Crore of</span>
                  <p>Customers buy across India</p>
                </div>
              </div>
              <div className="flex gap-2 items-start justify-start">
                <BiSolidCategory
                  style={{
                    fontSize: "30px",
                  }}
                />
                <div className="flex flex-col items-start justify-start">
                  <span>700 +</span>
                  <p>Categories to sell</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="border-top mt-5 flex flex-col gap-5 mb-5"
          style={{
            borderTop: "1px solid black",
          }}
        >
          <p className="font-bold mt-5">
            All you need to sell on TrialShopy is:
          </p>
          <div className="flex gap-2 items-center">
            <CiCircleCheck />
            <p>Tax Details</p>
            <IoIosInformationCircleOutline />
          </div>
          <div className="flex flex-col gap-5 ps-5">
            <div className="flex gap-5 items-center">
              <GoDotFill />
              <p>GSTIN (for regular/composition GST sellers)</p>
            </div>

            <div className="flex gap-5 items-center">
              <GoDotFill />
              <p>GSTIN (for regular/composition GST sellers)</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <CiCircleCheck />
            <p>Bank Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Become_sheller_otp;
