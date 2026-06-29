// import React from 'react'

// const Infotable = () => {
//   return (
//     <div>Infotable</div>
//   )
// }

// export default Infotable

import React, { useState } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { HiTrash, HiPencil } from "react-icons/hi";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
const Shippingtable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(mock);
  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
      {/* Table */}
      <div className="rounded-lg shadow overflow-x-auto mt-3">
        <div className="flex flex-row gap-4 w-full">
          <div className="px-4 pb-4 rounded-sm border border-gray-200 flex-1">
            <div className="border-x border-gray-200 rounded-sm overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white border-b-2">
                    <th>S. No.</th>
                    {/* <th className="pl-10">
                      <div className="flex items-center">
                        Order No.
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("order_no");
                          }}
                        />
                      </div>
                    </th> */}
                    {/* <th className="pl-10">
                      <div className="flex items-center">
                        Customer Name
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("customer_name");
                          }}
                        />
                      </div>
                    </th> */}
                    <th className="pr-9">Shipping ID</th>
                    <th className="pr-9">Product</th>
                    <th className="pr-9">Product Name</th>
                    <th className="pr-9">Shipper Name</th>
                    <th className="pr-9 ">Departure</th>
                    <th className="pr-9 ">Receiving</th>
                    {/* <th className="pr-9">
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
                    {/* <th>
                      <div className="flex items-center">
                        Status
                        <FaSort
                          className="hover:cursor-pointer"
                          onClick={() => {
                            sorting("status");
                          }}
                        />
                      </div>
                    </th> */}
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((d, index) => (
                    <tr
                      key={startIndex + d.id}
                      className={alternate(startIndex + index + 1)}
                    >
                      <td className="pl-4">{startIndex + index + 1}</td>

                      <td className="pl-10">{d.shipping_id}</td>

                      {/* <td className="pl-10">{d.product}</td> */}
                      <td className="pl-2 h-2 w-2">
                      <img
                        src={d.product}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      </td>
                      <td className="pl-10">{d.product_name}</td>
                      
                      <td className="pl-10">{d.shipper_name}</td>
                      <td className="pl-8">{d.departure}</td>
                      <td className="pl-8">{d.receiving}</td>
                      <td className="pl-6">{d.quantity}</td>
                      {/* <td>{new Date(d.date).toLocaleDateString()}</td> */}
                      {/* <td>{getOrderStatus(d.status)}</td> */}
                      {/* <td>
                        <div className="flex justify-center">
                          <HiPencil
                            className="fill-gray-800 mr-2 hover:cursor-pointer"
                            onClick={() => {
                              navigate("#");
                            }}
                          />
                          <HiTrash className="fill-red-500" />
                        </div>
                      </td> */}
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
    </>
  );
};

export default Shippingtable;
