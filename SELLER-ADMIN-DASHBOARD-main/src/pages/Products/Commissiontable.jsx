import React, { useState } from "react";
import { HiTrash, HiPencil } from "react-icons/hi";
import { FaSort } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";
import { Navigate, useNavigate } from "react-router-dom";

// Function to style the order status
function getOrderStatus(status) {
  switch (status) {
    case "active":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500">
          {status}
        </span>
      );
    case "inactive":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-red-500 bg-red-100 border border-red-500">
          {status}
        </span>
      );
    default:
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-md text-xs font-bold text-gray-600 bg-gray-100">
          {status.replaceAll("_", " ").toLowerCase()}
        </span>
      );
  }
}

// Function for alternate gray and white
function alternate(index) {
  if (index % 2 !== 0) return "bg-white";
}

const Commisiontable = ({ data }) => {
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Sort Column
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };

  // Pagination
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data?.length);
  const currentData = data?.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleCommissionDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/commissions/products/${id}`
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        fetchData();
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
    setShowConfirmation(false);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      {/* Table */}
      <div className="flex flex-col gap-4 w-full p-4">
  <div className="flex flex-row gap-4 lg:w-full  w-screen overflow-x-scroll">
    <div className="px-4 pb-4 rounded-sm border border-gray-200 flex-1">
      <div className="border-x border-gray-200 rounded-sm w-full">
        <table className="w-full">
          <thead>
            <tr className="font-bold bg-white border-b-2">
              <th className="py-2 px-4 text-left">S. No.</th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  Product ID
                  <FaSort
                    className="ml-1 hover:cursor-pointer"
                    onClick={() => sorting("product_id")}
                  />
                </div>
              </th>
              <th className="py-2 px-4 text-left">
                <div className="flex items-center">
                  Product Name
                  <FaSort
                    className="ml-1 hover:cursor-pointer"
                    onClick={() => sorting("product_name")}
                  />
                </div>
              </th>
              <th className="py-2 px-4 text-left">Commission</th>
              <th className="py-2 px-4 text-left">Dated From</th>
              <th className="py-2 px-4 text-left">Dated To</th>
              <th className="py-2 px-4 text-left w-24">
                <div className="flex items-center justify-between">
                  Status
                  <FaSort
                    className="hover:cursor-pointer"
                    onClick={() => sorting("status")}
                  />
                </div>
              </th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {currentData.map((d, index) => (
                <tr key={startIndex + d._id} className={alternate(startIndex + index + 1)}>
                  <td className="py-2 px-4">{startIndex + index + 1}</td>
                  <td className="py-2 px-4">{d?.productId?._id}</td>
                  <td className="py-2 px-4">
                    {d?.productId?.productName ? d?.productId?.productName : "NA"}
                  </td>
                  <td className="py-2 px-4">{d.commission}</td>
                  <td className="py-2 px-4">
                    {d.datedFrom ? new Date(d.datedFrom).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {d.datedTo ? new Date(d.datedTo).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-4">{getOrderStatus(d.status)}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center">
                      <HiPencil
                        onClick={() =>
                          navigate(`/editcommission?commissionId=${encodeURIComponent(d._id)}`)
                        }
                        className="fill-gray-800 mr-2 hover:cursor-pointer"
                      />
                      <HiTrash
                        className="fill-red-500 cursor-pointer"
                        onClick={handleDelete}
                      />
                      {showConfirmation && (
                        <Popup
                          message="Are you sure you want to delete this Category?"
                          onConfirm={() => handleCommissionDelete(d._id)}
                          onCancel={cancelDelete}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="8" className="py-4 text-center">
                  DATA NOT FOUND
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  </div>
  {data.length > 0 && (
    <div className="flex flex-col md:flex-row justify-between items-center p-4">
      <div className="font-semibold mb-2 md:mb-0">
        Showing {startIndex + 1}-{Math.min(endIndex, data.length)} entries
      </div>
      <div className="flex">
        <button
          className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
          onClick={() => handlePageChange(currentPage === 1 ? totalPages : currentPage - 1)}
        >
          &lt;
        </button>
        <button className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700">
          Page {currentPage} of {totalPages}
        </button>
        <button
          className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
          onClick={() => handlePageChange(currentPage === totalPages ? 1 : currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  )}
</div>

    </div>
  );
};

export default Commisiontable;
