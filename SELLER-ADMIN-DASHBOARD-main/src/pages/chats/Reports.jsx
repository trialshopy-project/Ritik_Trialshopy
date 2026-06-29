import React, { useEffect, useState } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { HiEye } from "react-icons/hi";
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

// Function to style the report status
function getReportStatus(status) {
  switch (status) {
    case "resolved":
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
    default:
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-md text-xs font-bold text-gray-600 bg-gray-100">
          {status?.replaceAll("_", " ").toLowerCase()}
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

// Reports Component
const Reports = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [originalDataFilter, setOriginalDataFilter] = useState([]);

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
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/reports`
      );
      setData(response.data);
      console.log(response.data, "response");
    } catch (error) {
      console.error("Error fetching reports:", error);
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
    } else if (order === "DSC") {
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
          new Date(d.reportDate).toLocaleDateString() ===
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

  const handleSearch = () => {
    if (searchText !== "") {
      const newSearchFilterData = originalData.filter((item) => {
        const nameMatch = item?.reportedUser?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const emailMatch = item?.reportedUser?.email
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
            placeholder="Search Reported User Name or Email Id"
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
            className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
          >
            <ion-icon name="search-outline" className="text-white"></ion-icon>
          </button>
        </div>
        {/* Filter */}
        <div className="flex mr-4">
          <div className="relative flex items-stretch my-4 focus:bg-gray-900">
            <button
              className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none"
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
                  <label htmlFor="resolved" className="ml-2">
                    Resolved
                  </label>
                  <input
                    className="rounded-full text-black"
                    type="checkbox"
                    id="resolved"
                    name="status"
                    value="resolved"
                    checked={selectedStatus === "resolved"}
                    onChange={() => handleStatusChange("resolved")}
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
            <hr className="h-px bg-black" />
            {showCalendar && (
              <Calendar
                onChange={handleDateChange}
                value={selectedDate ? new Date(selectedDate) : new Date()}
                className="border border-black"
              />
            )}
            <button
              className="flex bg-customPurple text-white items-center px-4 rounded-md w-full justify-center mt-2"
              onClick={handleFilterSubmit}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto mx-2 mt-4">
        <div className="border-2 border-gray-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={() => sorting("reportId")}
                >
                  <div className="flex items-center justify-center">
                    Report ID <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => sorting("reportedUserName")}
                >
                  <div className="flex items-center justify-center">
                    Reported by <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => sorting("reportedUserName")}
                >
                  <div className="flex items-center justify-center">
                    Reported to User <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => sorting("status")}
                >
                  <div className="flex items-center justify-center">
                    Status <FaSort className="ml-2" />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => sorting("reportDate")}
                >
                  <div className="flex items-center justify-center">
                    Date <FaSort className="ml-2" />
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index} className={alternate(index) || "bg-gray-100"}>
                  <td className="py-2 px-4 text-center">{item._id}</td>
                  <td className="py-2 px-4 text-center">{item.reporter}</td>

                  <td className="py-2 px-4 text-center">{item.reportedUser}</td>
                  <td className="py-2 px-4 text-center">
                    {getReportStatus(item.status)}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => navigate(`/reports/${item.reportId}`)}
                      className="bg-customPurple text-white py-1 px-2 rounded-md"
                    >
                      <HiEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-customPurple text-white rounded-l-md"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (number, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 ${
                currentPage === number
                  ? "bg-customPurple text-white"
                  : "bg-white text-black"
              }`}
            >
              {number}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-customPurple text-white rounded-r-md"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Reports;
