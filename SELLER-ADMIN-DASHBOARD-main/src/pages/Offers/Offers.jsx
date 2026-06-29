import React, { useState, useEffect, useContext } from "react";
import Topbar from "../../layouts/Topbar";
import { HiTrash, HiPencil } from "react-icons/hi";
// import {
//   MdOutlineKeyboardArrowUp,
//   MdOutlineKeyboardArrowDown,
// } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import Sidebar from "../../layouts/sidebar";

import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";
import { UserContext } from "../../components/context/UserContext";

// Function to style the order status
// function getOrderStatus(status) {
//   switch (status) {
//     case "Active":
//       return (
//         <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500">
//           {status}
//         </span>
//       );
//     case "Deactivated":
//       return (
//         <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-red-500 bg-red-100 border border-red-500">
//           {status}
//         </span>
//       );
//     default:
//       return (
//         <span className="flex justify-center items-center capitalize py-1 px-2 rounded-md text-xs font-bold text-gray-600 bg-gray-100">
//           {status.replaceAll("_", " ").toLowerCase()}
//         </span>
//       );
//   }
// }

// Function for alternate gray and white
function alternate(index) {
  if (index % 2 !== 0) {
    return "bg-white";
  }
}

// Dummy Values
const Offers = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);
const _id=authenticated.user._id
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/offers/${_id}`
      );
      console.log(response.data, "offeres");
      setData(response.data.offer);

      setOriginalData(response.data.offer);
    } catch (error) {
      console.error("Error fetching offers:", error);
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

  console.log(data, "D");

  let sellerData = [];

  if (data) {
    data.map((item) => {
      if (item.sellerId === sellerId) {
        sellerData.push(item);
      }
    });
  }

  // Pagination
  const totalPages = Math.ceil(sellerData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sellerData.length);
  const currentData = sellerData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const [showFilter, setShowFilter] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState("");
  // const [selectedDate, setSelectedDate] = useState("");
  // const [showCalendar, setShowCalendar] = useState(false);
  // const [showStatus, setShowStatus] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteOffer = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/offers/${id}`
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
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
    if (searchText) {
      const newSearchFilterData = originalData.filter((item) => {
        return item.applicableProducts.some((product) => {
          return product.productName
            .toLowerCase()
            .includes(searchText.toLowerCase());
        });
      });
      setData(newSearchFilterData);
    } else {
      setData(originalData);
    }
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />
      <div className="lg:w-full lg:ml-2  md:ml-20 md:mr-4 sm:mr-4">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-20">
          {/* Search */}
          <div className="flex  m-4 focus:bg-gray-900 ">
            <input
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                handleSearch();
              }}
              placeholder="Search Product Name"
              className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-gray-900 shadow-2xl"
            />
            <button
              onClick={handleSearch}
              className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
            >
              <ion-icon name="search-outline" className="text-white"></ion-icon>
            </button>
          </div>

          {/* Add offer & filter */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch m-4 focus:bg-gray-900"
              onClick={() => {
                navigate("addnewoffer");
              }}
            >
              <button className="flex bg-customPurple text-white items-center px-4 rounded-md focus:outline-none">
                <AiOutlinePlus className="mr-1" />
                Add New Offer
              </button>
            </div>

            {/* Filter */}
            {/* <div className="flex">
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
          </div> */}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg shadow w-screen lg:w-full p-4">
          <div className="flex flex-col gap-4 w-full overflow-x-scroll">
            <div className="rounded-sm border border-gray-200 flex-1">
              <div className="overflow-x-scroll">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-white border-b-2">
                      <th className="py-2 px-4 text-left">S. No.</th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Offer Id
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("offer_id")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Offer(%age)
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("offer_p")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Product Name
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("product_name")}
                          />
                        </div>
                      </th>
                      {/* <th className="py-2 px-4 text-left">Rating</th>
                      <th className="py-2 px-4 text-left">Total Reviews</th> */}
                      <th className="py-2 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  {sellerData.length > 0 ? (
                    <tbody>
                      {currentData.map((d, index) => (
                        <tr
                          key={startIndex + d._id}
                          className={alternate(startIndex + index + 1)}
                        >
                          <td className="py-2 px-4">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-2 px-4">{d._id}</td>
                          <td className="py-2 px-4">{d.discount}</td>
                          <td className="py-2 px-4">
                            {d?.applicableProducts
                              .map((item) => item.productName)
                              .join(", ")}
                          </td>
                          {/* <td className="py-2 px-4">
                            {d?.applicableProducts
                              .map((item) => item?.rating?.rating)
                              .join(", ")}
                          </td> */}
                          {/* <td className="py-2 px-4">
                            {d?.applicableProducts
                              .map((item) => item?.rating?.count)
                              .join(", ")}
                          </td> */}
                          <td className="py-2 px-4">
                            <div className="flex justify-center">
                              <HiPencil
                                className="fill-gray-800 mr-2 hover:cursor-pointer"
                                onClick={() => navigate(`/offers/updateOffer?id=${d._id}`)}
                              />
                              <HiTrash
                                className="fill-red-500 cursor-pointer"
                                onClick={handleDelete}
                              />
                              {showConfirmation && (
                                <Popup
                                  message="Are you sure you want to delete this Offer?"
                                  onConfirm={() => handleDeleteOffer(d._id)}
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
                        <td colSpan="7" className="py-4 text-center">
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
                Showing {startIndex + 1}-{Math.min(endIndex, data.length)}{" "}
                entries
              </div>
              <div className="flex">
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
                <button className="mx-1 px-2 py-1 rounded bg-gray-200 text-gray-700">
                  Page {currentPage} of {totalPages}
                </button>
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

export default Offers;
