import React, { useState, useEffect } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import mock from "../../dummy_data.json";

//Function for alternate gray and white
function alternate(index) {
  if (index % 2 != 0) return "bg-white";
}

const Payments = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint URL
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/merchantPayment`
      );
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to fetch data from the API.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

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
    // Apply filter logic here
    const filteredData = mock.filter((d) => {
      return (
        (selectedStatus === "" ||
          d.status.toLowerCase() === selectedStatus.toLowerCase()) &&
        (selectedDate === "" ||
          new Date(d.date).toLocaleDateString() ===
            selectedDate.toLocaleDateString())
      );
    });
    setData(filteredData);
    setShowFilter(false);
  };

  return (
    <>
      <Topbar2 />
      <div className="flex flex-col md:flex-row md:justify-between">
        {/* Search */}
        <div className="flex items-stretch m-4 focus:bg-gray-900">
          <input
            type="text"
            placeholder="Search here..."
            className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-gray-900"
          />
          <button className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none">
            <ion-icon name="search-outline" className="text-white"></ion-icon>
          </button>
        </div>

        <div className="flex mr-4 ml-4">
          {/* Filter */}
          <div className="relative flex items-stretch my-4 focus:bg-gray-900">
            <button
              className="flex bg-gray-700 hover:bg-gray-900 text-white items-center px-4 rounded-md focus:outline-none"
              onClick={handleFilterToggle}
            >
              <ion-icon name="filter-outline" className="text-white"></ion-icon>
              Filter
            </button>
          </div>
        </div>
      </div>
      {/* Filter Dropdown */}
      {showFilter && (
        <div className="absolute mt-16 right-4 top-16 w-50 bg-white rounded-md shadow-md">
          <div className="p-2">
            <div
              className="flex items-center justify-between"
              onClick={handleStatusToggle}
            >
              <label className="p-2 text-gray-700 font-normal">
                Select Status
              </label>
              {showStatus ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdOutlineKeyboardArrowDown />
              )}
            </div>
            {showStatus && (
              <div className="form-radio text-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="active" className="ml-2">
                    Active
                  </label>
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    value="active"
                    checked={selectedStatus === "active"}
                    onChange={() => handleStatusChange("active")}
                  />
                </div>
                <u></u>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="deactive" className="ml-2">
                    Deactive
                  </label>
                  <input
                    type="radio"
                    id="deactive"
                    name="status"
                    value="deactivated"
                    checked={selectedStatus === "deactivated"}
                    onChange={() => handleStatusChange("deactivated")}
                  />
                </div>
              </div>
            )}
            <div
              className="flex items-center justify-between"
              onClick={handleCalendarToggle}
            >
              <label className="p-2 text-gray-700 font-normal hover:cursor-pointer">
                By Date
              </label>
              {showCalendar ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdOutlineKeyboardArrowDown />
              )}
            </div>
            <div className="mt-4">
              {showCalendar && (
                <div className="relative">
                  <Calendar onChange={handleDateChange} value={selectedDate} />
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
                onClick={handleFilterSubmit}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="px-4 pb-4 rounded-sm border border-gray-200 flex-1">
            <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="font-bold bg-white border-b-2">
                    <th className="merchant-table">S. No.</th>
                    <th className="merchant-table">
                      <div className="flex items-center">
                        Store ID
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("store_id");
                          }}
                        />
                      </div>
                    </th>
                    <th className="merchant-table">
                      <div className="flex items-center">
                        Merchant name
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("merchant_name");
                          }}
                        />
                      </div>
                    </th>
                    <th className="merchant-table">E-Mail</th>
                    <th className="merchant-table">Commission</th>
                    <th className="merchant-table">Total Items</th>
                    <th className="merchant-table">Balance</th>
                    <th className="merchant-table">Total Revenue</th>
                    <th className="merchant-table">Act</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((d, index) => (
                    <tr
                      key={startIndex + d.id}
                      className={alternate(startIndex + index + 1)}
                    >
                      <td className="merchant-table">
                        {startIndex + index + 1}
                      </td>
                      <td className="merchant-table">{d.store_id}</td>
                      <td className="merchant-table">{d.merchant_name}</td>
                      <td className="merchant-table">{d.email}</td>
                      <td className="merchant-table">{d.commission}</td>
                      <td className="merchant-table">{d.total_items}</td>
                      <td className="merchant-table">{d.balance}</td>
                      <td className="merchant-table">{d.total_revenue}</td>
                      <td className="merchant-table">
                        <div className="flex">
                          <HiPencil
                            className="fill-gray-800 mr-2 hover:cursor-pointer"
                            onClick={() => {
                              navigate("../Merchant/EditMerchant");
                            }}
                          />
                          <HiTrash className="fill-red-500 hover:cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center ml-4 mr-4 mb-10">
          <div className="font-semibold">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} entries
          </div>
          <div>
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
      </div>
    </>
  );
};

export default Payments;
