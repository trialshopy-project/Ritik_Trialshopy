import React, { useState, useEffect } from "react";
import Return_Tracking from "../../Components/Return_Tracking";
import Return from "../../Components/Return";
import Header from "../../../../layouts/Topbar";
import axios from "axios";
import toast from "react-hot-toast";

const Return_tracking_In_transit = () => {
  const [deliveryStatus, setDeliveryStatus] = useState("In Transit");
  const [returns, setReturns] = useState([]);

  const fetchReturns = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/orders/returns?deliveryStatus=${deliveryStatus}`
      );
      setReturns(response.data?.results);
      console.log(response.data.results);
    } catch (error) {
      toast.error("Failed to fetch return data.");
      console.error("Error fetching return data:", error);
    }
  };

  const handleStatusChange = (status) => {
    setDeliveryStatus(status);
  };

  const handleDownload = () => {
   window.print()
    console.log('download!')
  };

  useEffect(() => {
    fetchReturns();
  }, [deliveryStatus]);

  return (
    <>
      <Header />
      <Return />
      <div className="p-4">
        <div className="flex justify-start gap-5 p-4 mb-4 font-semibold text-customPurple ">
          {["In Transit","return", "Out for take away", "Delivered", "Lost"].map(
            (status) => (
              <button
                key={status}
                className={`p-2 rounded-md w-full md:w-auto ${
                  deliveryStatus === status ? "bg-customPurple text-white" : ""
                }`}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </button>
            )
          )}
        </div>
        <div className="flex flex-col md:flex-row md:justify-end items-center mb-4 w-full ">
          <button
            className="bg-orange-400 text-white hover:bg-orange-500 p-2 rounded-md w-full md:w-auto"
            onClick={handleDownload}
          >
            Print
          </button>
        </div>

        {returns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-customPurple text-white uppercase text-sm leading-normal">
                <tr>
                <th className="py-3 px-6 text-left">Sub Order Id</th>
                  <th className="py-3 px-6 text-left">Product ID</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Size</th>
                  <th className="py-3 px-6 text-left">Status Updates</th>
                  <th className="py-3 px-6 text-left">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {returns.map((returnItem) => (
                  <tr
                    key={returnItem._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                     <td className="py-3 px-6 text-left whitespace-nowrap ">
                      <div className="font-semibold">
                        {returnItem.orderId}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold">
                        {returnItem.productId}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold">{returnItem.quantity}</div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold">{returnItem.size}</div>
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      
                      {returnItem.statusUpdates.length > 0 ? (
                        // returnItem.statusUpdates.map((update, index) => (
                        //   <div key={index} className="ml-4">
                        //     <p>{update.status}</p>
                        //   </div>
                        // ))
                        <div className="font-semibold">
                          {returnItem.status}
                        </div>
                      ) : (
                        <p>No status updates available.</p>
                      )}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <div className="font-semibold">
                        {returnItem?.delivery_status?returnItem?.delivery_status:(
                          <div className="justify-center items-center">
                              <p className="text-2xl font-semibold">-</p>
                            </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <img
              alt="No data"
              src="https://openui.fly.dev/openui/100x100.svg?text=💸"
              className="w-24 h-24"
            />
            <p className="text-gray-600 mt-2">No data available as of now.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Return_tracking_In_transit;
