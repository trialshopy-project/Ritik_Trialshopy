import { useContext, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../components/context/UserContext";

const useSignupSeller = () => {
  const [loadingSeller, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useContext(UserContext);
  const signupSeller = async (email, password, otp, navigate, mobileNumber) => {
    setLoading(true);
    try {
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/addStore`;
      const response = await axios.post(
        api,
        { status: "active", varification: "Process" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/signup`,
        {
          email,
          password,
          otp,
          storeId: response.data._id,
          phoneNumber: mobileNumber,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(data, "han bhai abhi aaya");

      if (data.success === true) {
        Cookies.set("tokenx", data.token);
        navigate("/become-seller/basic-info");
        toast.success("Registration Successfully");
        setAuthenticated({
          user: data.seller,
          token: data.token,
          storeStatus: response.data.varification,
          // storeId:response.data.storeId
        });
      }
      console.log(response);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return { loadingSeller, signupSeller };
};

export default useSignupSeller;
