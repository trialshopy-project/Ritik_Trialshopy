import React, { useContext, useEffect, useState } from "react";
import { Carousel, IconButton } from "@material-tailwind/react";
import Link from "next/link";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import sellingImage from "../images/Selling.svg";

import sellingImage2 from "../images/seller2.jpg";
import mall2 from "../images/mall2.jpg";
import mall3 from "../images/mall3.jpg";
import pvr from "../images/pvr.jpg";
import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { UserContext } from "../components/context/UserContext";
// let categories = ["Laptop", "Mobile", "Clothes", "Shoes"];
// const socket = io(import.meta.env.VITE_API_ENDPOINT);

let categories = [
  "Sell Online",
  "How it works",
  "pricing & commission",
  "Grow Business",
  "Don't have Gst?",
];

const categoryPaths = {
  "Sell Online": "/sell-online",
  "How it works": "/how-it-works",
  "pricing & commission": "/pricing-commission",
  "Grow Business": "/grow-business",
  "Don't have Gst?": "/no-gst",
};

const HomePage = () => {
  const [authenticated] = useContext(UserContext);
  const sellerPresent = authenticated?.user?._id;

  const [email, setEmail] = useState("");
  const [liveStreams, setLiveStreams] = useState([]);

  // useEffect(() => {
  //   // Fetch live streams from the server
  //   socket.emit("getLiveStreams");

  //   // Listen for live streams data from the server
  //   socket.on("liveStreamsData", (data) => {
  //     // Use a Set to ensure no duplicates
  //     const uniqueStreams = Array.from(
  //       new Set(data.map((stream) => stream.links[0].url))
  //     ).map((url) => data.find((stream) => stream.links[0].url === url));
  //     setLiveStreams(uniqueStreams);
  //   });

  //   return () => {
  //     socket.off("liveStreamsData");
  //   };
  // }, []);

  const navigate = useNavigate();

  // if (!sellerPresent) {
  //   navigate("/");
  // }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // console.log(email);
  };
