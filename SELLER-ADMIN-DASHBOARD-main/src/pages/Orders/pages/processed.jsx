import React from 'react';
import Navbar from '../Components/Navbar.jsx';
import Header from '../../../layouts/Topbar.jsx';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../../../components/context/UserContext.jsx';
import toast from 'react-hot-toast';
const Processed = () => {
  const [authenticated] = useContext(UserContext);
  const seller_id = authenticated.user.storeId;
  const [processedData, setProcessedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/processed/${seller_id}?page=${currentPage}&limit=${resultsPerPage}`
      );
      setProcessedData(response.data.orders);
    } catch (e) {
      console.log(e);
    }
  };

  //handle accept --------------------------------------------

  const handleAccept = async (subOrderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/ship/${subOrderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'shipped' }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Order status updated to shipped:', result);
        toast.success('Order shipped Successfully!')
        fetchData();
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      toast.error('Error Occured')
      console.error('Error:', error);
    }
  };



  const handleCancelled = async (subOrderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/cancel/${subOrderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'cancelled' }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Order status updated:', result);
        toast.success('Order cancelled Successfully')
        fetchData();
      } else {
        toast.error('Please try again')
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      toast.success('There was an error occured!')
      console.error('Error:', error);
    }
  };

  const totalPages = Math.ceil(processedData?.totalCount / resultsPerPage);

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

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-customPurple text-white">
                <th className="p-4 text-left border-b border-gray-200">Product Details</th>
                <th className="p-4 text-left border-b border-gray-200">Order ID</th>
                <th className="p-4 text-left border-b border-gray-200">Sub-order ID</th>
                <th className="p-4 text-left border-b border-gray-200">Customer Name</th>
                <th className="p-4 text-left border-b border-gray-200">Phone Number</th>
                <th className="p-4 text-left border-b border-gray-200">Delivery Address</th>
                <th className="p-4 text-left border-b border-gray-200">Quantity</th>
                <th className="p-4 text-left border-b border-gray-200">Size</th>
                {/* <th className="p-4 text-left border-b border-gray-200">Price</th> */}
                <th className="p-4 text-left border-b border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {processedData && processedData.length > 0 ? (
                processedData.map((item, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <img
                          // src={item.productDetails.images?.[0]?.url}
                          src={item?.productDetails?.productImage}
                          alt={item.productDetails.productName}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {item?.productDetails?.productName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-200">{item.orderId}</td>
                    <td className="p-4 border-b border-gray-200">{item.subOrderId}</td>
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
                    <td className="p-4 border-b border-gray-200">{item.quantity}</td>
                    <td className="p-4 border-b border-gray-200">{item.size}</td>
                    {/* <td className="p-4 border-b border-gray-200">{item?.productDetails?.price}</td> */}
                    <td className="p-4 border-b border-gray-200">
                      <div className="flex space-x-2">
                        <button className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600 transition-all duration-300" onClick={()=>handleAccept(item.subOrderId)}>
                          Ship
                        </button>
                        {/* <button className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-all duration-300" onClick={() => handleCancelled(item.subOrderId)}>
                          Cancel
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-4 text-center text-gray-500">
                    No processed orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {processedData && (
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
                    ? 'bg-customPurple text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
    </>
  );
}

export default Processed;