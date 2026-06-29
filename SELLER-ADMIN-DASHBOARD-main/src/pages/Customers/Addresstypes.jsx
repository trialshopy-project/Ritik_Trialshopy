import React, { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar";
import { HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import Sidebar from "../../layouts/sidebar";
import mock from "../../dummy_data2.json";

// Function to style the order status
function getOrderStatus(status) {
  switch (status) {
    case "Active":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500">
          {status}
        </span>
      );
    case "Deactivated":
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
function AddressTypes() {
  const navigate = useNavigate();
  const [data, setData] = useState(mock);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 15;

  // // Function to fetch data from the API
  // const fetchData = async () => {
  //   try {
  //     // Make the API call here and replace 'API_ENDPOINT' with your actual API endpoint URL
  //     const response = await fetch(API_ENDPOINT);
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     const data = await response.json();
  //     setData(data); // Update the data state with the retrieved data
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      // Simulating an API call delay of 1 second using setTimeout
      setTimeout(() => {
        setData(mock); // Update the data state with the dummyData
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  // Use useEffect hook to fetch data when the component mounts
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
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  // const [showCalendar, setShowCalendar] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  // const handleCalendarToggle = () => {
  //   setShowCalendar(!showCalendar);
  // };

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex w-screen  lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />
      <div className="lg:w-full lg:ml-2 md:ml-20 ">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-16">
          {/* Search */}
          <div className="flex items-stretch m-4 focus:bg-gray-900 ">
            <input
              type="text"
              placeholder="Search here..."
              className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-gray-900 shadow-2xl"
            />
            <button className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none">
              <ion-icon name="search-outline" className="text-white"></ion-icon>
            </button>
          </div>

          {/* Add customer & filter */}
          <div className="flex mr-4 md:flex-col justify-between">
            {/* <div
            className="flex items-stretch m-4 focus:bg-gray-900"
            onClick={() => {
              navigate('AddCustomers');
            }}
          >
            <button className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none">
              <AiOutlinePlus className="mr-1" />Add Customers
            </button>
          </div> */}

            {/* Filter */}
            <div className="flex">
              <div className="relative flex items-stretch my-4 focus:bg-gray-900">
                <button
                  className="flex bg-customPurple text-white items-center px-4 py-2 rounded-md focus:outline-none"
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
                <div className="text-gray-700 mb-2">
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
                    <label htmlFor="deactive" className="ml-2">
                      Deactive
                    </label>
                    <input
                      className="rounded-full text-black"
                      type="checkbox"
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
        <div className="rounded-lg shadow overflow-x-auto">
          <div className="flex flex-row gap-4 w-full">
            <div className="px-4 pb-4 rounded-sm border border-gray-200 flex-1">
              <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white border-b-2">
                      <th className="mytable">S. No.</th>
                      <th>
                        <div className="flex items-center justify-between pr-4">
                          Address Type ID
                          <FaSort
                            className="ml-1 hover:cursor-pointer"
                            onClick={() => {
                              sorting("address_id");
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center  justify-between">
                          Address Type Name
                          <FaSort
                            className="ml-1 hover:cursor-pointer"
                            onClick={() => {
                              sorting("address_name");
                            }}
                          />
                        </div>
                      </th>

                      <th>Display Seq. No.</th>
                      <th>
                        <div className="flex items-center justify-between pr-4">
                          Date
                          <FaSort
                            className="hover:cursor-pointer"
                            onClick={() => {
                              sorting("date");
                            }}
                          />
                        </div>
                      </th>
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
                  <tbody>
                    {currentData.map((d, index) => (
                      <tr
                        key={startIndex + d.id}
                        className={alternate(startIndex + index + 1)}
                      >
                        <td className="mytable">{startIndex + index + 1}</td>

                        <td>{d.addresstype_id}</td>

                        <td>{d.addresstype_name}</td>
                        <td className="pl-7">{d.id}</td>
                        {/* <td className="pl-4">{d.country_name}</td> */}
                        <td>{new Date(d.date).toLocaleDateString()}</td>
                        <td>{getOrderStatus(d.status)}</td>
                        <td>
                          <div className="flex justify-center">
                            <HiPencil
                              className="fill-gray-800 mr-2 hover:cursor-pointer"
                              onClick={() => {
                                navigate("#");
                              }}
                            />
                            <HiTrash className="fill-red-500" />
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
        </div>
      </div>
    </div>
  );
}

export default AddressTypes;
