import React, { useState } from "react";
import { HiTrash, HiPencil } from "react-icons/hi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";

// Function for alternate gray and white
function alternate(index) {
  if (index % 2 !== 0) {
    return "bg-white";
  }
}

const Categorytable = ({ data }) => {
  const navigate = useNavigate();

  const [order, setOrder] = useState("ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showConfirmation, setShowConfirmation] = useState(false);

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
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data?.length);
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  //delete category
  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/categories/${id}`
      );

      console.log(response.data, "categoriesDelete");
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        fetchData();
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
    <>
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
                        Category Id
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("category_id");
                          }}
                        />
                      </div>
                    </th>
                    <th></th>
                    {/* <th className="pr-9 ">Product</th> */}
                    <th className="w-1/3">
                      <div className="flex items-center">
                        Category Name
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("product_name");
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
                          key={startIndex + d.id}
                          className={alternate(startIndex + index + 1)}
                        >
                          <td className="mytable">{startIndex + index + 1}</td>

                          <td>{d._id}</td>

                          <td>
                            <img
                              src={d?.image?.url}
                              alt=""
                              className="w-8 h-8 rounded-full mt-1 mr-2"
                            />
                          </td>
                          <td>{d.name}</td>

                          <td>
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

export default Categorytable;
