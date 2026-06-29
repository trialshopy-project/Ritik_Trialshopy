"use client";
import { useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";
import wishlist from "@/app/(clayout)/account/wishlist/page";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState({
    user: {},
    name: "",
    token: "",
    authLoading: true,
  });
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = Cookies.get("token");
        if (token && token !== authenticated.token) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/checklogin`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const resData = await response.json();
          if(resData){
            setAuthenticated({
              user: resData.user,
              name: resData.user.name,
              token: resData.token,
              authLoading: false,
            });
          } else {
            setAuthenticated((prev) => ({ ...prev, authLoading: false }));
          }
        } else {
          // No token — user is not logged in, auth check done
          setAuthenticated((prev) => ({ ...prev, authLoading: false }));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        Cookies.remove("token");
        setAuthenticated((prev) => ({ ...prev, authLoading: false }));
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