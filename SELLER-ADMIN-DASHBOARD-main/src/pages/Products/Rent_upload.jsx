import Topbar from "../../layouts/Topbar";
import React, { useContext, useEffect, useState } from "react";

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
          {/* {status.replaceAll("_", " ").toLowerCase()} */}
          {status}
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
const Rent_upload = () => {
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [originalData, setOriginalData] = useState([]);
  const [originalDataFilter, setOriginalDataFilter] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/products/seller/${sellerId}/rent`
      );
      console.log("object", response.data.products);
      setData(response.data.products);
      setOriginalData(response.data.products);
      setOriginalDataFilter(response.data.products);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
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
  const reverseArray = [...data].reverse();
  const totalPages = Math.ceil(reverseArray.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, reverseArray.length);
  const currentData = reverseArray.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCalendarToggle = () => {
    setShowCalendar(!showCalendar);
  };

  const handleStatusToggle = () => {
    setShowStatus(!showStatus);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
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
      // Apply filter logic here
      const filteredData = originalDataFilter.filter((d) => {
        return (
          selectedStatus === "" ||
          d.status.toLowerCase() === selectedStatus.toLowerCase()
          //   &&
          // (selectedDate === "" ||
          //   new Date(d.date).toLocaleDateString() ===
          //     selectedDate.toLocaleDateString())
        );
      });
      setData(filteredData);
    } else {
      setData(originalDataFilter);
    }
    setShowFilter(false);
  };

  const handleProductDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/products/${id}`
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

  const handleSearch = () => {
    if (searchText !== "") {
      const newSearchFilterData = originalData.filter((item) => {
        return item?.productName
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
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
    <div className="flex w-screen  lg:h-full h-screen overflow-y-scroll lg:w-full">
      <Topbar />

      <div className="  sm:w-full lg:ml-2 justify-center mt-7">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-16">
          {/* Search */}
          <div className="flex items-stretch m-4 focus:bg-gray-900 ">
            <input
              type="text"
              placeholder="Search Product Name"
              value={searchText}
              required
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch();
              }}
              className="sm:px-4 px-2 sm:py-2 w-60 py-0 rounded-l-md focus:outline-gray-900 shadow-2xl"
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
              className="flex items-stretch m-4 focus:bg-gray-900"
              onClick={() => {
                navigate("/products/addRent");
              }}
            >
              <button className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none">
                <AiOutlinePlus className="mr-1" />
                Add For Rent
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
              {/* <div
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
            </div> */}
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
        <div className="rounded-lg shadow  w-screen  lg:w-full">
          <div className="flex flex-row overflow-x-scroll w-full">
            <div className="px-8 lg:px-0 lg:pb-0 pb-4 rounded-sm border border-gray-200 flex-1">
              <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white border-b-2">
                      <th className="mytable w-20">S. No.</th>
                      <th className="w-32">
                        <div className="flex items-center p-2">
                          Product Id
                          <FaSort
                            className="ml-1 hover:cursor-pointer"
                            onClick={() => {
                              sorting("product_id");
                            }}
                          />
                        </div>
                      </th>
                      <th className="w-36">Product Img</th>
                      <th className="w-60">
                        <div className="flex items-center p-2">
                          Product Name
                          <FaSort
                            className="ml-1 hover:cursor-pointer"
                            onClick={() => {
                              sorting("product_name");
                            }}
                          />
                        </div>
                      </th>
                      <th className="w-32">
                        <div className="flex p-2">
                          Price per Hour
                          <FaSort
                            className=" hover:cursor-pointer"
                            onClick={() => {
                              sorting("product_price");
                            }}
                          />
                        </div>
                      </th>
                      <th className="w-32">
                        <div className="flex items-center p-2">
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
                  {data?.length > 0 ? (
                    
                    <>
                      {/* {" "}{
                        console.log('data is ',data)
                      } */}
                      <tbody>
                        {data.map((d, index) => (
                          <tr
                            key={startIndex + d.id}
                            className={alternate(startIndex + index + 1)}
                          >
                            <td className="mytable">
                              {startIndex + index + 1}
                            </td>

                            <td>{d._id}</td>
                            <td className="">
                              <div className="ml-[30%] ">
                                <img
                                  src={d?.productImage}
                                  alt=""
                                  className="w-8 h-8 rounded-full"
                                />
                              </div>
                            </td>

                            <td className="p-2">{d.productName}</td>
                            <td>{d.price}</td>

                            <td className="w-16">{getOrderStatus(d.status)}</td>
                            <td className="p-2">
                              <div className="flex justify-center">
                                <HiPencil
                                  className="fill-gray-800 mr-2 hover:cursor-pointer"
                                  onClick={() => {
                                    navigate(
                                      `editproducts?productId=${encodeURIComponent(
                                        d._id
                                      )}`
                                    );
                                  }}
                                />
                                <HiTrash
                                  className="fill-red-500 cursor-pointer"
                                  onClick={handleDelete}
                                />
                                {showConfirmation && (
                                  <Popup
                                    message="Are you sure you want to delete this product?"
                                    onConfirm={() => handleProductDelete(d._id)}
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
                    <p className="flex items-center justify-center m-auto">
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

export default Rent_upload
;