const [load,setload]=useState(false);

  const handleButtonClick = () => {
    setload(true);
    try{
      navigate("/account/become-seller-growth");
      localStorage.setItem("sellerEmail", email);
    }catch(e){
      console.log(e);
    }
    finally{
      setload(false)
    }
   
  };
  
  

  const handleLoginBtn = () => {
    navigate("/become-seller/sellerlogin");
  };

  const handleNavigation = (category) => {
    const path = categoryPaths[category];
    if (path) {
      navigate(path);
    }
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="bg-gray-800 px-4 xl:px-[100px] flex items-center justify-between h-full lg:w-full w-screen text-white">
          <div className="hidden lg:flex lg:whitespace-nowrap xl:ml-9 flex-row h-full items-center justify-start text-center gap-4 font-poppins">
            {categories.map((category) => (
              <div
                key={category}
                className="h-full flex flex-col items-center justify-center py-4"
                onClick={() => handleNavigation(category)}
              >
                <div className="flex items-center justify-start text-white uppercase duration-200 cursor-pointer">
                  <p className="lg:text-xs xl:text-sm xl:whitespace-nowrap">
                    {category}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:text-xs xl:text-sm flex flex-row gap-4 w-full lg:w-auto justify-between items-center h-full xl:whitespace-nowrap">
            <Link
              href="/nearByStore"
              className="flex items-center justify-start gap-1 text-white uppercase duration-200 cursor-pointer py-4 h-full hover:underline"
            >
              Nearby Stores
            </Link>
            <div className="flex items-center justify-start gap-1 text-white uppercase duration-200 cursor-pointer lg:hidden">
              <p>Categories</p>
              <MdOutlineKeyboardArrowDown
                size={19}
                className="bg-customPurple transition-all duration-200 rotate-180"
              />
            </div>

            <button
              className="bg-customPurple text-white flex font-bold rounded-lg px-4 py-2"
              onClick={handleLoginBtn}
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="pt-[60px]">
        {" "}
        {/* Adjust this padding to the height of the fixed navbar */}
        <div className="sm:flex flex-row w-full h-full  bg-no-repeat lg:px-2 items-center justify-center">
          <div className=" justify-center px-2.5 lg:left-0 ml-1 flex lg:flex flex-col w-full lg:px-[5vw] pt-[5vh] ">
            <div className="lg:p-4 p-8 mx-4 bg-white shadow-xl  rounded-xl">
              <div className="mb-4 font-medium sm:text-2xl text-xl text-center">
                Trialshopy-Empowering Local Businesses.
              </div>
              <div className="sm:text-[18px] text-[14px] my-2 mb-4">
                At Trialshopy, we bridge the gap between large-scale
                manufacturers and small-scale owners, bringing you a curated
                selection of high-quality products at competitive prices. Our
                mission is to empower local businesses and entrepreneurs by
                providing them with the resources they need to thrive. Starting
                in Bihar, we are committed to creating a robust marketplace that
                connects businesses across India. As we grow, our goal is to
                expand our reach, fostering a vibrant ecosystem where every
                business, big or small, can flourish.
              </div>
              <form onSubmit={handleButtonClick} >
              <div className="flex flex-row border-gray-400 placeholder:text-[#667086] placeholder:text-[16px] py-1 mt-2 rounded-[5px]">
                <input
                  type="name"
                  placeholder="Enter Email Id"
                  value={email}
                  className="w-full p-2 px-6 py-1 rounded placeholder:text-[#667086] autofocus border-4"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                className="w-full mt-3 rounded-[10px] py-[8px] px-[16px] font-fontMedium text-white bg-[#F19305] mb-4 font-medium"
                type="submit"
                disabled={load}
              >
               {
                load?'loading....':'start selling'
               }
              </button>
              </form>
            </div>
          </div>
          <div
            className=" lg:flex  sm:bg-none"
            style={{
              backgroundImage: `url('Images/Selling.svg')`,
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              width={1000}
              alt="="
              height={1000}
              src={sellingImage}
              className="lg:max-h-[100px] h-[500px] lg:min-h-screen"
            />
          </div>
        </div>
        {/* ... rest of your code */}
        {/* 2nd part */}
        <div className="w-full h-full ">
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 md:px-16 pl-2 py-4 bg-gray-800 text-white justify-evenly items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="text-[32px] mb-4 font-semibold">7 Hundred+</div>
              <div className="text-[13px] font-semibold pb-2">
                Trust Trialshopy to sell online
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-[32px] mb-4 font-semibold">1 Thousand+</div>
              <div className="text-[13px] font-semibold pb-2">
                Customers buying across India
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-[32px] mb-4 font-semibold">1 Thousand+</div>
              <div className="text-[13px] font-semibold pb-2">
                Customers buying across India
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-[32px] mb-4 font-semibold">700+</div>
              <div className="text-[13px] font-semibold pb-2">
                Categories to sell online
              </div>
            </div>
          </div>
        </div>
        {/* 3rd part */}
        <div>
          <div className="flex flex-col lg:flex-row w-full h-full px-3 py-16 md:px-16 justify-center items-center ">
            <div className="w-full px-6 lg:w-1/2">
              <div className="flex flex-col items-start px-3  justify-start bg-gray-800 text-white  mb-6 p-5 rounded-md">
                <div className="pb-6">
                  <div className="text-md font-semibold mb-5">
                    Broad Customer Base
                  </div>
                  <div className="text-sm">
                    Access a vast network of buyers who are actively seeking
                    quality products at competitive prices.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start  justify-start px-3 bg-gray-800 text-white  mb-6 p-5 rounded-md">
                <div className="pb-6">
                  <div className="text-md font-semibold mb-5  ">
                    Seamless Onboarding:
                  </div>
                  <div className="text-sm">
                    Our easy-to-use platform and dedicated support team make the
                    onboarding process quick and hassle-free, allowing you to
                    start selling right away.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start  justify-start px-3 bg-gray-800 text-white  mb-6 p-5 rounded-md">
                <div className="pb-6 mb-4">
                  <div className="text-md font-semibold mb-5 ">
                    Growth for Every Supplier
                  </div>
                  <div className="text-sm">
                    From small to large and unbranded to branded, and now open
                    for Sellers who do not have a Regular GSTIN too, we fuels
                    growth for all suppliers.
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start  justify-start px-3 bg-gray-800 text-white p-5 rounded-md ">
                <div className="pb-6">
                  <div className="text-md font-semibold mb-5 ">
                    Marketing Support:
                  </div>
                  <div className="text-sm list-decimal">
                    <li>Easy Product Listing</li>
                    <li>Lowest Cost Shipping</li>
                    <li>7-Day Payment Cycle from the delivery date</li>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full hidden sm:flex md:flex lg:flex px-8 py-4 md:py-1 md:mt-5 md:w-[70%] xl:w-1/2 justify-evenly ">
              <div className="flex flex-col items-center justify-evenly w-full h-full">
                <div className="grid mx-auto bg-gray-800 rounded-2xl ">
                  <div className="sm:w-auto h-auto w-full">
                    <img
                      src={pvr}
                      width={500}
                      height={350}
                      alt="shop"
                      className="w-full h-auto rounded-t-2xl"
                    />
                  </div>
                  <div className="text-[24px] font-fontMedium pb-3 text-white text-center pt-3 ">
                    Why Suppliers Love Trialshopy
                  </div>
                  <div className="text-[18px] text-white p-4">
                    All the benefits that come with selling are designed to help
                    you sell more, and make it easier to grow your business.
                  </div>

                  <div className="sm:w-auto w-full h-auto flex justify-center items-center pt-4">
                    <Carousel
                      className="flex flex-row gap-7 ml-7 mr-7 overflow-hidden flex-nowrap mb-3"
                      transition={{ duration: 1 }}
                      autoplay={false}
                      loop={true}
                    >
                      {/* prevArrow */}
                      {({ handlePrev }) => (
                        <IconButton
                          variant="text"
                          color="white"
                          size="lg"
                          onClick={handlePrev}
                          className="!absolute top-2/4 left-4 -translate-y-2/4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </IconButton>
                      )}

                      {/* nextArrow */}
                      {({ handleNext }) => (
                        <IconButton
                          variant="text"
                          color="white"
                          size="lg"
                          onClick={handleNext}
                          className="!absolute top-2/4 right-4 -translate-y-2/4"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </IconButton>
                      )}
                        {/* <div className="flex flex-row justify-center items-center gap-7 overflow-hidden h-full w-full"> */}
                      {/* Carousel Items */}
                      <div className="relative w-full h-full basis-1 ">
                        <img
                          src={mall3}
                          alt="image 1"
                          className="object-cover w-[1000] h-[1000] "
                          
                        />
                        <div className="absolute inset-0 grid w-full h-full"></div>
                      </div>
                      <div className="relative w-full h-full ">
                        <img
                          src={mall2}
                          alt="image 2"
                          className="object-cover w-full h-full "
                          
                        />
                      </div>
                      <div className="relative w-full h-full ">
                        <img
                          src={sellingImage2}
                          alt="image 3"
                          className="object-cover w-full h-full "
                         
                        />
                      </div>
                      {/* Add more carousel items as needed */}
                      {/* </div> */}
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 4th part */}
        <div className="w-full h-full lg:px-[25vw] sm:px-[15vw] px-4 pb-6">
          <div className="flex flex-col items-center justify-center ">
            <div className="text-3xl font-semibold text-start">How its works?</div>
            <div className="text-xl text-center">
              All the benefits that come with selling on Trialshopy are designed
              to help you sell more, and make it easier to grow your business.
            </div>
            {/* <div className="text-[16px]"> </div> */}
          </div>
        </div>
        {/* 5th part */}
        <div className="w-full h-full py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:px-16 lg:grid-cols-5 pl-2 py-4  bg-gray-800 text-white justify-evenly items-start">
            <div className="flex flex-col gap-1 justify-center items-start p-4">
              <div className="text-[32px]  ">01</div>
              <div className="text-3xl font-semibold">Create Account</div>
              <div className="text-[13px] font-semibold ">
                All you need is :
              </div>
              <div className="text-[13px] font-semibold">
                GSTIN (for GST sellers) / Enrolment ID / UIN (for non-GST
                sellers)
              </div>
              <div className="text-[13px] font-semibold pb-2">Bank Account</div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start p-4">
              <div className="text-[32px]">02</div>
              <div className="text-2xl font-semibold ">List Products</div>
              <div className="text-[13px] font-semibold pb-2">
                List the products you want to sell in your supplier panel
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start p-4">
              <div className="text-[32px]">03</div>
              <div className="text-2xl font-semibold ">Get Orders</div>
              <div className="text-[13px] font-semibold pb-2">
                start getting orders from crores of Indians actively shopping on
                our platform.
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start p-4">
              <div className="text-[32px]">04</div>
              <div className="text-2xl font-semibold ">
                Lowest Cost Shipping
              </div>
              <div className="text-[13px] font-semibold pb-2">
                Products are shipped to customers at lowest costs
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-center items-start p-4">
              <div className="text-[32px]">05</div>
              <div className="text-2xl font-semibold ">
                Lowest Cost Shipping
              </div>
              <div className="text-[13px] font-semibold pb-2">
                Payments are deposited directly to your bank account following a
                7-day payment cycle from order delivery.
              </div>
            </div>
          </div>
        </div>
        {/* 6th part */}
        <div>
          <div>
            <div className="flex justify-center 24px font-fontMedium font-semibold ">
              Popular Categories to Sell Online
            </div>
            <div className="grid lg:grid-cols-4 text-[18px] px-16 py-2 font-fontRegular sm:grid-cols-2 grid-cols justify-evenly items-center gap-5">
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Sarees Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Jwellery Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell T-shirts Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Shirts Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Watches Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Electronics Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Clothes Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Scocks Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Sarees Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Jwellery Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell T-shirts Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Shirts Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Watches Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Electronics Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Clothes Online</div>
              <div className="py-2 ring-1 ring-[#F19305] hover:bg-[#F19305] text-center cursor-pointer hover:scale-105 transition ease-linear hover:text-white rounded-md p-3 font-semibold">Sell Scocks Online</div>
            </div>
            <div className="flex justify-center w-full mt-4 ">
              <a href="/account/Become-sheller-growth">
                {" "}
                <button className="w-full rounded-[10px]   py-[10px] px-[16px] font-fontMedium text-white bg-[#F19305] mb-4 font-medium">
                  View more category
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 m-4">
        {/* <h1 className="text-center text-3xl font-bold">Live Streams</h1> */}
        {liveStreams.length > 0 ? (
          <ul>
            {liveStreams.map((stream, index) => (
              <li key={index}>
                <a href={stream.links[0].url} target="_blank">
                  {stream.sellerId} is live - Join here
                </a>
              </li>
            ))}
          </ul>
        ) : (
          // <p className="bg-black opacity-45 text-white p-4 m-4 w-full font-bold text-3xl text-center items-center place-content-center h-[50vh] ring-2 ring-rose-500 border border-black animate-pulse">No seller is live yet....</p>
          <>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
