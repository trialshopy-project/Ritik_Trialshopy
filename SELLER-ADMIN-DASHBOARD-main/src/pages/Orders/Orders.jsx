
import React, { useContext, useEffect, useState } from "react";

import { HiEye, HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import axios from "axios";
import toast from "react-hot-toast";
import Topbar from "../../layouts/Topbar";
import Sidebar from "../../layouts/sidebar";
import Popup from "../../components/common/Popup";
import { UserContext } from "../../components/context/UserContext";

// Function to style the order status
function getOrderStatus(status) {
  switch (status) {
    case "delivered":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500">
          {status}
        </span>
      );
    case "pending":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-red-500 bg-red-100 border border-red-500">
          {status}
        </span>
      );
    case "shipped":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-[#F19305] bg-red-100 border border-[#F19305]-500">
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
const Orders = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [originalDataFilter, setOriginalDataFilter] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  console.log(data);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/order/list`
      );
      console.log(response.data, "orders");
      setData(response.data.orders);
      setOriginalData(response.data.orders);
      setOriginalDataFilter(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      if (item.userId === sellerId) {
        sellerData.push(item);
      }
    });
  }

  // Pagination
  const totalPages = Math.ceil(sellerData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sellerData.length);
  const reversedCurrentData = [...sellerData].reverse();
  const currentData = reversedCurrentData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // const [showCalendar, setShowCalendar] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // const handleCalendarToggle = () => {
  //   setShowCalendar(!showCalendar);
  // };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleStatusToggle = () => {
    setShowStatus(!showStatus);
  };

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleFilterSubmit = () => {
    if (showFilter) {
      const filteredData = originalDataFilter.filter((d) => {
        const statusMatches =
          selectedStatus === "" ||
          d.status.toLowerCase() === selectedStatus.toLowerCase();
        const dateMatches =
          selectedDate === "" ||
          new Date(d.orderDate).toLocaleDateString() ===
            new Date(selectedDate).toLocaleDateString();

        return statusMatches && dateMatches;
      });
      setData(filteredData);
      setShowFilter(false);
    } else {
      setData(originalDataFilter);
      setShowFilter(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/order/${id}`
      );

      if (response?.data?.success === true) {
        fetchData();
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
    setShowFilter(false);
  };

  const handleSearch = () => {
    if (searchText !== "") {
      const newSearchFilterData = originalData.filter((item) => {
        const nameMatch = item?.userId?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const emailMatch = item?.userId?.email
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        return nameMatch || emailMatch;
      });
      setData(newSearchFilterData);
    } else {
      setData(originalData);
    }
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="flex w-screen  lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />

      <div className="flex flex-col w-3/4 lg:w-full ml-0 lg:ml-0 md:ml-12  lg:mt-2 md:mt-2">
        <div className="flex flex-col md:flex-row sm:px-6 ml-0 lg:ml-0 mt-20">
          {/* Search */}
          <div className="flex  items-stretch m-4 focus:bg-gray-900">
            <input
              type="text"
              placeholder="Search Customer Name or Email Id"
              value={searchText}
              className=" px-2 sm:px-4 sm:py-2   w-5/6 py-1 rounded-l-md focus:outline-none"
              required
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-customPurple text-white font-boldpy-2 px-4 rounded-r-md focus:outline-none"
            >
              <ion-icon name="search-outline" className="text-white"></ion-icon>
            </button>
          </div>
          {/* Filter */}
          <div className="flex items-stretch m-4">
            <button
              className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none"
              onClick={handleFilterToggle}
            >
              <ion-icon name="filter-outline" className="text-white"></ion-icon>
              Filter
            </button>
          </div>
        </div>
        {/* Filter Dropdown */}
        {showFilter && (
          <div className="absolute mt-28 right-4 md:right-auto top-16 w-full sm:w-60 bg-white rounded-md shadow-md">
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
                <div className="text-gray-700 mb-2">
                  {["delivered", "pending", "processing", "shipped"].map(
                    (status) => (
                      <div
                        className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm"
                        key={status}
                      >
                        <label htmlFor={status} className="ml-2">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </label>
                        <input
                          className="rounded-full text-black"
                          type="checkbox"
                          id={status}
                          name="status"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={() => handleStatusChange(status)}
                        />
                      </div>
                    )
                  )}
                </div>
              )}
              <div
                className="flex items-center justify-between pt-1 pb-2 px-1"
                // onClick={handleCalendarToggle}
              >
                <label className="px-2 text-gray-800 font-normal hover:cursor-pointer">
                  By Date
                </label>
                {/* {showCalendar ? (
                  <MdOutlineKeyboardArrowUp />
                ) : (
                  <MdOutlineKeyboardArrowDown />
                )} */}
              </div>
              <div>
                {/* {showCalendar && (
                  <div className="relative">
                    <Calendar
                      onChange={handleDateChange}
                      value={selectedDate}
                    />
                  </div>
                )} */}
              </div>
              <div className="flex justify-center mb-2">
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
        <div className=" mt-5 ">
          <div>
            <table className="w-screen lg:w-full   overflow-x-scroll  overflow-y-auto border-collapse">
              <thead className="">
                <tr className="bg-white border-b-2">
                  <th className="py-2 px-4">S. No.</th>
                  <th className="py-2 px-4">
                    <div className="flex items-center cursor-pointer">
                      Order No.
                      <FaSort
                        className="ml-2 hover:cursor-pointer"
                        onClick={() => sorting("order_no")}
                      />
                    </div>
                  </th>
                  <th className="py-2 px-4 ">
                    <div className="flex items-center cursor-pointer">
                      Name
                      <FaSort
                        className="ml-2 hover:cursor-pointer"
                        onClick={() => sorting("customer_name")}
                      />
                    </div>
                  </th>
                  <th className="py-2 px-4">E-Mail</th>
                  <th className="py-2 px-4">
                    <div className="flex items-center justify-between cursor-pointer">
                      Date
                      <FaSort
                        className="hover:cursor-pointer"
                        onClick={() => sorting("date")}
                      />
                    </div>
                  </th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4 w-24">
                    <div className="flex items-center justify-between cursor-pointer">
                      Status
                      <FaSort
                        className="hover:cursor-pointer"
                        onClick={() => sorting("status")}
                      />
                    </div>
                  </th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {sellerData.length > 0 ? (
                  currentData.map((d, index) => (
                    <tr
                      key={startIndex + index}
                      className={alternate(startIndex + index + 1)}
                    >
                      <td className="py-2 px-4">{startIndex + index + 1}</td>
                      <td className="py-2 px-4">{d._id}</td>
                      <td className="py-2 px-4 ">{d.userId?.name || "NA"}</td>
                      <td className="py-2 px-4">{d.userId?.email || "NA"}</td>
                      <td className="py-2 px-4">
                        {new Date(d.orderDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">{d.totalPrice}</td>
                      <td className="py-2 px-4">{getOrderStatus(d.status)}</td>
                      <td className="py-2 px-4">
                        <div className="flex justify-center">
                          <HiEye
                            className="mr-1 hover:cursor-pointer"
                            onClick={() => navigate("Details")}
                          />
                          {/* <HiPencil
                            className="mr-1 hover:cursor-pointer"
                            onClick={() => navigate("#")}
                          /> */}
                          <HiTrash
                            className="fill-red-500 cursor-pointer"
                            onClick={handleDelete}
                          />
                          {showConfirmation && (
                            <Popup
                              message="Are you sure you want to delete this order?"
                              onConfirm={() => handleDeleteOrder(d._id)}
                              onCancel={cancelDelete}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 text-center" colSpan="8">
                      DATA NOT FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
