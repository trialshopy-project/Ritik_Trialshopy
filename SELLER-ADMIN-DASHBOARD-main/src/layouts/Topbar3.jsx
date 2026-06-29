import React, { useState } from "react";
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { links } from "./Notificationdata";

// Initialization for ES Users
// import { Ripple, initTE } from "tw-elements";

// initTE({ Ripple });

const Header = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-customDark p-4 fixed w-full top-0 left-0 right-0 z-10">
        <div className="ml-64  flex flex-row items-center justify-between  ">
          <div className=" flex flex-row   justify-between items-center  ">
            <div class="flex lg:items-stretch   ">
              <input
                type="text"
                placeholder="Search here..."
                class=":px-4 lg:px-2 py-2 lg:py-0 rounded-l-md text-xs focus:outline-none   "
              />

              <button className="bg-customPurple text-white font-bold py-2 px-4 rounded-r-md focus:outline-none  ">
                <ion-icon
                  name="search-outline"
                  className="text-white"
                ></ion-icon>
              </button>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="text-white cursor-pointer">
              <MdCircleNotifications onClick={() => setShow(!show)} size={25} />{" "}
            </div>
            {/* notification section starts here */}
            <div
              className={`
      bg-white rounded-md shadow-lg fixed  w-[25%] right-44    z-10    
        duration-700 ${show ? "top-[80px]" : "top-[-100%]"}
        `}
            >
              <div className="flex justify-between mb-3 px-2">
                <span>Notifications</span>
                <span className="text-customPurple">Mark all as Read</span>
              </div>
              <div className="scrollbar-thin text-sm scrollbar-track-white scrollbar-thumb-white max-h-[200px] ">
                {links.map((link) => (
                  <div className="flex justify-between items-center px-3  ">
                    <div className="flex gap-2 items-center">
                      <img
                        src={link.image}
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

            <div>
              <button className="flex cursor-pointer rounded-md font-semibold bg-white p-2 text-sm items-center px-4 gap-3 focus:outline-none  ">
                <FaUserAlt className="scale-100  " />
                My Account
              </button>
              {/* <FaUserCircle size={22} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
