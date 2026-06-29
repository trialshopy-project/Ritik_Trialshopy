import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Topbar2 from "../../layouts/Topbar2";

import Basic_info from "./Addeditproductfiles/Basic_info";
import Shipping_Basic_info from "./Addeditproductfiles/Shipping_Basic_info";
import Inventory_Basic_info from "./Addeditproductfiles/Inventory_Basic_info";
import Pictures_Basic_info from "./Addeditproductfiles/Pictures_Basic_info";
import Seo_Basic_info from "./Addeditproductfiles/Seo_Basic_info";
import ProductAttributesBasic_info from "./Addeditproductfiles/ProductAttributesBasic_info";
import Prices_info from "./Addeditproductfiles/Prices_info";
import { BsPeopleFill } from "react-icons/bs";
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
import Pictures_Basic_info1 from "./Addeditproductfiles/Picture_Basic_info1";
import CategorySelector from "../../components/common/FetchCategory";
// import CategorySelector from "../../components/page/FetchCategory";
const Editproducts = () => {
  const [searchParams] = useSearchParams();
  const [productData, setProductData] = useState([]);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const productId = searchParams.get("productId");
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`
      );
      console.log("jjj", response.data.products);
      setProductData(response.data.products);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      setIsLoading(false);
    }
  };

  const [data, setData] = useState(productData.categories || []);

  //for Basic info
  const [productName, setProductName] = useState(productData.productName || "");
  const [manufacturer, setManufacturer] = useState(
    productData.manufacturer || ""
  );

  const [status, setStatus] = useState(productData.status || "");

  const [tags, setTags] = useState(productData.tags || "");
  const [shortDescription, setShort] = useState(
    productData.shortDescription || ""
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(
    formatDate(productData.manufactureDate) || ""
  );
  const [endDate, setEndDate] = useState(
    formatDate(productData.expireDate) || ""
  );
  const [sku, setSku] = useState(productData.sku || "");
  const [fullDescription, setfullDescription] = useState(
    productData.fullDescription || ""
  );
  const [showonhome, setShowonhome] = useState(productData.showonhome || false);
  const [marknew, setMarknew] = useState(productData.marknew || false);
  const [reviewallow, setReviewallow] = useState(
    productData.reviewallow || false
  );

  useEffect(() => {
    setProductName(productData.productName || "");
    setManufacturer(productData.manufacturer || "");
    setStatus(productData.status || "");
    setTags(productData.tags || "");
    setShort(productData.shortDescription || "");
    setStartDate(formatDate(productData.manufactureDate) || "");
    setEndDate(formatDate(productData.expireDate) || "");
    setSku(productData.sku || "");
    setfullDescription(productData.fullDescription || "");
    setShowonhome(productData.showonhome || false);
    setMarknew(productData.marknew || false);
    setReviewallow(productData.reviewallow || false);
  }, [productData]);

  //for inventary
  // const [inventoryMethod, setInventoryMethod] = useState(
  //   productData.inventoryMethod || ""
  // );
  // const [warehouse, setWarehouse] = useState(productData.warehouse || "");
  const [inStock, setInStock] = useState(productData.inStock || false);
  const [stock, setStock] = useState(productData.stock || "");
  const [orderMinQuantity, setOrderMinQuantity] = useState(
    productData.orderMinQuantity || ""
  );
  const [orderMaxQuantity, setOrderMaxQuantity] = useState(
    productData.orderMaxQuantity || ""
  );

  useEffect(() => {
    // setInventoryMethod(productData.inventoryMethod || "");
    // setWarehouse(productData.warehouse || "");
    setInStock(productData.inStock || null);
    setStock(productData.stock || "");
    setOrderMinQuantity(productData.orderMinQuantity || "");
    setOrderMaxQuantity(productData.orderMaxQuantity || "");
  }, [productData]);

  //for price
  const [price, setPrice] = useState(productData.price || "");
  const [oldPrice, setOldPrice] = useState(productData.oldPrice || "");
  const [isDiscountAllowed, setIsDiscountAllowed] = useState(
    productData.isDiscount || false
  );
  const [discount, setDiscount] = useState(productData.discount || "");

  useEffect(() => {
    setPrice(productData.price || "");
    setOldPrice(productData.oldPrice || "");
    setIsDiscountAllowed(productData.isDiscount || false);
    setDiscount(productData.discount || "");
  }, [productData]);

  //for shipping info

  const [shippingCharges, setShippingCharges] = useState(
    productData.shippingCharges || ""
  );
  const [shippingType, setshippingType] = useState(
    productData.shippingType || ""
  );

  useEffect(() => {
    setShippingCharges(productData.shippingCharges || "");
    setshippingType(productData.shippingType || "");
  }, [productData]);

  //for image file upload
  const [imagesfile, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [isUpload, setIsUploaded] = useState(false);
  const [imageData, setImageData] = useState([]);

  useEffect(() => {
    setOldImages(productData.images);
  }, [productData]);

  //for seo basic
  const [metaTitle, setMetaTitle] = useState(productData.metaTitle || "");
  const [metaKeywords, setMetaKeywords] = useState(
    productData.metaKeywords || ""
  );
  const [metaDescription, setMetaDescription] = useState(
    productData.metaDescription || ""
  );

  useEffect(() => {
    setMetaTitle(productData.metaTitle || "");
    setMetaKeywords(productData.metaKeywords || "");
    setMetaDescription(productData.metaDescription || "");
  }, [productData]);

  //product attirbute basic
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [priceAdjustmentTypes, setPriceAdjustmentTypes] = useState([]);
  const [selectedPriceAdjustmentType, setSelectedPriceAdjustmentType] =
    useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(1);

  const [loading, setLoading] = useState(false);

  const [selectedCategoryId, setSelecteCategoryId] = useState("");

  const handleProductEdit = async () => {
    setLoading(true);
    if (
      !productName ||
      !shortDescription ||
      !fullDescription ||
      !manufacturer ||
      !status ||
      !price ||
      !shippingType ||
      !metaTitle ||
      !metaKeywords ||
      !metaDescription
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      if (isUpload) {
        const responseData = await axios.put(
          `${import.meta.env.VITE_API_ENDPOINT}/api/upload/update/${
            productData._id
          }`,
          { imagesfile }
        );
        if (responseData.data.urls) {
          console.log(responseData.data.urls, "imagte");
          setImageData(responseData.data.urls);
        }
      }

      const imagesLinks = [];
      {
        oldImages &&
          oldImages.map((item) => {
            imagesLinks.push({
              public_id: item.public_id,
              url: item.url,
            });
          });
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`,
        {
          productName,
          sellerId,
          manufacturer,
          categories: selectedCategoryId,
          status,
          tags,
          shortDescription,
          startDate,
          endDate,
          sku,
          fullDescription,
          manufactureDate: startDate,
          expireDate: endDate,
          showonhome,
          marknew,
          reviewallow,
          orderMinQuantity,
          orderMaxQuantity,
          price,
          oldPrice,
          isDiscountAllowed,
          discount,
          shippingCharges,
          shippingType,
          images: isUpload ? imageData : imagesLinks,
          metaTitle,
          metaKeywords,
          metaDescription,
          attributes,
          selectedAttribute,
          priceAdjustmentTypes,
          selectedPriceAdjustmentType,
          isLoading,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success("Product Updated Successfully");
        navigate("/Products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error("Error fetching image data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="mt-20">
        <Topbar2 />
      </section>
      <div className="flex lg:ml-2 justify-between">
        <div className="font-bold m-5 flex items-center text-lg">
          <BsPeopleFill className="mr-2" size={22} />
          Edit Products
        </div>
        <div className="flex mr-4">
          <div
            className="flex items-stretch my-4 focus:bg-gray-900"
            onClick={() => {
              navigate("../products");
            }}
          >
            <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none">
              <AiOutlineClose className="mr-2 scale-125 border bg-white rounded-full fill-gray-900" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className=" w-full ms-10  my-5 flex flex-row justify-center items-center gap-0  ">
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
          <div
            className={`flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full ${
              activeTab === 1
                ? "bg-gradient-to-br from-gray-400 to-gray-900"
                : "bg-blue-500 text-white"
            } `}
          >
            1
          </div>
          <span className=" sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
            Edit Category
          </span>
        </div>
        <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20  border border-gray-300"></div>
        <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
          <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-gray-300">
            2
          </div>
          <span className="sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-normal text-center text-gray-400">
            Edit Product Details
          </span>
        </div>
      </div>

      {activeTab === 1 && (
        <div className="flex items-center justify-center">
          <CategorySelector
            setActiveTab={setActiveTab}
            setSelecteCategoryId={setSelecteCategoryId}
          />
        </div>
      )}
      {activeTab === 2 && (
        <>
          <Basic_info
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
          />
          <Prices_info
            price={price}
            setPrice={setPrice}
            oldPrice={oldPrice}
            setOldPrice={setOldPrice}
            isDiscountAllowed={isDiscountAllowed}
            setIsDiscountAllowed={setIsDiscountAllowed}
            discount={discount}
            setDiscount={setDiscount}
          />
          <Shipping_Basic_info
            shippingCharges={shippingCharges}
            setShippingCharges={setShippingCharges}
            shippingType={shippingType}
            setshippingType={setshippingType}
          />
          <Inventory_Basic_info
            // inventoryMethod={inventoryMethod}
            // setInventoryMethod={setInventoryMethod}
            // warehouse={warehouse}
            // setWarehouse={setWarehouse}
            inStock={inStock}
            setInStock={setInStock}
            stock={stock}
            setStock={setStock}
            orderMinQuantity={orderMinQuantity}
            setOrderMinQuantity={setOrderMinQuantity}
            orderMaxQuantity={orderMaxQuantity}
            setOrderMaxQuantity={setOrderMaxQuantity}
          />
          <Pictures_Basic_info1
            setOldImages={setOldImages}
            setImages={setImages}
            oldImages={oldImages}
            setIsUploaded={setIsUploaded}
          />
          <Seo_Basic_info
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaKeywords={metaKeywords}
            setMetaKeywords={setMetaKeywords}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
          />

          {/* <ProductAttributesBasic_info
          attributes={attributes}
          setAttributes={setAttributes}
          selectedAttribute={selectedAttribute}
          setSelectedAttribute={setSelectedAttribute}
          priceAdjustmentTypes={priceAdjustmentTypes}
          setPriceAdjustmentTypes={setPriceAdjustmentTypes}
          selectedPriceAdjustmentType={selectedPriceAdjustmentType}
          setSelectedPriceAdjustmentType={setSelectedPriceAdjustmentType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        /> */}
          <div className="flex items-stretch m-6 gap-2 rounded-md cursor-pointer">
            <button
              onClick={() => setActiveTab(1)}
              className="flex  bg-gray-700 rounded-full text-white items-center px-4 py-1 gap-2 focus:outline-none mb-8"
            >
              Back
              <ion-icon name="send" className="text-white "></ion-icon>
            </button>
            <button
              onClick={handleProductEdit}
              className="flex  bg-gray-700 rounded-full text-white items-center px-4 py-1 gap-2 focus:outline-none mb-8"
            >
              {loading ? "Please wait..." : "Edit Product"}
              <ion-icon name="send" className="text-white "></ion-icon>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Editproducts;
