import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar.jsx';
import Header from '../../../layouts/Topbar.jsx';
import axios from 'axios';
import { UserContext } from '../../../components/context/UserContext.jsx';

const Cancelled = () => {
  const [authenticated] = useContext(UserContext);
  const seller_id = authenticated.user.storeId;
  const [cancelledData, setCancelledData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/cancelled/${seller_id}?page=${currentPage}&limit=${resultsPerPage}`
      );
      setCancelledData(response.data);
      console.log(response.data); 
    } catch (e) {
      console.log(e);
    }
  };

  const totalPages = Math.ceil(cancelledData.totalCount / resultsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <Navbar />

      <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center w-full">
            <label htmlFor="filter" className="font-bold text-lg text-gray-700">
              Filter by:
            </label>
            <div className="flex flex-col lg:flex-row lg:space-x-2 mt-2 lg:mt-0">
              <input
                type="text"
                placeholder="Sub-order ID"
                // value={filterValue}
                // onChange={handleFilterChange}
                className="border border-gray-300 rounded p-2 lg:ml-4 focus:border-customPurple focus:ring-customPurple focus:outline-none"
              />
              <button
                // onClick={handleFilterSubmit}
                className="bg-customPurple text-white rounded-md px-4 py-2 ml-2 hover:bg-purple-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-customPurple text-white">
                <th className="p-4 text-left border-b">Product Details</th>
                <th className="p-4 text-left border-b">Order ID</th>
                <th className="p-4 text-left border-b">Sub-order ID</th>
                <th className="p-4 text-left border-b">Customer Name</th>
                <th className="p-4 text-left border-b">Phone Number</th>
                <th className="p-4 text-left border-b">Delivery Address</th>
                <th className="p-4 text-left border-b">Quantity</th>
                <th className="p-4 text-left border-b">Size</th>
                <th className="p-4 text-left border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {cancelledData.results &&
                cancelledData.results.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b">
                      <div className="flex items-center">
                        <img
                          // src={item?.productDetails?.images?.[0]?.url}
                          src={item?.productImage}
                          alt={item?.productDetails?.productName}
                          className="w-12 h-12 object-cover rounded mr-4"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {item?.productDetails?.productName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b">{item?.orderId}</td>
                    <td className="p-4 border-b">{item?.subOrderId}</td>
                    <td className="p-4 border-b font-medium text-gray-800">
                      {item?.customer?.name || 'N/A'}
                    </td>
                    <td className="p-4 border-b text-gray-700">
                      {item?.customer?.phone || 'N/A'}
                    </td>
                    <td className="p-4 border-b">
                      {item?.customer?.shippingAddress ? (
                        <div>
                          <div className="text-gray-800 text-sm">{item.customer.shippingAddress.address}</div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {item.customer.shippingAddress.city}, {item.customer.shippingAddress.state} – {item.customer.shippingAddress.pinCode}
                          </div>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="p-4 border-b">{item?.quantity}</td>
                    <td className="p-4 border-b">{item?.size}</td>
                    <td className="p-4 border-b">
                      <button className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {cancelledData.results && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === i + 1
                    ? 'bg-customPurple text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } rounded-lg`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cancelled;
