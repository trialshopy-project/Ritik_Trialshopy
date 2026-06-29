import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Editcategories = () => {
  const navigate = useNavigate();
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/parent-categories");
      setParentCategories(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpdateCategories = async () => {
    try {
      await axios.put(`/api/categories/${selectedCategory}`, {
        // Include any other category data to update
        // For example: name, image, etc.
      });
      navigate("../products/category");
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="ms-5">
        <div className="flex justify-between items-center">
          <div className="font-bold m-5 flex items-center text-lg">
            <BsPeopleFill className="mr-2" size={22} />
            Edit Categories
          </div>

          {/* Close */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch my-4 focus:bg-gray-900"
              onClick={() => {
                navigate("../products/category");
              }}
            >
              <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none">
                <AiOutlineClose className="mr-2 scale-125 border bg-white rounded-full fill-gray-900" />
                Close
              </button>
            </div>
          </div>
        </div>

        <div>
          <input type="file" />
          <label htmlFor="">Upload Category Image</label>
        </div>

        <div className="mt-3">
          <label className="block mb-2">Category Name</label>
          <input
            class="input-field gap-5"
            type="text"
            placeholder="Enter Category"
          />
        </div>

        <div>
          <label className="block mb-2 mt-4">Parent Categories</label>
          <select
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-control"
          >
            <option value="">Select a parent category</option>
            {parentCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-stretch ml-0 mt-6 focus:bg-gray-900">
          <button
            className="flex bg-gray-700 hover:bg-gray-900 text-white items-center px-4 py-1 gap-2 focus:outline-none"
            onClick={handleUpdateCategories}
          >
            Update Categories
            <ion-icon name="send" className="text-white "></ion-icon>
          </button>
        </div>
      </div>
    </>
  );
};

export default Editcategories;
