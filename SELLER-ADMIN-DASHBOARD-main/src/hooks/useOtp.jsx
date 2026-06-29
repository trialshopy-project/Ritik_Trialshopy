import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const useOtp = () => {
  const [timer, setTimer] = useState(0);
  const [sent,setSent]=useState(false)
  const [load,setload]=useState(false)
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const sellerOTP = async (email) => {
    // setTimer(60);
    try {
      // toast.success("Email is being Verified")
      setload(true)
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/send-otp`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setload(false)
      if (data.success === true) {
        setSent(true);
        setTimer(60);
        toast.success("OTP sent to registered Email ID");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
    }
  };

  return { timer, sellerOTP };
};

export default useOtp;
