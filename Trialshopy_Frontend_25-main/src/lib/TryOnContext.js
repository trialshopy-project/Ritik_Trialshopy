"use client";
import React, { useState, createContext } from "react";
const VirtualContext = createContext();

const VirtualProvider = ({ children }) => {
  const [tryOn, setTryOn] = useState({
    clothUrl: "",
    clothGradioUrl:"",
    personUrl: "",
    imageUrl: "",
    sessionHash: "",
  });

  const updateTryOnUrls = (newUrls) => {
    setTryOn((prevTryOn) => ({
      ...prevTryOn,
      ...newUrls,
    }));
  };


  return (
    <VirtualContext.Provider value={{ tryOn, updateTryOnUrls }}>
      {children}
    </VirtualContext.Provider>
  );
};

export { VirtualProvider, VirtualContext };
