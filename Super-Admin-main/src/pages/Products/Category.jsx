import React, { useState, useEffect, useContext } from "react";

import Categorytable from "./Categorytable";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import Topbar from "../../layouts/Topbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/categories`
      );
      setData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  };

  const handleSearch = () => {
    if (searchText !== "") {
      const newFilterData = originalData.filter((item) => {
        return item?.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setData(newFilterData);
    } else {
      setData(originalData);
    }
  };

  const [category, setSelectedCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescritption] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !category) {
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/subcategories/addSubCategory`,
        { name, description, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("SubCategory Created Successfully");
        setName("");
        setDescritption("");
        setSelectedCategory("");
      }

      console.log(response, "f");
      fetchData()
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Topbar />
      <div className="flex m-5 items-center justify-between mt-24">
        <div className="font-bold flex items-center justify-between text-lg">
          <p>Categories</p>
        </div>
        <button
          onClick={() => navigate("/products/addcategory")}
          className="flex py-2 font-normal bg-gray-700 hover:bg-gray-900 text-white items-center px-4 rounded-md focus:outline-none"
        >
          {/* <AiOutlinePlus className="mr-1" /> */}
          Add Category
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="px-7 flex items-center justify-between gap-20">
          <div className="">
            <label className="block">
              SubCategory Name <span className="text-[#F60002]">*</span>
            </label>
            <input
              className="input-field gap-5"
              type="text"
              placeholder="Enter Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="">
            <label className="block">
              Description <span className="text-[#F60002]">*</span>
            </label>

            <textarea
              className="input-field gap-5"
              type="text"
              placeholder="Enter Category Name"
              value={description}
              onChange={(e) => setDescritption(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Parent Categories <span className="text-[#F60002]">*</span>
            </label>
            <section className="">
              <select
                required
                className="bg-transparent text-sm  p-2 w-full"
                value={category}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {data.map((category, index) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </section>
          </div>
        </div>
        <div className="flex items-stretch ml-5 my-7 focus:bg-gray-900">
          <button
            type="submit"
            className="flex  bg-gray-700 hover:bg-gray-900 text-white items-center rounded px-4 py-1 gap-2 focus:outline-none"
          >
            Add SubCategories
            <ion-icon name="send" className="text-white"></ion-icon>
          </button>
        </div>
      </form> 

      <div className="flex items-stretch ml-5 mt-2 focus:bg-gray-900">
        <input
          type="text"
          placeholder="Search Catogory Name"
          className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-gray-900"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            handleSearch();
          }}
        />
        <button
          onClick={handleSearch}
          className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
        >
          <ion-icon name="search-outline" className="text-white"></ion-icon>
        </button>
      </div>

      <div className="mt-4">
        {
          console.log('data is : ',data)
        }
        <Categorytable data={data} />
      </div>
    </>
  );
};

export default Category;
