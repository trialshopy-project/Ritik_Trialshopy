import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CustomerDetails = () => {
  const { id } = useParams();

  const [customerData, setCustomer] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/customers/${id}`
      );
      console.log(response.data, "customer");
      setCustomer(response.data.customer);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-10">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Customer Details
          </div>
          <p className="block mt-1 text-lg leading-tight font-medium text-black">
            Name: {customerData?.name}
          </p>
          <p className="mt-2 text-gray-500">Email: {customerData?.email}</p>
          <p className="mt-2 text-gray-500">
            Phone Number: {customerData?.phone_number}
          </p>
          <p className="mt-2 text-gray-500">City: {customerData?.city}</p>
          <p className="mt-2 text-gray-500">State: {customerData?.state}</p>
          <p className="mt-2 text-gray-500">Country: {customerData?.country}</p>
          <p className="mt-2 text-gray-500">Role: {customerData?.role}</p>
          <p className="mt-2 text-gray-500">Seller ID: {customerData?.sellerId}</p>
          <p className="mt-2 text-gray-500">
            Access Level: {customerData?.access_level}
          </p>
          <p className="mt-2 text-gray-500">Status: {customerData?.status}</p>
          <p className="mt-2 text-gray-500">
            Third Party: {customerData?.thirdParty ? "Yes" : "No"}
          </p>
          <p className="mt-2 text-gray-500">
            Languages: {customerData?.language?.join(", ") || "None"}
          </p>
          <p className="mt-2 text-gray-500">
            Wishlist: {customerData?.wishList?.join(", ") || "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
