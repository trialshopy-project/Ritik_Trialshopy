import React, { useState, useEffect } from "react";
import Topbar from "../../layouts/Topbar";
import { HiTrash, HiPencil } from "react-icons/hi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
import Sidebar from "../../layouts/sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";

// Function for alternate gray and white
function alternate(index) {
  if (index % 2 !== 0) {
    return "bg-white";
  }
}

// Dummy Values
const CustomerDetails = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);

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
      // setOriginalDataFilter(response.data.orders);
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

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleSearch = () => {
    if (searchText !== "") {
      const newSearchFilterData = originalData.filter((item) => {
        const cityMatch = item?.shippingAddress?.city
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const custoomerMatch = item?.userId?._id
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const stateMatch = item?.shippingAddress?.state
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const countryMatch = item?.shippingAddress?.country
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        return cityMatch || stateMatch || countryMatch || custoomerMatch;
      });
      setData(newSearchFilterData);
    } else {
      setData(originalData);
    }
  };

  const handleCustomerDelete = async (id) => {
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

    setShowConfirmation(false);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />
      <div className="md:ml-20 lg:ml-2 lg:w-full">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-16">
          {/* Search */}
          <div className="flex items-stretch m-4 focus:bg-gray-900 ">
            <input
              type="text"
              placeholder="Search name or email"
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
        </div>

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
                          Customer Id
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => {
                              sorting("city_id");
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center">
                          City
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => {
                              sorting("city_name");
                            }}
                          />
                        </div>
                      </th>

                      <th>
                        <div className="flex items-center">
                          Country
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => {
                              sorting("country_name");
                            }}
                          />
                        </div>
                      </th>
                      <th>
                        <div className="flex items-center">
                          Date
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
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
                  {data.length > 0 ? (
                    <>
                      {" "}
                      <tbody>
                        {currentData.map((d, index) => (
                          <tr
                            key={startIndex + d?.userId?._id}
                            className={alternate(startIndex + index + 1)}
                          >
                            <td className="mytable">
                              {startIndex + index + 1}
                            </td>

                            <td>{d?.userId?._id}</td>

                            <td>
                              {d?.shippingAddress?.city
                                ? d?.shippingAddress?.city
                                : "NA"}
                            </td>
                            <td>
                              {d.shippingAddress.state
                                ? d.shippingAddress.state
                                : "NA"}
                            </td>
                            <td>
                              {d.shippingAddress.country
                                ? d.shippingAddress.country
                                : "NA"}
                            </td>
                            <td>
                              {new Date(d.orderDate).toLocaleDateString()
                                ? new Date(d.orderDate).toLocaleDateString()
                                : "NA"}
                            </td>

                            <td>
                              <div className="flex justify-center">
                                <HiPencil
                                  className="fill-gray-800 mr-2 hover:cursor-pointer"
                                  onClick={() => {
                                    navigate("#");
                                  }}
                                />
                                <HiTrash
                                  className="fill-red-500 cursor-pointer"
                                  onClick={handleDelete}
                                />
                                {showConfirmation && (
                                  <Popup
                                    message="Are you sure you want to delete this Category?"
                                    onConfirm={() =>
                                      handleCustomerDelete(d._id)
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
                    <p>DATA NOT FOUND</p>
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

export default CustomerDetails;
