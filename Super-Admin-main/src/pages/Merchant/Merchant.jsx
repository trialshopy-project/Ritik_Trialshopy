import React, { useState, useEffect } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { FaCheck, FaTimes, FaSort } from "react-icons/fa";
import { HiTrash, HiPencil, HiEye } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import mock from "../../dummy_data.json";
import axios from "axios";
import MerchantPopup from "../../components/common/MerchantPopup";
import ViewDocument from "../../components/common/ViewDocument";
import SellerDetails from "./SellerDetails";
import EditSeller from "./EditSeller";

// Function to style the order status
function getOrderStatus(status) {
  switch (status) {
    case "Varified":
      return (
        <span className="flex justify-center items-center capitalize py-1 px-2 rounded-full text-xs font-bold text-green-500 bg-green-100 border border-green-500">
          {status}
        </span>
      );
    case "Failed":
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
const Merchant = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("loading");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/all-sellers`
      );

      const sellersWithStoreStatus = await Promise.all(
        response.data.sellers.map(async (seller) => {
          if (seller.storeId) {
            try {
              const storeResponse = await axios.get(
                `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getStore/${
                  seller.storeId
                }`
              );
              return {
                ...seller,
                storeStatus: storeResponse.data.varification,
              };
            } catch (error) {
              console.error(
                `Error fetching store data for storeId: ${seller.storeId}`,
                error.message
              );
              return { ...seller, storeStatus: "Unknown" };
            }
          } else {
            console.warn(`No storeId found for seller: ${seller._id}`);
            return { ...seller, storeStatus: "No Store ID" };
          }
        })
      );

      setData(sellersWithStoreStatus);
    } catch (err) {
      console.error("Error fetching sellers data:", err.message);
      setError(err.message);
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
  // const currentData = data.slice(startIndex, endIndex);
  const [currentData, setcurrentData] = useState([]);

  useEffect(() => {
    if (data) {
      setcurrentData(data.slice(startIndex, endIndex));
    }
  }, [data, startIndex, endIndex]); // Update when any of these values change

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

  const [isShow, setIsShow] = useState(false);
  const [isShowDocument, setIsShowDocument] = useState(false);
  const [isShowDetails, setIsShowDetails] = useState(false);
  const [isShowSeller, setIsShowSeller] = useState(false);
  const [storeIds, setStoreId] = useState("");

  const handleViewStore = (storeId) => {
    setIsShow(true);
    setStoreId(storeId);
    fetchSingleStore(storeId);
  };

  const [dataStore, setDataStore] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = React.useState(null);

  //fetch single data
  const fetchSingleStore = async (storeId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getStore/${storeId}`
      );
      console.log(data);
      setDataStore(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  const handleViewDocument = (id) => {
    setIsShowDocument(true);
    fetchSingleVerification(id);
  };

  const [sellerData, setSellerData] = useState({});

  const fetchSellerData = async (id) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getSeller/${id}`
      );
      console.log(response.data, "seller");
      setSellerData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowDetails = (id) => {
    setIsShowDetails(true);
    fetchSellerData(id);
  };

  const handleEditSeller = (id) => {
    setIsShowSeller(true);
    fetchSellerData(id);
  };
  //handle validation
  //handle validation
  const handleValidate = async (sellerId) => {
    try {
      // First, get the seller data to retrieve storeId
      const sellerResponse = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getSeller/${sellerId}`
      );

      const storeId = sellerResponse.data?.storeId;
      if (!storeId) {
        toast.error("Seller does not have a store associated");
        return; // Stop execution here
      }

      // Now validate the store using the storeId
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/validateStore/${storeId}`
      );

      if (response.data?.success === true) {
        toast.success(response.data?.message || "Store validated successfully");
        const updatedData = currentData.map((data) => {
          if (data._id === sellerId) {
            return { ...data, storeStatus: 'Varified' }; 
          }
          return data;
        });
        setcurrentData(updatedData)
      }
    } catch (error) {
      console.error("Error validating store:", error.message);
      toast.error("Failed to validate store");
    }
  };

  //handle deleteseller data
  const handleDeleteSeller = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/deleteStore/${id}`
      );

      if (response?.data?.success === true) {
        setData(data.filter((store) => store.sellerId !== id));
        toast.success(response?.data?.message || "Store deleted successfully.");
      }
    } catch (err) {
      console.error("Error deleting store:", err.message);
      setError("Failed to delete store.");
      toast.error("Failed to delete store.");
    }
  };

  // Function to show the confirmation dialog
  const handleDelete = (id) => {
    setSelectedSellerId(id); // Ensure id is correctly set
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (selectedSellerId) {
      handleDelete(selectedSellerId); // Pass the ID correctly
      setShowConfirmation(false);
      setSelectedSellerId(null);
    }
  };
  ///data fetched for verification
  const [verificationData, setVerificationData] = useState({});

  const fetchSingleVerification = async (id) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/getFormData/${id}`
      );
      console.log(data);
      setVerificationData(data);
    } catch (error) {
      console.error("Error fetching image data:", error.message);
    }
  };

  return (
    <>
      <Topbar2 />

      <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-16">
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

        {/* Add Merchant */}
        <div className="flex mr-4">
          <div
            className="flex items-stretch m-4 focus:bg-gray-900"
            onClick={() => {
              navigate("AddMerchant");
            }}
          >
            <button className="flex bg-gray-700 hover:bg-gray-900 text-white items-center px-4 rounded-md focus:outline-none">
              <AiOutlinePlus className="mr-1" />
              Add Merchant
            </button>
          </div>

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
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this seller?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={confirmDelete}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
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
                    <th className="merchant-table">S. No.</th>
                    <th className="merchant-table"></th>
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
                    <th className="merchant-table">Stores</th>
                    <th className="merchant-table">Document</th>
                    {/* <th className="merchant-table">
                      <div className="flex items-center">
                        Date
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("date");
                          }}
                        />
                      </div>
                    </th> */}
                    <th className="merchant-table">
                      <div className="flex items-center">
                        Status
                        <FaSort
                          className="hover:cursor-pointer"
                          onClick={() => {
                            sorting("status");
                          }}
                        />
                      </div>
                    </th>
                    <th className="merchant-table">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData &&
                    currentData.map((d, index) => (
                      <tr
                        key={startIndex + d.id}
                        className={alternate(startIndex + index + 1)}
                      >
                        <td className="merchant-table">
                          {startIndex + index + 1}
                        </td>
                        <td className="merchant-table">
                          <img
                            className="w-7 h-7 rounded-full object-cover"
                            src="/src/profile.png"
                            alt="Avatar"
                          />
                        </td>
                        <td className="merchant-table">
                          {d.firstName} {d.lastName}
                        </td>
                        <td className="merchant-table">{d._id}</td>
                        <td className="merchant-table">
                          <button
                            className="bg-customGray rounded-lg px-3 py-1 text-sm text-white"
                            onClick={() => {
                              handleViewStore(d.storeId);
                            }}
                          >
                            view Store
                          </button>
                        </td>
                        <td className="merchant-table">
                          {" "}
                          <button
                            className="bg-customGray rounded-lg px-3 py-1 text-sm text-white"
                            onClick={() => {
                              handleViewDocument(d._id);
                            }}
                          >
                            view Document
                          </button>
                        </td>
                        {/* <td className="merchant-table">
                        {new Date(d.date).toLocaleDateString()}
                      </td> */}
                        <td className="merchant-table">
                          {getOrderStatus(d.storeStatus)}
                        </td>
                        <td className="merchant-table">
                          <td className="py-2 px-4 text-center">
                            <div className="flex justify-center">
                              <HiPencil
                                className="fill-gray-800 mr-2 hover:cursor-pointer"
                                onClick={() => {
                                  handleEditSeller(d._id);
                                }}
                              />
                              <HiEye
                                onClick={() => {
                                  handleShowDetails(d._id);
                                }}
                                className="fill-gray-800 mr-2 hover:cursor-pointer"
                              />
                              {d.storeStatus !== "Varified" && (
                                <>
                                  <button
                                    onClick={() => handleValidate(d._id)}
                                    className="text-green-500 hover:text-green-700 mx-2"
                                  >
                                    <FaCheck size={20} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSeller(d._id)}
                                    className="text-red-500 hover:text-red-700 mx-2"
                                  >
                                    <FaTimes size={20} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
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
      {isShow && (
        <MerchantPopup
          dataStore={dataStore}
          isShow={isShow}
          setIsShow={setIsShow}
        />
      )}
      {isShowDocument && (
        <ViewDocument
          verificationData={verificationData}
          isShowDocument={isShowDocument}
          setIsShowDocument={setIsShowDocument}
        />
      )}
      {isShowDetails && (
        <SellerDetails
          sellerData={sellerData}
          isShowDetails={isShowDetails}
          setIsShowDetails={setIsShowDetails}
        />
      )}
      {isShowSeller && (
        <EditSeller
          sellerData={sellerData}
          isShowSeller={isShowSeller}
          setIsShowSeller={setIsShowSeller}
          fetchData={fetchData}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Merchant;
