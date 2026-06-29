import React from "react";
import Header from "../../../layouts/Topbar";
import Return from "./Return";
import { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../../../components/context/UserContext";
const Courier_partner = () => {
  const [authenticated] = useContext(UserContext);
  const store_id = authenticated.user.storeId;
  const [courier_data, setcourier_data] = useState([]);
  async function fetchdata() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/getCourierDetails/${store_id}`
      );
  
      if (response.data.results && response.data.results.length > 0) {
        setcourier_data(response.data.results);
      } else {
        toast.success("No courier data found.");
        setcourier_data([]);
      }
    } catch (error) {
      toast.error("Failed to fetch courier data.");
      console.error("Error fetching courier data:", error);
    }
  }
  
  useEffect(() => {
    fetchdata();
  }, []);
  const tableHeader = [
    "Preference",
    "Courier Partner",
    "Reverse Shipping Charge",
    "Avg Return Time (Days)",
    "Claims Raised",
    "Claim Approval %",
  ];
  return (
    <>
      <Header />
      <Return />
      {/**later on addying custom add delivery details here */}

      <table className="w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="bg-customPurple text-white">
            {tableHeader.map((th, index) => (
              <td key={index} className="font-bold p-4 text-center">
                {th}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {courier_data && courier_data.map((partner, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border-b">{partner.preference}</td>
              <td className="p-4 border-b">{partner.courierPartner}</td>
              <td className="p-4 border-b">{partner.reverseShippingCharge}</td>
              <td className="p-4 border-b">{partner.avgReturnTimeDays}</td>
              <td className="p-4 border-b">{partner.claimsRaised}</td>
              <td className="p-4 border-b">
                {partner.courierPartnerClaimApprovalPercentage}%
              </td>
            </tr>
          ))}
          {
            !courier_data&&(
                <td>
                    No details found
                </td>
            )
          }
        </tbody>
      </table>
    </>
  );
};

export default Courier_partner;
