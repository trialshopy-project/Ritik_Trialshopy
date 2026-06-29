import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../Components/Navbar.jsx';
import Header from '../../../layouts/Topbar.jsx';
import axios from 'axios';
import { UserContext } from '../../../components/context/UserContext.jsx';
import toast from 'react-hot-toast';
const Pending = () => {
  const [authenticated] = useContext(UserContext);
  const seller_id = authenticated.user?._id || authenticated.user?.storeId;
  console.log('[Pending] seller_id being used:', seller_id, '| full user:', authenticated.user);
  const [pendingData, setPendingData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    if (seller_id) {
      fetchData();
    }
  }, [currentPage, seller_id]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/pending/${seller_id}?page=${currentPage}&limit=${resultsPerPage}`
      );
      console.log('Pending orders response:', response.data);
      console.log('Seller ID used:', seller_id);
      setPendingData(response.data.orders || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (e) {
      console.error('Error fetching pending orders:', e?.response?.data || e);
    }
  };

  const totalPages = Math.ceil(totalCount / resultsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      toast.success('There was an error occured!')
      console.error('Error:', error);
    }
  };

  const handleAccept = async (subOrderId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/process/${subOrderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'processed' }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Order status updated to processed:', result);
        toast.success('Order Accepted Successfully!')
        fetchData();
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      toast.error('Error Occured')
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      {
        console.log(pendingData)
      }

      <div className="container mx-auto p-4">
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

        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full bg-gray-100 border-collapse border border-gray-200">
            <thead className="bg-gray-200 text-gray-700">
              <tr className='bg-customPurple text-white'>
                <th className="p-3 text-left border-b border-gray-300">Product Details</th>
                <th className="p-3 text-left border-b border-gray-300">Order ID</th>
                <th className="p-3 text-left border-b border-gray-300">Sub-order ID</th>
                <th className="p-3 text-left border-b border-gray-300">Customer Name</th>
                <th className="p-3 text-left border-b border-gray-300">Phone Number</th>
                <th className="p-3 text-left border-b border-gray-300">Delivery Address</th>
                <th className="p-3 text-left border-b border-gray-300">Quantity</th>
                <th className="p-3 text-left border-b border-gray-300">Size</th>
                {/* <th className="p-3 text-left border-b border-gray-300">Price</th> */}
                <th className="p-3 text-left border-b border-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingData ? (
                pendingData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300">
                      <div className="flex items-center">
                        <img
                          src={item?.productDetails?.productImage}
                          alt={item?.productDetails?.productName}
                          className="w-12 h-12 object-cover mr-3"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{item?.productDetails?.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 border-b border-gray-300">{item.orderId}</td>
                    <td className="p-3 border-b border-gray-300">{item.subOrderId}</td>
                    <td className="p-3 border-b border-gray-300 font-medium text-gray-800">
                      {item?.customer?.name || 'N/A'}
                    </td>
                    <td className="p-3 border-b border-gray-300 text-gray-700">
                      {item?.customer?.phone || 'N/A'}
                    </td>
                    <td className="p-3 border-b border-gray-300">
                      {item?.customer?.shippingAddress ? (
                        <div>
                          <div className="text-gray-800 text-sm">{item.customer.shippingAddress.address}</div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {item.customer.shippingAddress.city}, {item.customer.shippingAddress.state} – {item.customer.shippingAddress.pinCode}
                          </div>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="p-3 border-b border-gray-300">{item.quantity}</td>
                    <td className="p-3 border-b border-gray-300">{item.size}</td>
                    {/* <td className="p-3 border-b border-gray-300">{item?.productDetails?.price}</td> */}
                    <td className="p-3 border-b border-gray-300">
                      <div className="flex space-x-2">
                        <button
                          className="bg-green-500 text-white rounded-md px-4 py-1 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                          onClick={() => handleAccept(item.subOrderId)}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white rounded-md px-4 py-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                          onClick={() => handleCancelled(item.subOrderId)}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-3 text-center text-gray-500">
                    No pending orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
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
              className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Pending;



