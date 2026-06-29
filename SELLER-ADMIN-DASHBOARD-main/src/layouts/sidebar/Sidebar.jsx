import { useEffect, useState, useContext } from "react";
import { useRef } from "react";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

// * React icons
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineAppstore } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { BsCartDash } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { MdMenu, MdRateReview, MdOutlineLocalOffer } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { UserContext } from "../../components/context/UserContext";

import { FaCloudUploadAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
const Sidebar = ({ openSidebar }) => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 767px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setAuthenticated] = useContext(UserContext);

  const handleLogout = () => {
    Cookies.remove("tokenx", { path: "/" });
    Cookies.remove("token", { path: "/" });
    setAuthenticated({
      user: null,
      token: null,
      storeStatus: null,
    });
    navigate("/");
  };

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  const subMenusList = [
    {
      name: "Products",
      icon: TbReportAnalytics,
      menus: [
        {
          name: "Bulk Upload ",
          icon: <FaCloudUploadAlt />,
        },
        {
          name: "Category",
          icon: <BiCategory />,
        },
        {
          name: "Commission",
          icon: <FaMoneyCheckAlt />,
        },
        {
          name: "Reviews",
          icon: <MdRateReview />,
        },
      ],
    },
  ];
  const subMenusList2 = [
    {
      name: "Customers",
      icon: TbReportAnalytics,
      menus: [
        // {
        //   name: "Customer Details",
        //   icon: <FaCloudUploadAlt />,
        // },
        // {
        //   name: "Address Types ",
        //   icon: <MdRateReview />,
        // },
      ],
    },
  ];

  return (
    <>
      <div
        className={`h-screen fixed  top-0 left-0 bottom-0 z-10 ${
          openSidebar ? "block" : "hidden"
        } `}
      >
        <div
          className={`md:hidden relative inset-0 max-h-screen z-[998] bg-customDark/50 `}
        ></div>
        <motion.div
          ref={sidebarRef}
          variants={Nav_animation}
          initial={{ x: isTabletMid ? -250 : 0 }}
          animate={openSidebar ? "open" : "closed"}
          className={` bg-customDark text-white z-[999] max-w-[16rem]  w-[16rem] 
          flex fixed 
       h-screen top-0 left-0 bottom-0 ${openSidebar ? "block" : "hidden"} `}
        >
          <div className="flex items-center gap-2.5 font-medium py-3 mx-3">
            <h1
              className={`items-center mx-auto ${
                open ? "mx-auto " : "text-sm font-bold "
              }`}
            >
              LOGO
            </h1>
          </div>

          <div className="flex flex-col  h-full">
            <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-customDark scrollbar-thumb-customDark   md:h-[68%] h-[70%]">
              <li>
                <NavLink
                  to={"/deshboard"}
                  className="link text-base hover:text-gray-100"
                >
                  <AiOutlineAppstore size={23} className="min-w-max" />
                  Dashboard
                </NavLink>
              </li>

              {(open || isTabletMid) && (
                <div>
                  {subMenusList?.map((menu, index) => (
                    <div className="flex flex-col" key={index}>
                      <SubMenu data={menu} key={index} />
                    </div>
                  ))}
                </div>
              )}
              <li>
                <NavLink
                  to={"/orders"}
                  className="link text-base hover:text-gray-100"
                >
                  <BsCartDash size={23} className="min-w-max" />
                  Orders
                </NavLink>
              </li>
              {(open || isTabletMid) && (
                <div>
                  {subMenusList2?.map((menu, index) => (
                    <div className="flex flex-col" key={index}>
                      <SubMenu data={menu} key={index} />
                    </div>
                  ))}
                </div>
              )}
              <li>
                <NavLink
                  to={"/offers"}
                  className="link text-base hover:text-gray-100"
                >
                  <MdOutlineLocalOffer size={23} className="min-w-max" />
                  Offers
                </NavLink>
              </li>
              {/* <li>
            <NavLink to={"/customers"} className="link text-base hover:text-gray-100">
              <BsPeople size={23} className="min-w-max" />
              Customers
            </NavLink>
           </li> */}
            </ul>
            {open && (
              <div className="flex-1 z-50 m-4  my-auto  whitespace-pre font-medium  cursor-pointer">
                <div className="flex text-white bg-customPurple rounded-md p-2 items-center gap-2 justify-start">
                  <svg
                    width="24"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 12C7.5 11.8011 7.57902 11.6103 7.71967 11.4697C7.86032 11.329 8.05109 11.25 8.25 11.25H15V6.375C15 4.875 13.4161 3.75 12 3.75H4.875C4.17904 3.75074 3.51179 4.02755 3.01967 4.51967C2.52755 5.01179 2.25074 5.67904 2.25 6.375V17.625C2.25074 18.321 2.52755 18.9882 3.01967 19.4803C3.51179 19.9725 4.17904 20.2493 4.875 20.25H12.375C13.071 20.2493 13.7382 19.9725 14.2303 19.4803C14.7225 18.9882 14.9993 18.321 15 17.625V12.75H8.25C8.05109 12.75 7.86032 12.671 7.71967 12.5303C7.57902 12.3897 7.5 12.1989 7.5 12ZM21.5302 11.4698L17.7802 7.71984C17.6384 7.58513 17.4495 7.51114 17.254 7.51364C17.0584 7.51614 16.8715 7.59495 16.7332 7.73325C16.5949 7.87155 16.5161 8.0584 16.5136 8.25398C16.5111 8.44955 16.5851 8.63836 16.7198 8.78016L19.1892 11.25H15V12.75H19.1892L16.7198 15.2198C16.6473 15.2888 16.5892 15.3716 16.5492 15.4633C16.5091 15.555 16.4878 15.6539 16.4865 15.754C16.4852 15.8541 16.504 15.9534 16.5417 16.0461C16.5794 16.1389 16.6353 16.2231 16.7061 16.2939C16.7769 16.3647 16.8611 16.4206 16.9539 16.4583C17.0466 16.496 17.1459 16.5148 17.246 16.5135C17.3461 16.5122 17.445 16.4909 17.5367 16.4508C17.6284 16.4108 17.7112 16.3527 17.7802 16.2802L21.5302 12.5302C21.6707 12.3895 21.7497 12.1988 21.7497 12C21.7497 11.8012 21.6707 11.6105 21.5302 11.4698Z"
                      fill="white"
                    />
                  </svg>
                  <button onClick={handleLogout}>Log Out</button>
                </div>
              </div>
            )}
          </div>

          {/* opening and closing arrow */}
          <motion.div
            onClick={() => {
              setOpen(!open);
            }}
            animate={
              open
                ? {
                    x: 0,
                    y: 0,
                    rotate: 0,
                  }
                : {
                    x: -10,
                    y: -200,
                    rotate: 180,
                  }
            }
            transition={{ duration: 0 }}
            className="absolute md:block z-50 hidden right-2 bottom-7 cursor-pointer"
          >
            <IoIosArrowBack size={25} />
          </motion.div>
        </motion.div>

        {/*  menu icon */}
      </div>
    </>
  );
};

export default Sidebar;
