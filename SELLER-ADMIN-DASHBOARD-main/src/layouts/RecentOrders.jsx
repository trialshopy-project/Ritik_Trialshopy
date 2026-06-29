import React, { useState } from "react";
import { HiEye } from "react-icons/hi";
import { FaSort } from "react-icons/fa";

// Function to style the order status
function getOrderStatus(status) {
  switch (status?.toLowerCase()) {
    case "delivered":
      return (
        <span className="flex justify-center items-center capitalize rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500 py-1 px-2">
          {status}
        </span>
      );
    case "cancelled":
      return (
        <span className="flex justify-center items-center capitalize rounded-full text-xs font-bold text-red-500 bg-red-100 border border-red-500 py-1 px-2">
          {status}
        </span>
      );
    case "shipped":
      return (
        <span className="flex justify-center items-center capitalize rounded-full text-xs font-bold text-blue-500 bg-blue-100 border border-blue-500 py-1 px-2">
          {status}
        </span>
      );
    case "processing":
      return (
        <span className="flex justify-center items-center capitalize rounded-full text-xs font-bold text-purple-500 bg-purple-100 border border-purple-500 py-1 px-2">
          {status}
        </span>
      );
    case "pending":
    default:
      return (
        <span className="flex justify-center items-center capitalize rounded-full text-xs font-bold text-yellow-600 bg-yellow-100 border border-yellow-500 py-1 px-2">
          {status || 'Unknown'}
        </span>
      );
  }
}

// Function for alternate gray and white
function alternate(index) {
  if (index % 2 !== 0) {
    return "bg-gray-50";
  }
  return "bg-white";
}

const RecentOrders = ({ data, loading }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedData, setSortedData] = useState([]);
  
  // Update sorted data when props change
  React.useEffect(() => {
    setSortedData(data || []);
  }, [data]);

  const itemsPerPage = 10;

  const togglePopup = () => {
    setShowPopup(true);
  };

  // Sort Column
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...sortedData].sort((a, b) => {
        const valA = String(a[col] || "").toLowerCase();
        const valB = String(b[col] || "").toLowerCase();
        return valA > valB ? 1 : -1;
      });
      setSortedData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...sortedData].sort((a, b) => {
        const valA = String(a[col] || "").toLowerCase();
        const valB = String(b[col] || "").toLowerCase();
        return valA < valB ? 1 : -1;
      });
      setSortedData(sorted);
      setOrder("ASC");
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="rounded-lg shadow lg:w-full bg-white">
        <div className="flex flex-row w-full">
          <div className="pb-4 rounded-sm border border-gray-200 flex-1">
            <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 text-sm text-gray-700">
                    <th className="p-3 font-semibold">S. No.</th>
                    <th className="p-3 font-semibold">
                      <div className="flex items-center">
                        Order No.
                        <FaSort
                          className="ml-2 hover:cursor-pointer text-gray-400"
                          onClick={() => sorting("orderId")}
                        />
                      </div>
                    </th>
                    <th className="p-3 font-semibold">
                      <div className="flex items-center">
                        Customer Name
                        <FaSort
                          className="ml-2 hover:cursor-pointer text-gray-400"
                          onClick={() => sorting("customerName")}
                        />
                      </div>
                    </th>
                    <th className="p-3 font-semibold">E-Mail</th>
                    <th className="p-3 font-semibold">Address</th>
                    <th className="p-3 font-semibold">
                      <div className="flex items-center justify-between">
                        Date
                        <FaSort
                          className="hover:cursor-pointer text-gray-400"
                          onClick={() => sorting("orderDate")}
                        />
                      </div>
                    </th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold">
                      <div className="flex items-center justify-between">
                        Status
                        <FaSort
                          className="hover:cursor-pointer text-gray-400"
                          onClick={() => sorting("status")}
                        />
                      </div>
                    </th>
                    <th className="p-3 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-gray-500 animate-pulse">
                        Loading orders...
                      </td>
                    </tr>
                  ) : currentData.length > 0 ? (
                    currentData.map((d, index) => (
                      <tr
                        key={d._id || index}
                        className={`border-b border-gray-100 ${alternate(startIndex + index)} hover:bg-gray-50`}
                      >
                        <td className="p-3">{startIndex + index + 1}</td>
                        <td className="p-3 text-blue-600 font-medium truncate max-w-[120px]" title={d.orderId}>
                          {d.orderId}
                        </td>
                        <td className="p-3 font-medium text-gray-800">{d.customerName}</td>
                        <td className="p-3 text-gray-600 truncate max-w-[150px]" title={d.email}>
                          {d.email}
                        </td>
                        <td className="p-3 text-gray-600 truncate max-w-[200px]" title={d.shippingAddress ? `${d.shippingAddress.address}, ${d.shippingAddress.city}, ${d.shippingAddress.state}` : "N/A"}>
                          {d.shippingAddress 
                            ? `${d.shippingAddress.city || ''}, ${d.shippingAddress.state || ''}`.replace(/^, | , |, $/g, '') 
                            : "N/A"}
                        </td>
                        <td className="p-3 text-gray-600 whitespace-nowrap">
                          {d.orderDate ? new Date(d.orderDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 font-semibold">₹{d.totalPrice?.toLocaleString('en-IN') || 0}</td>
                        <td className="p-3">{getOrderStatus(d.status)}</td>
                        <td className="p-3">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={togglePopup}
                              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                              title="View Order Details"
                            >
                              <HiEye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="p-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Pagination */}
        {!loading && sortedData.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-gray-200">
            <div className="font-semibold text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
            </div>
            <div className="flex text-sm">
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &lt;
              </button>
              <button className="mx-1 px-3 py-1 rounded bg-blue-50 text-blue-600 font-medium border border-blue-200">
                Page {currentPage} of {totalPages}
              </button>
              <button
                className="mx-1 px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecentOrders;
