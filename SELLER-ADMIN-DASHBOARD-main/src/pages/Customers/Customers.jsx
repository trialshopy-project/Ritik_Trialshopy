import Topbar from "../../layouts/Topbar";
import React, { useState, useEffect, useContext } from "react";

import { HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Sidebar from "../../layouts/sidebar";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";
import { UserContext } from "../../components/context/UserContext";

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
  if (index % 2 !== 0) {
    return "bg-white";
  }
}

// Dummy Values
const Customers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [originalDataFilter, setOriginalDataFilter] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/customers`
      );
      console.log(response.data, "customer");
      setData(response.data.customer);
      setOriginalData(response.data.customer);
      setOriginalDataFilter(response.data.customer);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

  console.log(data, "dd");

  let sellerData = [];

  if (data) {
    data.map((item) => {
      if (item.sellerId === sellerId) {
        sellerData.push(item);
      }
    });
  }

  // Pagination
  const reverseData = [...sellerData].reverse();
  const totalPages = Math.ceil(reverseData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, reverseData.length);
  const currentData = reverseData.slice(startIndex, endIndex);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleStatusToggle = () => {
    setShowStatus(!showStatus);
  };

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleFilterSubmit = () => {
    // Apply filter logic here
    if (showFilter) {
      const filteredData = originalDataFilter.filter((d) => {
        return (
          selectedStatus === "" ||
          d.status.toLowerCase() === selectedStatus.toLowerCase()
        );
      });
      setData(filteredData);
      setShowFilter(false);
    } else {
      setData(originalDataFilter);
      setShowFilter(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/customers/${id}`
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

  const handleSearch = () => {
    if (searchText !== "") {
      const newSearchFilterData = originalData.filter((item) => {
        const nameMatch = item?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const emailMatch = item?.email
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        return nameMatch || emailMatch;
      });
      setData(newSearchFilterData);
    } else {
      setData(originalData);
    }
  };

  return (
    <div className="flex w-screen  lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />
      <div className="lg:w-full md:ml-20 md:w-full lg:ml-2  md:mr-4 sm:mr-8 mt-8">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-14">
          <div className="flex items-stretch m-4 focus:bg-gray-900 ">
            <input
              type="text"
              placeholder="Search name or email"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch();
              }}
              className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-gray-900 shadow-2xl"
            />
            <button
              onClick={handleSearch}
              className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
            >
              <ion-icon name="search-outline" className="text-white"></ion-icon>
            </button>
          </div>

          {/* Add customer & filter */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch m-4"
              onClick={() => {
                navigate("addCustomers");
              }}
            >
              <button className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none">
                <AiOutlinePlus className="mr-1" />
                Add Customers
              </button>
            </div>

            {/* Filter */}
            <div className="flex">
              <div className="relative flex items-stretch my-4 focus:bg-gray-900">
                <button
                  className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none"
                  onClick={handleFilterToggle}
                >
                  <ion-icon
                    name="filter-outline"
                    className="text-white"
                  ></ion-icon>
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Filter Dropdown  */}
        {showFilter && (
          <div className="absolute mt-16 right-4 top-16 w-60 bg-white rounded-md shadow-md">
            <div>
              <div
                className="flex items-center justify-between p-1"
                onClick={handleStatusToggle}
              >
                <label className="p-2 text-gray-800 font-normal">
                  Select Status
                </label>
                {showStatus ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdOutlineKeyboardArrowDown />
                )}
              </div>
              <hr className="h-px bg-black" />
              {showStatus && (
                <div className="text-gray-700 mb-3">
                  <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                    <label htmlFor="active" className="ml-2">
                      Active
                    </label>
                    <input
                      className="rounded-full text-black"
                      type="checkbox"
                      id="active"
                      name="status"
                      value="active"
                      checked={selectedStatus === "active"}
                      onChange={() => handleStatusChange("active")}
                    />
                  </div>
                  <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                    <label htmlFor="inactive" className="ml-2">
                      Deactive
                    </label>
                    <input
                      className="rounded-full text-black"
                      type="checkbox"
                      id="inactive"
                      name="status"
                      value="inactive"
                      checked={selectedStatus === "inactive"}
                      onChange={() => handleStatusChange("inactive")}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center mb-2 mt-3">
                <button
                  className="bg-customPurple text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
                  onClick={handleFilterSubmit}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Table */}
        <div className="rounded-lg shadow sm:w-full sm:mr-12 overflow-x-auto">
          <div className="flex flex-row gap-4 w-full">
            <div className="px-4 pb-4 rounded-sm sm:gap-x-4 border border-gray-200 flex-1">
              <div className="border-x border-gray-200 sm:w-full rounded-sm overflow-x-auto">
                <table className="w-full sm:text-[20]">
                  <thead>
                    <tr className="bg-white border-b-2">
                      <th className="mytable">S. No.</th>
                      <th>
                        <div className="flex items-center">
                          Customer Id
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => {
                              sorting("customer_id");
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center">
                          Customer Name
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => {
                              sorting("customer_name");
                            }}
                          />
                        </div>
                      </th>

                      <th className="lg:pr-64 sm:pr-54 md:pr-64">E-Mail</th>
                      {/* <th>
                      <div className="flex items-center">
                        Date
                        <FaSort
                          className="ml-2 hover:cursor-pointer"
                          onClick={() => {
                            sorting("date");
                          }}
                        />
                      </div>
                    </th> */}
                      {/* <th>Amount</th> */}
                      <th className="w-24">
                        <div className="flex items-center sm:pl-6 justify-between">
                          Status
                          <FaSort
                            className="hover:cursor-pointer"
                            onClick={() => {
                              sorting("status");
                            }}
                          />
                        </div>
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {data.length > 0 ? (
                    <>
                      {" "}
                      <tbody>
                        {currentData.map((d, index) => (
                          <tr
                            key={startIndex + d.id}
                            className={alternate(startIndex + index + 1)}
                          >
                            <td className="mytable">
                              {startIndex + index + 1}
                            </td>

                            <td>{d._id}</td>

                            <td>{d.name}</td>
                            <td className="pl-4">{d.email}</td>
                            {/* <td>{new Date(d.date).toLocaleDateString()}</td> */}
                            {/* <td className="pl-1">{d.amount}</td> */}
                            <td>{getOrderStatus(d.status)}</td>
                            <td className="px-2">
                              <div className="flex justify-center">
                                {/* <HiPencil
                                  className="fill-gray-800 mr-2 hover:cursor-pointer"
                                  onClick={() => {
                                    navigate("#");
                                  }}
                                /> */}
                                <HiTrash
                                  className="fill-red-500 cursor-pointer"
                                  onClick={handleDelete}
                                />
                                {showConfirmation && (
                                  <Popup
                                    message="Are you sure you want to delete this Category?"
                                    onConfirm={() =>
                                      handleDeleteCustomer(d._id)
                                    }
                                    onCancel={cancelDelete}
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  ) : (
                    <p> DATA NOT FOUND</p>
                  )}
                </table>
              </div>
            </div>
          </div>
          {/* Pagination */}
          {data.length > 0 && (
            <div className="flex justify-between items-center ml-4 mr-4 mb-10">
              <div className="font-semibold">
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)}{" "}
                entries
              </div>
              <div className="flex">
                {/* Previous Page Button */}
                <button
                  className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
                  onClick={() =>
                    handlePageChange(
                      currentPage === 1 ? totalPages : currentPage - 1
                    )
                  }
                >
                  &lt;
                </button>
                {/* Page Number Button */}
                <button className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700">
                  Page {currentPage} of {totalPages}
                </button>
                {/* Next Page Button */}
                <button
                  className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700"
                  onClick={() =>
                    handlePageChange(
                      currentPage === totalPages ? 1 : currentPage + 1
                    )
                  }
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
