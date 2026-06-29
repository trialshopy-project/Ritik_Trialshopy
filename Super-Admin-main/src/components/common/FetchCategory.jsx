import React, { useState, useEffect } from "react";
import axios from "axios";

const CategorySelector = ({ onSave, setActiveTab, setSelecteCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopLevelCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories?parent=null`
        );

        console.log(response.data, "ok");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching top-level categories:", error);
      }
    };
    fetchTopLevelCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/children/${
          category._id
        }`
      );
      setChildCategories(response.data);
    } catch (error) {
      console.error("Error fetching child categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (selectedCategory && childCategories.length === 0) {
      setActiveTab(2);
      setSelecteCategoryId(selectedCategory._id);
      console.log("Selected Category ID:", selectedCategory._id);
      //   onSave(selectedCategory);
    } else {
      alert("Please select a category with no children.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full lg:ps-12 mt-10">
      <div className="w-full bg-white p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div>
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer w-full p-2 mb-2 border font-bold rounded hover:bg-customPurple  ${
                selectedCategory?._id === category._id
                  ? "bg-customPurple bg-opacity-20 text-customPurple"
                  : ""
              }`}
            >
              {"+ " + category.name}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-full p-4">
        {loading && <p className="text-gray-500">Loading...</p>}
        {childCategories.length > 0 ? (
          <div className="w-full">
            <div>
              {childCategories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className={`cursor-pointer w-full p-2 mb-2 border rounded hover:bg-gray-200 ${
                    selectedCategory?._id === category._id ? "bg-gray-300" : ""
                  }`}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        ) : selectedCategory ? (
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory.name}
            </h2>
            <button
              onClick={handleSave}
              className="p-2 bg-gray-700 w-52 text-white font-semibold rounded hover:bg-blue-600"
            >
              Save and Proceed
            </button>
          </div>
        ) : (
          <p className="font-bold">
            Select a category to see its children or save the selection.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
