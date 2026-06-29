import React, { useState, useEffect } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { HiTrash } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";
import { io } from "socket.io-client"; 

function alternate(index) {
  if (index % 2 !== 0) {
    return "bg-white";
  }
}

const NotificationPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationCount, setNotificationCount] = useState(0); 
  const itemsPerPage = 10;
  const socket = io(import.meta.env.VITE_API_ENDPOINT); 

  useEffect(() => {
    fetchNotifications();
    socket.on("new_notification", (newNotification) => {
      toast.success("New Notification Received!");
      setData((prevData) => [newNotification, ...prevData]);
      setOriginalData((prevData) => [newNotification, ...prevData]);
      setNotificationCount((prevCount) => prevCount + 1);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notifications`
      );
      setData(response.data.notifications);
      setOriginalData(response.data.notifications);
      setNotificationCount(response.data.notifications.length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredData = originalData.filter((item) =>
      item.userId.toLowerCase().includes(searchTerm)
    );
    setData(filteredData);
    setCurrentPage(1);
  };

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

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleDeleteNotification = async (_id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/notifications/${_id}`
      );

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
    setShowConfirmation(false);
  };

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar2 notificationCount={notificationCount} />
      <div className="lg:w-full lg:ml-2 md:ml-20 md:mr-4 sm:mr-4">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-20">
          {/* Add Notification */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch m-4 focus:bg-gray-900"
              onClick={() => navigate("sendnotification")}
            >
              <button className="flex bg-customGray text-white items-center px-4 rounded-md focus:outline-none">
                <AiOutlinePlus className="mr-1" />
                Send Notification
              </button>
            </div>
          </div>
          {/* Search Box */}
          <div className="flex items-center justify-center w-7/12 mt-4">
            <input
              type="text"
              placeholder="Search by User ID"
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 shadow-lg rounded-full px-6 py-3 w-3/4 md:w-2/3 lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
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
                          User ID
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("userId")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Title
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("title")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Message
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("message")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          URL
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting("url")}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  {data.length > 0 ? (
                    <tbody>
                      {currentData.map((d, index) => (
                        <tr
                          key={startIndex + d._id}
                          className={alternate(startIndex + index + 1)}
                        >
                          <td className="py-2 px-4">
                            {startIndex + index + 1}
                          </td>
                          <td className="py-2 px-4">{d.userId}</td>
                          <td className="py-2 px-4">{d.title}</td>
                          <td className="py-2 px-4">{d.message}</td>
                          <td className="py-2 px-4">
                            <a
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {d.url}
                            </a>
                          </td>
                          <td className="py-2 px-4">
                            <div className="flex justify-center">
                              <HiTrash
                                className="fill-red-500 cursor-pointer"
                                onClick={handleDelete}
                              />
                              {showConfirmation && (
                                <Popup
                                  message="Are you sure you want to delete this notification?"
                                  onConfirm={() =>
                                    handleDeleteNotification(d._id)
                                  }
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
                        <td
                          colSpan="6"
                          className="text-center py-4 text-gray-500"
                        >
                          No notifications available.
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 rounded-md bg-customGray text-white"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 mx-1 rounded-md ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-customGray text-white"
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              className="px-4 py-2 rounded-md bg-customGray text-white"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
