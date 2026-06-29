import { useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState({
    user: {},
    token: "",
    storeStatus: "",
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = Cookies.get("tokenx");
        // console.log(token, "token");
        if (token && token !== authenticated.token) {

          const response = await fetch(
            `${import.meta.env.VITE_API_ENDPOINT}/api/v1/checklogin`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            Cookies.remove("token");
          }
          const resData = await response.json();
          ///------------------------------------------------------------->

          const storeStatus = await axios.get(
            `${import.meta.env.VITE_API_ENDPOINT}/api/v1/get-status/${
              resData.seller.storeId
            }`
          );

          console.log(storeStatus, "storeStatus");

          /////->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

          setAuthenticated({
            user: resData.seller,
            token: resData.token,
            storeStatus: storeStatus.data.sellerStatus.varification,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.clear();
        Cookies.remove("token");
      }
    };
    checkAuthentication();
  }, []);

  return (
    <UserContext.Provider value={[authenticated, setAuthenticated]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
