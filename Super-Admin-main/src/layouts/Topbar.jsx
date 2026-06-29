import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { links } from "./Notificationdata";

// Initialization for ES Users
// import { Ripple, initTE } from "tw-elements";

// initTE({ Ripple });

const Header = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const storedUserData = localStorage.getItem("user");

  const parsedUserData = JSON.parse(storedUserData);
  const userProfile = parsedUserData?.photoURL;
  return (
    <>
      <div className="bg-customGray w-[calc(100vw-256px)]  p-2 fixed sm:gap-x-2  top-0 left-64 right-0 z-10">
        <div className=" flex items-center  justify-between ml-64">
          <div className="flex ml-1 justify-start items-start">
            <div class="flex items-start justify-start ">
              <input
                type="text"
                placeholder="Search here..."
                class="sm:px-4 px-2 sm:py-2 py-0 rounded-l-md focus:outline-none"
              />
              <button className="bg-customPurple  text-white font-bold py-2 lg:px-4 px-1 rounded-r-md  focus:outline-none  ">
                <ion-icon
                  name="search-outline"
                  className="text-white"
                ></ion-icon>
              </button>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <div className="bg-customPurple rounded-full text-white cursor-pointer">
              <MdCircleNotifications onClick={() => setShow(!show)} size={25} />{" "}
            </div>
            {/* notification section starts here */}
            <div
              className={`
              bg-white rounded-md shadow-lg fixed w-full h-auto right-[-100px] mr-24 lg:mr-4 lg:w-[25%] lg:right-[40px] z-1000    
                duration-700 ${show ? "top-[80px]" : "top-[-100%]"}`}
            >
              <div className="flex font-semibold justify-between mb-3 px-2">
                <span>Notifications</span>
                <span className="text-customPurple  lg:flex cursor-pointer">
                  Mark all as Read
                </span>
              </div>
              <div className="scrollbar-thin text-sm scrollbar-track-white   scrollbar-thumb-white max-h-[200px] ">
                {links.map((link) => (
                  <div className="flex justify-between lg:gap-x-4  items-center lg:px-3 px-2 ">
                    <div className="flex lg:gap-2 gap-1 items-center">
                      <img
                        src={userProfile}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h2>{link.heading}</h2>
                        <p>{link.content}</p>
                      </div>
                    </div>
                    <div className="">
                      <h3>{link.time}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className={`bg-customPurple me-5 rounded-full text-white cursor-pointer`}
            >
              <NavLink to="/myaccount">
                <FaUserCircle size={20} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
