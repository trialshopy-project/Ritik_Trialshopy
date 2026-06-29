import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import SubMenu from "./SubMenu";
import ogo from "../../../src/images/Logo.jpg";
import { motion } from "framer-motion";
import { MdOutlineLocalOffer } from "react-icons/md";
import Cookies from "js-cookie";
// * React icons
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore, AiOutlineInfoCircle } from "react-icons/ai";
import { BiCategory, BiGlobe } from "react-icons/bi";
import { BsCartDash, BsPeople, BsInfoCircleFill } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { RiBuilding3Line, RiGovernmentFill } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";

import {
  MdMenu,
  MdBusiness,
  MdCategory,
  MdRateReview,
  MdPayments,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import {
  FaCity,
  FaCloudUploadAlt,
  FaMoneyCheckAlt,
  FaRegAddressCard,
} from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";
import { IoImagesOutline } from "react-icons/io5";
const Sidebar = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 767px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [authenticated, setAuthenticated] = useContext(UserContext);

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setAuthenticated({
      user: {},
      token: null,
    });
    Cookies.remove("tokenx");
    Cookies.remove("token");
    navigate("/admin/login");
    console.log(authenticated, "sayuam bhai");
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
      name: "Orders",
      icon: BsCartDash,
      menus: [
        {
          name: "Details",
          icon: <AiOutlineInfoCircle />,
        },
      ],
    },
  ];

  const subMenusList2 = [
    {
      name: "Merchant",
      icon: MdBusiness,
      menus: [
        {
          name: "Commission",
          icon: <FaMoneyCheckAlt />,
        },
        {
          name: "Payments",
          icon: <MdPayments />,
        },
      ],
    },
    {
      name: "Products",
      icon: TbReportAnalytics,
      menus: [
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
    {
      name: "Customers",
      icon: TbReportAnalytics,
    },
  ];


  const subMenusList3 = [
    {
      name: "Notifications",
      icon: BsInfoCircleFill,
      menus: [
        {
          name: "Send Notification",
          icon: <AiOutlineInfoCircle />,
          link: "/admin/notifications",
        },
      ],
    },
  ];

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden lg:sticky top-0  inset-0 max-h-screen z-[998] bg-black/50 ${open ? "block" : "hidden"
          }`}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-customGray text-white shadow-lg  max-w-[16rem] w-[16rem] overflow-hidden md:relative fixed h-screen z-40"
      >
        <div className="flex items-center gap-2.5  sticky top-0 font-medium border-b py-3  bg-customGray mx-3">
          <h1
            className={`items-center mx-auto ${open ? "mx-auto" : "text-sm font-bold"
              }`}
          >
            <img
              className="rounded-full shadow-lg"
              src={ogo}
              alt="My Image"
              style={{ width: "40px", height: "auto" }}
            />
            <h3 className="text-l font-bold">TRIALSHOPY</h3>
          </h1>
        </div>

        <div className="flex flex-col h-full bg-customGray">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden">
            <li>
              <NavLink
                to="/"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <AiOutlineAppstore size={23} className="min-w-max" />
                Dashboard
              </NavLink>
            </li>

            {(open || isTabletMid) && (
              <div className="">
                {subMenusList.map((menu) => (
                  <SubMenu data={menu} key={menu.name} />
                ))}
              </div>
            )}

            <li>
              <NavLink
                to="/offers"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <MdOutlineLocalOffer size={23} className="min-w-max" />
                Offers
              </NavLink>
            </li>

            {(open || isTabletMid) && (
              <div className="pb-5">
                {subMenusList2.map((menu) => (
                  <SubMenu data={menu} key={menu.name} />
                ))}
              </div>
            )}

            <li>
              <NavLink
                to="/notifications"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <BsInfoCircleFill size={23} className="min-w-max" />
                Notifications
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ticket"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <BsInfoCircleFill size={23} className="min-w-max" />
                Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/banner"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <IoImagesOutline size={23} className="min-w-max" />
                Banners
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/domain"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <IoImagesOutline size={23} className="min-w-max" />
                Domains
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/coupons"
                className="link shadow-lg text-base hover:bg-slate-200 hover:text-white hover:border-r"
              >
                <MdOutlineLocalOffer size={23} className="min-w-max" />
                Coupons
              </NavLink>
            </li>
          </ul>

          {open && (
            <div
              onClick={handleLogout}
              className="text-sm z-50 whitespace-pre font-medium cursor-pointer"
            >
              <div className="flex p-4 shadow-lg items-center gap-6 justify-center text-base hover:border-r hover:border-r-slate-200">
                <FiLogOut />
                <p>Log Out</p>
              </div>
            </div>
          )}
        </div>


        <motion.div
          onClick={() => {
            localStorage.setItem("open", true);
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
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>

      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>
    </div>
  );
};

export default Sidebar;
