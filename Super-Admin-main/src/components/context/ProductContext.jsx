import React, { createContext, useState } from "react";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [productData, setProductData] = useState([]);

  const addToProduct = (newData) => {
    setProductData((prevData) => [...prevData, newData]);
  };

  const value = {
    productData,
    addToProduct,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
