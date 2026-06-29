import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import ReelCard from "./ReelCard";
import Pagination from "./Pagination";
const Reel = () => {
  const [reels, setReels] = useState([]);
  const [authenticated] = useContext(UserContext);
  const parsedUserData = authenticated.user;
  const navigate = useNavigate();
  const [comment, setComment] = useState(false);
const [share, setShare] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.ceil(reels.length / 6);
const handlePageChange = (page) => {
  setCurrentPage(page);
};
  const getData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/reels/getReels/${
          parsedUserData?._id
        }`
      );
      // console.log(response.data.data);
      setReels(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(parsedUserData)
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="h-full w-full p-6">
      <div className="w-full justify-end flex">
        <button
          className="bg-amber-500 px-6 py-2 hover:scale-105 duration-300 rounded text-white text-lg"
          onClick={() => navigate("/reels/uploadReels")}
        >
          Upload Reel
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reels.length>0 &&
          reels.map((reel, index) => (
            <ReelCard key={index} img={parsedUserData?.avatar?.url} share={share} setShare={setShare} setComment={setComment} src={reel.video} liveProductData={reel} fetchReels={getData} />
          ))}
      </div>
      {reels?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          ) : (
            <></>
          )}
    </div>
  );
};

export default Reel;
