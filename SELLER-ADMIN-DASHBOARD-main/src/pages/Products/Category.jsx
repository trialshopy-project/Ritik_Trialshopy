import React, { useState, useEffect, useContext } from "react";
import Topbar2 from "../../layouts/Topbar2";
import Categorytable from "./Categorytable";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import Header from "../../layouts/Topbar";
const Category = () => {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
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

  return (
    <>
      {/* <Topbar2 /> */}
      <Header />
      <div className="flex ml-5 mt-20 mb-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_56_8871)">
            <path
              d="M13.9999 2.33333L7.58325 12.8333H20.4166L13.9999 2.33333Z"
              fill="#27272A"
            />
            <path
              d="M20.4167 25.6667C23.3162 25.6667 25.6667 23.3162 25.6667 20.4167C25.6667 17.5172 23.3162 15.1667 20.4167 15.1667C17.5173 15.1667 15.1667 17.5172 15.1667 20.4167C15.1667 23.3162 17.5173 25.6667 20.4167 25.6667Z"
              fill="#27272A"
            />
            <path d="M3.5 15.75H12.8333V25.0833H3.5V15.75Z" fill="#27272A" />
          </g>
          <defs>
            <clipPath id="clip0_56_8871">
              <rect width="28" height="28" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <div className="font-bold ml-2 items-center text-lg">Categories</div>
      </div>

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
        <Categorytable data={data} />
      </div>
    </>
  );
};

export default Category;
