import React, { useState, useEffect, createContext, useContext } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState({
    user: {},
    name: "",
    token: "",
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = Cookies.get("token");
        if (token && token !== authenticated.token) {
          // console.log("token", token);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/checklogin`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          //   if (response.data.success) {
          //     setAuthenticated(true);
          //   }
          if (!response.ok) {
            Cookies.remove("token");
          }
          const resData = await response.json();
          setAuthenticated({
            user: resData.userDetails,
            name: resData.userDetails.name,
            token: resData.token,
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

export { UserProvider, UserContext, useContext };
