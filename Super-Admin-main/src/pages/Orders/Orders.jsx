import React, { useEffect, useState } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { HiEye, HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./modal";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      localStorage.setItem("orders",response.data);
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

  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const reversedCurrentData = [...data].reverse();
  const currentData = reversedCurrentData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
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

  return (
    <>
      <Topbar2 />
      <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-20">
        {/* Search */}
        <div className="flex items-stretch m-4 focus:bg-gray-900 ">
          <input
            type="text"
            placeholder="Search Customer Name or Email Id"
            value={searchText}
            required
            onChange={(e) => {
              setSearchText(e.target.value);
              handleSearch();
            }}
            className="sm:px-4 px-2 sm:py-2 w-80 py-0 rounded-l-md focus:outline-gray-900 shadow-2xl"
          />
          <button
            onClick={handleSearch}
            className="bg-customGray text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
          >
            <ion-icon name="search-outline" className="text-white"></ion-icon>
          </button>
        </div>
        {/* Filter */}
        <div className="flex mr-4">
          <div className="relative flex items-stretch my-4 focus:bg-gray-900">
            <button
              className="flex bg-customGray text-white items-center px-4 rounded-md focus:outline-none"
              onClick={handleFilterToggle}
            >
              <ion-icon name="filter-outline" className="text-white"></ion-icon>
              Filter
            </button>
          </div>
        </div>
      </div>
      {/* Filter Dropdown  */}
      {showFilter && (
        <div className="absolute mt-28 right-4 top-16 w-60 bg-white rounded-md shadow-md">
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
                <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                  <label htmlFor="delivered" className="ml-2">
                    Delivered
                  </label>
                  <input
                    className="rounded-full text-black"
                    type="checkbox"
                    id="delivered"
                    name="status"
                    value="delivered"
                    checked={selectedStatus === "delivered"}
                    onChange={() => handleStatusChange("delivered")}
                  />
                </div>
                <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                  <label htmlFor="pending" className="ml-2">
                    Pending
                  </label>
                  <input
                    className="rounded-full text-black"
                    type="checkbox"
                    id="pending"
                    name="status"
                    value="pending"
                    checked={selectedStatus === "pending"}
                    onChange={() => handleStatusChange("pending")}
                  />
                </div>
                <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                  <label htmlFor="processing" className="ml-2">
                    Processing
                  </label>
                  <input
                    className="rounded-full text-black"
                    type="checkbox"
                    id="processing"
                    name="status"
                    value="processing"
                    checked={selectedStatus === "processing"}
                    onChange={() => handleStatusChange("processing")}
                  />
                </div>{" "}
                <div className="flex my-2 items-center pt-1 pb-2 px-1 justify-between border-b border-black text-sm">
                  <label htmlFor="shipped" className="ml-2">
                    Shipped
                  </label>
                  <input
                    className="rounded-full text-black"
                    type="checkbox"
                    id="pending"
                    name="status"
                    value="shipped"
                    checked={selectedStatus === "shipped"}
                    onChange={() => handleStatusChange("shipped")}
                  />
                </div>
              </div>
            )}
            <div
              className="flex items-center justify-between pt-1 pb-2 px-1"
              onClick={handleCalendarToggle}
            >
              <label className="px-2 text-gray-800 font-normal hover:cursor-pointer">
                By Date
              </label>
              {showCalendar ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdOutlineKeyboardArrowDown />
              )}
            </div>
            <div>
              {showCalendar && (
                <div className="relative">
                  <Calendar onChange={handleDateChange} value={selectedDate} />
                </div>
              )}
            </div>
            <div className="flex justify-center mb-2">
              <button
                className="bg-customGray text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
                onClick={handleFilterSubmit}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg shadow overflow-x-auto">
        <div className="flex flex-row gap-4 w-full">
          <div className="px-4 pb-4 rounded-sm border border-gray-200 flex-1">
            <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b-2">
                    <th className="mytable">S. No.</th>
                    <th>
                      <div className="flex items-center">
                        Order No.
                        <FaSort
                          className="ml-2 hover:cursor-pointer"
                          onClick={() => {
                            sorting("_id");
                          }}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center">
                        Store Details
                        <FaSort
                          className="ml-2 hover:cursor-pointer"
                        />
                      </div>
                    </th>
                    <th>
                      <div className="flex items-center">
                        Customer Details
                        <FaSort
                          className="ml-2 hover:cursor-pointer"
                          onClick={() => {
                            sorting("customerName");
                          }}
                        />
                      </div>
                    </th>

                    <th>
                      <div className="flex items-center justify-between">
                        Date
                        <FaSort
                          className="hover:cursor-pointer"
                          onClick={() => {
                            sorting("orderDate");
                          }}
                        />
                      </div>
                    </th>
                    <th>Amount</th>
                    <th className="w-24">
                      <div className="flex items-center justify-between">
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
                          key={startIndex + d._id}
                          className={alternate(startIndex + index + 1)}
                        >
                          <td className="mytable">{startIndex + index + 1}</td>

                          <td className="text-xs">{d._id}</td>
                          
                          <td className="text-xs">
                            <div className="flex flex-col">
                              <span className="font-bold">{d.storeInfo?.storeName || "N/A"}</span>
                              <span className="text-gray-500 text-[10px]">ID: {d.storeInfo?.storeId || "N/A"}</span>
                            </div>
                          </td>

                          <td className="text-xs">
                            <div className="flex flex-col">
                              <span className="font-bold">{d.customerName}</span>
                              <span className="text-gray-500">{d.email}</span>
                              <span className="text-gray-400 text-[10px]">
                                {d.shippingAddress ? `${d.shippingAddress.address}, ${d.shippingAddress.city}, ${d.shippingAddress.state} - ${d.shippingAddress.pinCode}` : "Address N/A"}
                              </span>
                            </div>
                          </td>

                          <td className="text-xs">{new Date(d.orderDate).toLocaleDateString()}</td>
                          <td className="px-1 text-xs">₹{d.totalPrice}</td>
                          <td>{getOrderStatus(d.status)}</td>
                          <td className="px-1">
                            <div className="flex justify-center">
                              <HiEye
                                name="eye-fill"
                                className="mr-1 hover:cursor-pointer"
                                // onClick={() => {
                                //   navigate("Details");
                                // }}
                                onClick={() => setIsModalOpen(true)}
                              ></HiEye>
                              <Modal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                orderDetails={d}
                              />
                              {/* <HiPencil
                                className="fill-gray-800 mr-1 hover:cursor-pointer"
                                onClick={() => {
                                  navigate("#");
                                }}
                              /> */}
                              <HiTrash
                                className="fill-red-500 cursor-pointer"
                                onClick={() => handleDeleteOrder(d._id)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <p className="flex items-center justify-center">
                    DATA NOT FOUND
                  </p>
                )}
              </table>
            </div>
          </div>
        </div>
        {/* Pagination */}
        {data.length > 0 && (
          <div className="flex justify-between items-center ml-4 mr-4 mb-10">
            <div className="font-semibold">
              Showing {startIndex + 1}-{Math.min(endIndex, data.length)} entries
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
    </>
  );
};

export default Orders;
