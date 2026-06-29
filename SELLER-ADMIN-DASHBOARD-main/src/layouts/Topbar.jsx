import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationData from "./Notificationdata"; // Import NotificationData component
import { UserContext } from "../components/context/UserContext";

const Header = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const storedUserData = localStorage.getItem("user");
  const [roomID, setRoomID] = useState("");
  const parsedUserData = JSON.parse(storedUserData);
  const userProfile = parsedUserData?.photoURL;

  const [authenticated] = useContext(UserContext);
  const data = authenticated.user;

  const randomID = (len) => {
    const chars =
      "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleliveBtn = () => {
    const newRoomID = randomID(10);
    setRoomID(newRoomID);
    window.open(`/livestream?roomID=${newRoomID}`);
  };

  return (
    <>
      <div className="bg-customDark p-4 fixed w-full top-0 left-0 right-0 z-10 mb-52">
        <div className="flex flex-row items-center ml-6 justify-between">
          <div className="flex lg:ml-64 ml-1 justify-between items-center">
            {/* <div className="flex md:pl-40 md:ml-20 items-stretch">
              <input
                type="text"
                placeholder="Search here..."
                className="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-none"
              />
              <button className="bg-customPurple text-white font-bold py-2 lg:px-4 px-1 rounded-r-md focus:outline-none">
                <ion-icon name="search-outline" className="text-white"></ion-icon>
              </button>
            </div>  */}
          </div>

          <div className="flex gap-1 items-center">
            <div>
              <button
                className="bg-red-800 text-white flex font-bold px-4 py-2 me-12 rounded"
                onClick={handleliveBtn}
              >
                Go Live
              </button>
            </div>
            <div className="bg-customPurple rounded-full text-white cursor-pointer me-2">
              <MdCircleNotifications onClick={() => setShow(!show)} size={25} />
            </div>
            {/* Notification section */}
            <div
              className={`
                bg-white rounded-md shadow-lg fixed w-full h-auto right-[-100px] mr-24 lg:mr-4 lg:w-[25%] lg:right-[40px] z-1000
                duration-700 ${show ? "top-[80px]" : "top-[-100%]"}`}
            >
              <div className="flex font-semibold justify-between mb-3 px-2">
                <span>Notifications</span>
                <span className="text-customPurple lg:flex cursor-pointer">
                  Mark all as Read
                </span>
              </div>
              <div className="scrollbar-thin text-sm scrollbar-track-white scrollbar-thumb-white max-h-[200px]">
                <NotificationData /> {/* Render NotificationData component */}
              </div>
            </div>
            <div className="bg-customPurple rounded-full text-white cursor-pointer">
              <NavLink to="/dashboard/myaccount">
                <img
                  className="rounded-full w-8 h-8"
                  src={data?.avatar?.url || "/images/Profile.png"}
                  alt="Logo"
                />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
