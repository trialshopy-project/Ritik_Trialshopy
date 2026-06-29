import axios from "axios";
import React, { Fragment, useState, useEffect, useContext } from "react";
import { UserContext } from "../../components/context/UserContext";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [authenticated] = useContext(UserContext);

  const token = authenticated.token;

  const frontend_url = `${import.meta.env.VITE_FRONTEND_ENDPOINT}`;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/password/forgot`,
        { email, protocol: frontend_url },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsSubmitted(true);
      }
      console.log(response, "satyam ");
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col w-full h-screen items-center justify-center bg-gray-200 rounded-lg">
        <h1 className="bg-white font-bold shadow-lg flex items-center justify-center p-4 mb-4 rounded-lg w-full sm:w-1/3">
          Welcome to Trialshopy
        </h1>

        <div className="bg-white w-full sm:w-1/3 h-2/5 p-2 overflow-hidden  rounded-lg shadow-lg">
          <h2 className="text-center text-gray-700 font-medium text-lg mt-5  mb-8">
            Forgot Password
          </h2>
          {isSubmitted ? (
            <p className="text-3xl text-green-500">
              Token already send your Email
            </p>
          ) : (
            <>
              <form
                className="flex flex-col items-center space-y-4 px-4"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="relative w-full flex items-center">
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-2 pr-4 py-2 border border-gray-400 rounded-md outline-none text-base"
                  />
                </div>

                <input
                  type="submit"
                  value="Send"
                  className="w-full py-2 bg-customPurple text-white rounded-md cursor-pointer hover:bg-customPurple  transition duration-500 shadow-md"
                />
              </form>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
