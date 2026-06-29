import React, { useState, useEffect } from "react";
import Return from "../Components/Return";
import Header from "../../../layouts/Topbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "../../../components/context/UserContext";
const Overview = () => {
  const [data, setData] = useState([]);
  const [authenticated]=useContext(UserContext);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/overview`
      );
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <Return />

      <div className="w-full h-screen p-6 bg-background">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-2 sm:mb-0">
            Product Performance
          </h2>
          
        </div>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border-collapse">
            <thead className="bg-customPurple text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Delivery Status
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Number of Products
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Delivery Partner
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Delivery Price
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Final Price
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Total After Delivery
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="text-center border-t border-gray-200"
                  >
                    <td className="py-3 px-4">
                      {item.delivery_status || "N/A"}
                    </td>
                    <td className="py-3 px-4">{item.productCount}</td>
                    <td className="py-3 px-4">
                      {item.delivery_partner || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      ${item.delivery_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">${item.finalPrice.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      ${item.total_after_delivery.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      ${item.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-3 px-4 text-center text-gray-500"
                  >
                    No data available at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="flex flex-col justify-center items-center h-full text-center text-muted-foreground mt-4">
            <p className="mb-4">No data available at the moment.</p>
            <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md">
              Retry
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Overview;
