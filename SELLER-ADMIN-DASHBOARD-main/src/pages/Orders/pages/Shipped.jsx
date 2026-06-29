import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Components/Navbar.jsx";
import Header from "../../../layouts/Topbar.jsx";
import axios from "axios";
import { UserContext } from "../../../components/context/UserContext.jsx";
import toast from "react-hot-toast";

const Shipped = () => {
  const [authenticated] = useContext(UserContext);
  const seller_id = authenticated.user.storeId;
  const [shippedData, setShippedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, filterValue]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/orders/shipped/${seller_id}?page=${currentPage}&limit=${resultsPerPage}&filter=${filterValue}`
      );
      setShippedData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const totalPages = Math.ceil(shippedData?.totalCount / resultsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleCancelled = async (subOrderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/cancel/${subOrderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success("Order cancelled successfully");
        fetchData();
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      toast.error("There was an error occurred!");
    }
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
                value={filterValue}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded p-2 lg:ml-4 focus:border-customPurple focus:ring-customPurple focus:outline-none"
              />
              <button
                onClick={handleFilterSubmit}
                className="bg-customPurple text-white rounded-md px-4 py-2 ml-2 hover:bg-purple-600"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-customPurple text-white">
                <th className="p-4 text-left border-b border-gray-200">
                  Product Details
                </th>
                <th className="p-4 text-left border-b border-gray-200">
                  Order ID
                </th>
                <th className="p-4 text-left border-b border-gray-200">
                  Sub-order ID
                </th>
                <th className="p-4 text-left border-b border-gray-200">Customer Name</th>
                <th className="p-4 text-left border-b border-gray-200">Phone Number</th>
                <th className="p-4 text-left border-b border-gray-200">Delivery Address</th>
                <th className="p-4 text-left border-b border-gray-200">
                  Quantity
                </th>
                <th className="p-4 text-left border-b border-gray-200">Size</th>
                {/* <th className="p-4 text-left border-b border-gray-200">
                  Price
                </th> */}
                <th className="p-4 text-left border-b border-gray-200">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {shippedData.results ? (
                shippedData.results.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <img
                          // src={item.productDetails.images?.[0]?.url}
                          src={item.productDetails?.productImage}
                          alt={item.productDetails.productName}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="font-semibold text-gray-800 text-center">
                            {item?.productDetails?.productName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      {item.orderId}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      {item.subOrderId}
                    </td>
                    <td className="p-4 border-b border-gray-200 font-medium text-gray-800">
                      {item?.customer?.name || 'N/A'}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-gray-700">
                      {item?.customer?.phone || 'N/A'}
                    </td>
                    <td className="p-4 border-b border-gray-200">
                      {item?.customer?.shippingAddress ? (
                        <div>
                          <div className="text-gray-800 text-sm">{item.customer.shippingAddress.address}</div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {item.customer.shippingAddress.city}, {item.customer.shippingAddress.state} – {item.customer.shippingAddress.pinCode}
                          </div>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      {item.quantity}
                    </td>
                    <td className="p-4 border-b border-gray-200 text-center">
                      {item.size}
                    </td>
                    {/* <td className="p-4 border-b border-gray-200 text-center">
                      ₹{item?.productDetails?.price}
                    </td> */}
                    <td className="p-4 border-b border-gray-200 text-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(item)}
                          className="bg-green-800 text-white rounded-md px-4 py-2 hover:bg-green-700 transition-all duration-300"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCancelled(item.subOrderId)}
                          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No shipped orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {shippedData && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 mx-1 ${
                  currentPage === i + 1
                    ? "bg-customPurple text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } rounded-lg transition-all duration-300`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <h2 className="text-xl font-semibold mb-4">
              Product Details for {selectedProduct?.subOrderId}
            </h2>
            <div className="flex flex-col md:flex-row">
              <img
                src={selectedProduct?.productDetails?.productImage}
                alt={selectedProduct?.productDetails?.productName}
                className="w-48 h-48 object-cover rounded-lg mr-6"
              />
              <div>
                <p className="font-semibold text-gray-800 mb-2">
                  {selectedProduct?.productDetails?.productName}
                </p>
                {/* <p className="text-gray-700 mb-2">
                  Price: ₹{selectedProduct?.productDetails?.price}
                </p> */}
                <p className="text-gray-700 mb-2">
                  Quantity: {selectedProduct?.quantity}
                </p>
                <p className="text-gray-700 mb-2">Size: {selectedProduct?.size}</p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Shipped;
