import React, { useState } from "react";
import { HiTrash, HiPencil } from "react-icons/hi";
import { FaSort } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Popup from "../../components/common/Popup";
// import Popup from "../../components/common/Popup";

// Function for alternate gray and white
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Assuming you're using react-icons

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
        navigate("/Products");
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

  const handleEdit = async (id, name) => {
    //   // //http://localhost:5173/Products/Category/editcategories?id=66a6994a26eaf594470aaa4b

    // try {
    //   const response = await axios.get(
    //     `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/${id}/${name}`
    //   );

    //   // console.log(response.data, "categoriesDelete");
    //   if (response?.data?.success === true) {
    //     navigate(`/Products/Category/editcategories?id=${response.data.id}`)
    //   }
    // } catch (error) {
    //   console.error("Error fetching data", error);
    // }
    navigate(`/Products/Category/editcategories?id=${id}`);
  };
  const [openCategoryIds, setOpenCategoryIds] = useState(new Set());

  const toggleCategory = (categoryId) => {
    setOpenCategoryIds((prevOpenCategoryIds) => {
      const newOpenCategoryIds = new Set(prevOpenCategoryIds);
      if (newOpenCategoryIds.has(categoryId)) {
        newOpenCategoryIds.delete(categoryId);
      } else {
        newOpenCategoryIds.add(categoryId);
      }
      return newOpenCategoryIds;
    });
  };
  const renderSubCategories = (subCategories, handleEdit) => (
    <ul>
      {subCategories.map((subCategory) => (
        <li key={subCategory._id}>
          <div className="flex flex-row justify-start gap-4">
            <span>{subCategory.name}</span>
            <button
              onClick={() => handleEdit(subCategory._id)}
              className="text-green-600 hover:text-green-900"
            >
              Edit
            </button>
          </div>
          {/* Recursively render subcategories */}
          {subCategory.subCategories.length > 0 && (
            <div className="ml-4">
              {renderSubCategories(subCategory.subCategories, handleEdit)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

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
                        Category Name
                        <FaSort
                          className="ml-1 hover:cursor-pointer"
                          onClick={() => {
                            sorting("name");
                          }}
                        />
                      </div>
                    </th>
                    <th className="text-left">Subcategories</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {data.length > 0 ? (
                  <tbody>
                    {currentData.map((category, index) => (
                      <React.Fragment key={startIndex + category._id}>
                        {/* Main category row */}
                        <tr className={alternate(startIndex + index + 1)}>
                          <td className="mytable">{startIndex + index + 1}</td>
                          <td>{category.name}</td>
                          {/* <td>
                            {category.subCategories.length > 0 ? (
                              <ul className="">
                                {category.subCategories.map(
                                  (subCategory, subIndex) => (
                                    <div className="flex flex-row justify-start gap-4">
                                      <li key={subIndex}>{subCategory.name}</li>
                                      <button
                                        onClick={() =>
                                          handleEdit(subCategory._id)
                                        }
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Edit
                                      </button>
                                      
                                    </div>
                                  )
                                )}
                              </ul>
                            ) : (
                              <span className="text-center bg-bold">-</span>
                            )}
                          </td> */}
                          {/**hello---------------> */}
                          <td>
                            {category.subCategories.length > 0 ? (
                              renderSubCategories(
                                category.subCategories,
                                handleEdit
                              )
                            ) : (
                              <span className="text-center bg-bold">-</span>
                            )}
                          </td>

                          <td>
                            <div className="flex justify-center">
                              <HiPencil
                                className="fill-gray-800 mr-2 hover:cursor-pointer"
                                onClick={() => {
                                  navigate(`editcategories?id=${category._id}`);
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
                                    handleDeleteCategory(category._id)
                                  }
                                  onCancel={cancelDelete}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
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
