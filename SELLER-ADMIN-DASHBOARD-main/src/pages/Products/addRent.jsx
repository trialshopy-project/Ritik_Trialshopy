import React, { useContext, useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../layouts/Topbar";
import Basic_info from "./Addeditproductfiles/Basic_info";

import Shipping_Basic_info from "./Addeditproductfiles/Shipping_Basic_info";
import Inventory_Basic_info from "./Addeditproductfiles/Inventory_Basic_info";
import Pictures_Basic_info from "./Addeditproductfiles/Pictures_Basic_info";
import Seo_Basic_info from "./Addeditproductfiles/Seo_Basic_info";
import ProductAttributesBasic_info from "./Addeditproductfiles/ProductAttributesBasic_info";
import Prices_info from "./Addeditproductfiles/Prices_info";
import {
  AiOutlineCamera,
  AiOutlineClose,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdOutlineInventory, MdOutlineLocalShipping } from "react-icons/md";
import { TbSeo } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import { RiProductHuntLine } from "react-icons/ri";
import { UserContext } from "../../components/context/UserContext";
import CategorySelector from "../../components/page/FetchCategory";
// import { ColorPicker, useColor } from "react-color-palette";
// import "react-color-palette/css";
import { RiArrowRightSLine } from "react-icons/ri";

// import AddVariant from "./Addeditproductfiles/AddVariant";

const AddRent = () => {
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const navigate = useNavigate();

  //for Basic info
  const [productName, setProductName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [status, setStatus] = useState("");
  const [tags, setTags] = useState("");
  const [shortDescription, setShort] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sku, setSku] = useState("");
  const [fullDescription, setfullDescription] = useState("");
  const [showonhome, setShowonhome] = useState(false);
  const [marknew, setMarknew] = useState(false);
  const [reviewallow, setReviewallow] = useState(false);

  const [data, setData] = useState([]);
  const [active_categories,setactive_categories]=useState('')

  //for inventary
  // const [inventoryMethod, setInventoryMethod] = useState("");
  // const [warehouse, setWarehouse] = useState("");
  const [inStock, setInStock] = useState(false);
  const [stock, setStock] = useState("");
  const [orderMinQuantity, setOrderMinQuantity] = useState("");
  const [orderMaxQuantity, setOrderMaxQuantity] = useState("");

  //for price
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [isDiscountAllowed, setIsDiscountAllowed] = useState(false);
  const [discount, setDiscount] = useState("");

  //for shipping info

  const [shippingCharges, setShippingCharges] = useState("");
  const [shippingType, setshippingType] = useState("Free Shipping");

  //for seo basic
  const [metaTitle, setMetaTitle] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  //product attirbute basic
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [priceAdjustmentTypes, setPriceAdjustmentTypes] = useState([]);
  const [selectedPriceAdjustmentType, setSelectedPriceAdjustmentType] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [variants, setVariants] = useState([]);

  const [loading, setLoading] = useState(false);

  //set color product

  // const [color, setColor] = useColor("#561ecb");

  const [imageLoader,setimageLoader]=useState(false)

  // console.log(color, "changing");
  console.log(variants, "variants");

  //state for selected category

  const [selectedCategoryId, setSelecteCategoryId] = useState("");
  
  const handleProductAdd = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
    `${import.meta.env.VITE_API_ENDPOINT}/api/add_products/add/${sellerId}?Rent=${true}`,
        {
          globalformData: globalformData,
          sellerId: sellerId
        },
        
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      {
        console.log(globalformData)
      }
      if (response.data.success) {
        setLoading(false);
        toast.success("Product Created Successfully");
        navigate("/products/Upload for Rent");
      }
      console.log(response);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error fetching image data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState(1);
  const [images, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);
  const handleRemoveImage = (index) => {
    console.log(index)
    setUploadedImages((prevData) => {
      const newData = { ...prevData };
      delete newData[index];
      return newData;
    });
      setglobalFormData((prevdata) => {
        const newData = { ...prevdata };
      delete newData[index];
      return newData;
      });
    };

  const [globalformData,setglobalFormData]=useState({})

  const handleClick = () => {
    fileInputRef.current.click();
  };

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
  setimageLoader(true)
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageBlob = reader.result;
        const uploadedUrl = await responseData(imageBlob);
        setUrl(uploadedUrl);
  
        setglobalFormData((prevData) => ({
          ...prevData,
          [trackImageIndex]: {
            ...prevData[trackImageIndex],
            productImage: [uploadedUrl],
          },
        }));

        setUploadedImages((prevData) => [
          ...prevData,
          uploadedUrl?.url
        ]);
        setimageLoader(false)
      }
    };
  
    reader.readAsDataURL(file);
  };

  //track image index to dynamically render the image compo
  const [trackImageIndex,settrackImageIndex]=useState(0)
  function handleChangeIndexClick(index){
      settrackImageIndex(index)
  }

  return (
    <div className="flex mt-14 w-screen lg:w-full lg:h-full h-screen ">
      <Topbar />

      <div className=" flex flex-col w-full mt-5">

        <div className="flex flex-col justify-start items-start bg-white w-full rounded-xl p-4 mt-4 shadow-md">

        <div className="flex items-center justify-between lg:ml-2 lg:w-full w-full">
          <div className="font-bold pl-1 m-5 flex text-lg justify-start items-start flex-row ">
            
            <svg
              className="mr-2"
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.75006 13.4167V11.0833H19.2501V13.4167H8.75006ZM4.66673 3.5C4.1531 3.50002 3.65383 3.66952 3.24635 3.9822C2.83887 4.29489 2.54594 4.73329 2.41301 5.22941C2.28007 5.72554 2.31454 6.25167 2.51109 6.7262C2.70763 7.20074 3.05526 7.59716 3.50006 7.854V23.625C3.50006 24.108 3.89206 24.5 4.37506 24.5H7.00006V18.375C7.00006 18.1429 7.09225 17.9204 7.25634 17.7563C7.42044 17.5922 7.643 17.5 7.87506 17.5H12.5417C12.7738 17.5 12.9964 17.5922 13.1604 17.7563C13.3245 17.9204 13.4167 18.1429 13.4167 18.375V24.5H23.6251C23.8571 24.5 24.0797 24.4078 24.2438 24.2437C24.4079 24.0796 24.5001 23.8571 24.5001 23.625V7.854C24.9449 7.59716 25.2925 7.20074 25.489 6.7262C25.6856 6.25167 25.7201 5.72554 25.5871 5.22941C25.4542 4.73329 25.1613 4.29489 24.7538 3.9822C24.3463 3.66952 23.847 3.50002 23.3334 3.5H4.66673ZM4.08339 5.83333C4.08339 5.67862 4.14485 5.53025 4.25425 5.42085C4.36365 5.31146 4.51202 5.25 4.66673 5.25H23.3334C23.4881 5.25 23.6365 5.31146 23.7459 5.42085C23.8553 5.53025 23.9167 5.67862 23.9167 5.83333C23.9167 5.98804 23.8553 6.13642 23.7459 6.24581C23.6365 6.35521 23.4881 6.41667 23.3334 6.41667H4.66673C4.51202 6.41667 4.36365 6.35521 4.25425 6.24581C4.14485 6.13642 4.08339 5.98804 4.08339 5.83333ZM7.87506 9.33333H20.1251C20.3571 9.33333 20.5797 9.42552 20.7438 9.58962C20.9079 9.75371 21.0001 9.97627 21.0001 10.2083V14.2917C21.0001 14.5237 20.9079 14.7463 20.7438 14.9104C20.5797 15.0745 20.3571 15.1667 20.1251 15.1667H7.87506C7.643 15.1667 7.42044 15.0745 7.25634 14.9104C7.09225 14.7463 7.00006 14.5237 7.00006 14.2917V10.2083C7.00006 9.97627 7.09225 9.75371 7.25634 9.58962C7.42044 9.42552 7.643 9.33333 7.87506 9.33333ZM17.2084 17.5H20.1251C20.3571 17.5 20.5797 17.5922 20.7438 17.7563C20.9079 17.9204 21.0001 18.1429 21.0001 18.375V21.2917C21.0001 21.5237 20.9079 21.7463 20.7438 21.9104C20.5797 22.0745 20.3571 22.1667 20.1251 22.1667H17.2084C16.9763 22.1667 16.7538 22.0745 16.5897 21.9104C16.4256 21.7463 16.3334 21.5237 16.3334 21.2917V18.375C16.3334 18.1429 16.4256 17.9204 16.5897 17.7563C16.7538 17.5922 16.9763 17.5 17.2084 17.5ZM11.6667 19.25V24.5H8.75006V19.25H11.6667Z"
                fill="#27272A"
              />
            </svg><span className="font-bold">Give for Rent</span><RiArrowRightSLine className="text-center justify-center items-center w-7 h-7" />
            <button className="text-[13px] text-gray-400 ml-2">Add For Rent</button>
          </div>

          {/* Close */}
          <div className="flex mr-4">
            <div
              className="flex items-stretch my-4 focus:bg-gray-900"
              onClick={() => {
                navigate("../products");
              }}
            >
              <button className="hidden sm:flex bg-customPurple py-2 text-white text-md items-center lg:px-4 ml-8 rounded-full focus:outline-none px-7  ">
                <AiOutlineClose className="mr-2 lg:scale-125 border scale-90 bg-white rounded-full fill-gray-900" />
                Close
              </button>
            </div>
          </div>
        </div>
        </div>
        {activeTab === 1 && (
          <div className="flex items-center justify-evenly">
            <CategorySelector
            setUploadedImages={setUploadedImages}
              setActiveTab={setActiveTab}
              setSelecteCategoryId={setSelecteCategoryId}
              setactive_categories={setactive_categories}
            />
          </div>
        )}
        {activeTab === 2 && (
          <>
          <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
          {
             <div className="mt-6 flex flex-row gap-6 drop-shadow-md p-3 bg-white min-h-36 max-h-52 shadow-lg rounded-md overflow-x-scroll mx-4">
             {images.map((image, index) => (
               <div
                 key={index}
                 className={`relative flex-shrink-0 ${
                   trackImageIndex === index
                     ? 'border-customPurple border-t-8 ring-1 ring-customPurple bg-customPurple rounded-md'
                     : ''
                 }`}
               >
                 <img
                  //  src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                  src={image}
                   alt="Uploaded image"
                   className="rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                   onClick={() => handleChangeIndexClick(index)}
                   width={100}
                   height={100}
                 />
                 {/* <button
                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                   onClick={() => handleRemoveImage(index)}
                 >
                   X
                 </button> */}
               </div>
             ))}
             { imageLoader ? 'loading ....':(images.length < 50 && (
               <div
                 className="flex-shrink-0 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 w-24"
               >
                 <button className="text-gray-500 text-2xl" onClick={handleClick}>
                   +
                 </button>
               </div>
             ))}
           </div>
           
          }

          { images.map((image,index)=>(
               <div key={index}>
               {
                trackImageIndex===index ?(
                    <div className="flex flex-row w-full justify-evenly items-center">     
                      <div>
                    <Basic_info
                    index={index}
                    globalformData={globalformData}
                    setglobalFormData={setglobalFormData}
                    active_categories={active_categories}
                    data={data}
                    productName={productName}
                    setProductName={setProductName}
                    manufacturers={manufacturer}
                    setManufacturers={setManufacturer}
                    status={status}
                    setStatus={setStatus}
                    tags={tags}
                    setTags={setTags}
                    shortDescription={shortDescription}
                    setShort={setShort}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    sku={sku}
                    setSku={setSku}
                    fullDescription={fullDescription}
                    setfullDescription={setfullDescription}
                    showonhome={showonhome}
                    setShowonhome={setShowonhome}
                    marknew={marknew}
                    setMarknew={setMarknew}
                    reviewallow={reviewallow}
                    setReviewallow={setReviewallow}
                    uploadedImages={images}
                    forRent={true}
                  />
                  <div className="flex flex-row justify-between gap-7 w-full">
                  </div>
              </div>
                    </div>
                ):''
               }
               
               </div>
     
          ))}
            <div className="flex items-stretch m-6 gap-2 rounded-md cursor-pointer justify-end">
              <button
                onClick={() => setActiveTab(1)}
                className="flex  bg-customDark rounded-full text-white items-center px-4 py-1 gap-2 focus:outline-none mb-8"
              >
                Back
                {/* <ion-icon name="send" className="text-white "></ion-icon> */}
              </button>
              <button
                onClick={handleProductAdd}
                className="flex  bg-customPurple rounded-full text-white items-center px-4 py-1 gap-2 focus:outline-none mb-8"
              >
                {loading ? "Please wait..." : "Add Product"}
                <ion-icon name="send" className="text-white "></ion-icon>
              </button>
            </div>
            
          </>
        )}
      </div>
    </div>
  );
};

export default AddRent;
