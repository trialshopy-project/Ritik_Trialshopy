import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const CategorySelector = ({ onSave, setActiveTab, setSelecteCategoryId, setUploadedImages, setactive_categories ,setCategoryArray}) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [catArray, setCatArray] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState([])//will track the path moved by the user!

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
    setCatArray((prevArray) => [...prevArray, category]);
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/children/${category._id
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
      setCategoryArray(catArray)
      setActiveTab(2);
      setSelecteCategoryId(selectedCategory._id);
      setactive_categories(selectedCategory._id)
      console.log("Selected Category ID:", selectedCategory._id);
      //   onSave(selectedCategory);
    } else {
      alert("Please select a category with no children.");
    }
  };

  const [uploadedImages, setLocalUploadedImages] = useState([]);
  const [local_file, setlocal_file] = useState([]);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };
  //cloudinary image uploader ---------------->
  const [url, setUrl] = useState([]);

  const responseData = async (image) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
        { images: image }
      );
      return response.data.urls[0];
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const files_show = Array.from(e.target.files);
    setlocal_file((prevImages) => [
      ...prevImages, ...files_show
    ])
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageBlob = reader.result;
        const uploadedUrl = await responseData(imageBlob);
        setUrl(uploadedUrl);

        setUploadedImages((prevData) => [
          ...prevData,
          uploadedUrl?.url
        ]);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setlocal_file((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col md:flex-row w-full lg:ps-12 mt-10 justify-center items-start">
      <div className="w-auto text-center text-nowrap rounded-xl bg-white p-4 border-r shadow-lg h-auto flex-grow-0">
        <h2 className="text-xl font-semibold mb-4 mx-auto text-center">Categories</h2>
        <div className="h-full w-auto flex flex-col">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleCategoryClick(category)}
              className={`cursor-pointer w-full p-2 pl-7 pr-7 mb-2 border font-bold rounded hover:bg-customPurple hover:text-white justify-between flex${selectedCategory?._id === category._id
                  ? " text-white bg-customPurple"
                  : ""
                }`}
            >
              {"+ " + category.name}
            </div>
          ))}
        </div>
      </div>
      <div className="w-auto lg:w-full p-4">
        {loading && <p className="text-gray-500">Loading...</p>}
        {catArray.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Selected Categories:</h3>
            <div className="flex flex-wrap gap-2 ">
              {catArray.map((cat, index) => (
                <span key={index} className="px-3 py-1 bg-amber-500 text-white rounded">
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {childCategories.length > 0 ? (
          <div className="w-auto">
            <div>
              {childCategories.map((category) => (
                <span
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className={`cursor-pointer w-auto md:w-auto p-2 mb-2 border inline-flex text-nowrap 
                    w  pl-7 pr-7  m-3 text-center hover:bg-gray-200 bg-white shadow-lg rounded-lg ${selectedCategory?._id === category._id ? "bg-gray-300" : ""
                    }`}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        ) : selectedCategory ? (
          <div className="w-full">
            {/* <h2 className="text-2xl font-bold mb-6 text-customPurple text-center">
    {selectedCategory.name}
  </h2> */}
            <div className="p-6 bg-white rounded-lg shadow-md flex flex-col gap-6 justify-evenly">
              <h1 className="font-bold text-2xl text-gray-800">
                Upload Photos and Videos of the <span className="font-bold text-customPurple text-2xl">{selectedCategory.name}</span>
              </h1>
              {/* <p className="text-gray-600 mb-4">Upload from desktop</p> */}
              <div className="shadow-inner bg-gray-50 w-full h-auto p-7 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="mb-4">
                  {/* Place the image upload icon here */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7l6 6m0 0l6-6m-6 6V3m6 15l6-6m0 0l-6 6m6-6h-9M3 7l6 6M3 7l6 6M3 7l6 6m0 0v5"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 mb-2"></p>
                  <p className="text-gray-500 mb-4">
                    Upload up to 50 photos. Accepted formats:
                    PNG, JPG, JPEG, GIF, WEBP, HEIC, HEIF.
                  </p>
                  {/* <p className="text-gray-500 mb-4">or</p> */}
                  <button
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
                    onClick={handleClick}
                  >
                    Upload photos now
                  </button>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {local_file.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Uploaded image"
                      className="rounded-lg object-cover h-fit w-fit"
                    // width={100}
                    // height={100}
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 50 && (
                  <div
                    className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 w-24 ${uploadedImages.length ? "" : "hidden"
                      }`}
                  >
                    <button className="text-gray-500 text-2xl" onClick={handleClick}>
                      +
                    </button>
                  </div>
                )}
              </div>
              <hr />
              <button
                onClick={handleSave}
                className="mt-6 px-6 py-3 bg-customPurple text-white font-semibold rounded-lg hover:bg-yellow-500 focus:outline-none flex justify-center items-center w-full"
              >
                Proceed
              </button>
            </div>
          </div>

        ) : (
          <p className="font-bold">
            {/* Select a category to see its children or save the selection. */}
          </p>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
