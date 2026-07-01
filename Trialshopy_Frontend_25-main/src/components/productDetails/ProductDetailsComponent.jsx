"use client";
import { useContext, useEffect, useState } from "react";
import Bargain from "./Bargain";
import Link from "next/link";
import axios from "axios";
import { UserContext } from "@/lib/UserContext";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { CartContext } from "@/lib/cartProvider";
import { Spin } from "antd";
import Image from "next/image";
import useCart from "@/hooks/useCart";
import { VirtualContext } from "@/lib/TryOnContext";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center backdrop-blur">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white mx-3 md:mx-0  border-2 border-[#EB8105]   px-1 py-3 rounded-md">
          <div className="">{children}</div>

          <button
            className="px-5 bg-[#EB8105] py-2 font-bold flex ml-4 rounded-md"
            onClick={onClose}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductDetails({ productData }) {
  const NextPrevimages = [
    productData?.productImage,
    ...(productData?.Images?.map((image) => image?.url) || []),
  ];
  const [authenticated] = useContext(UserContext);
  const [error, setError] = useState("");
  const userId = authenticated.user?._id;
  const serverURL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [bargain, setBargain] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState(productData?.productImage);
  const [selectedSize, setSelectedSize] = useState(
    productData?.Size ? Object?.keys(productData?.Size)[0] : "Free Size"
  );
  const router = useRouter();
  const { buyNow, setBuyNow, cart, setCart } = useContext(CartContext);
  const { updateTryOnUrls } = useContext(VirtualContext);
  const [showAddToLiveViewModal, setShowAddToLiveViewModal] = useState(false);
  const [showAlreadyAddedModal, setShowAlreadyAddedModal] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const { addToCart, loaderAddCart } = useCart(userId);
  const [loaderAddLive, setLoaderAddLive] = useState(false);
  const [showAlreadyAddToCartModal, setShowAlreadyAddToCartModal] =
    useState(false);
  const [isProductAddedToLiveDemo, setIsProductAddedToLiveDemo] =
    useState(false);
  const { discount, price } = productData || {};
  const inStock = productData?.Size
    ? productData?.Size[selectedSize]?.Inventory > 0
    : 0;
  const [quantity, setSelectedQuantity] = useState(1);
  // Calculate the discounted price
  const discountedPrice = productData?.Size
    ? productData?.Size[selectedSize]?.trialshopyPrice
    : 0 -
      (productData?.Size
        ? productData?.Size[selectedSize]?.trialshopyPrice
        : 0 * discount) /
        100;

  const currentMRP = productData?.Size?.[selectedSize]?.MRP || 0;
  const discountPercentage = currentMRP
    ? Math.round(((currentMRP - discountedPrice) / currentMRP) * 100)
    : 0;

  const addToLiveDemo = async () => {
    try {
      setLoaderAddLive(true);
      if (!authenticated.name || !authenticated.user._id) {
        setError("Please Login to View Product Live Demo");
        return;
      }

      const response = await axios.post(
        `${serverURL}/api/v1/liveDemo/addItem`,
        {
          productId: productData._id,
          customerId: userId,
        }
      );

      console.log(response, "responseadd");
      if (response.data.isProductAdded) {
        // Product is already added to Live Demo
        setIsProductAddedToLiveDemo(true);
        setShowAlreadyAddedModal(true);
        console.log("Live Demo API Response:", response.data.Comment);
        return;
      }

      // If not added, proceed to add the product
      // const addResponse = await axios.post(
      //   `${serverURL}/api/v1/liveDemo/addItem`,
      //   {
      //     productId: productData._id,
      //     customerId: userId,
      //   }
      // );

      setShowAddToLiveViewModal(true);
      setIsProductAddedToLiveDemo(true);
    } catch (error) {
      console.error("Error adding item to Live Demo:", error);
    } finally {
      setLoaderAddLive(false);
    }
  };

  const closeModal = () => {
    // Close all modals
    setShowAddToLiveViewModal(false);
    setShowAlreadyAddedModal(false);
    setShowAddToCartModal(false);
    setShowAlreadyAddToCartModal(false);
  };

  const handleTryOn = (tryOnImageUrl) => {
    if (updateTryOnUrls && tryOnImageUrl) {
      updateTryOnUrls({ clothUrl: tryOnImageUrl });
      router.push("/virtualTryOn");
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "0 0",
  });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomStyle({
      transform: "scale(2)",
      transformOrigin: `${x * 100}% ${y * 100}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "0 0",
    });
  };
  // console.log("productData", productData);
  const addToBuyNowCart = () => {
    setBuyNow({
      productDetails: productData,
      quantity: quantity,
      size: selectedSize,
    });
    router.push("/checkout");
  };

  let totalStocks = productData?.Size
    ? productData?.Size[selectedSize]?.Inventory
    : 0;
  if (totalStocks > 5) totalStocks = 5;
  const quantityOptions = Array.from(
    { length: totalStocks },
    (_, index) => index + 1
  );

  const handleAddToCart = async () => {
    if (!authenticated.user._id) {
      setError("Please Login to Add Product to Cart");
      return;
    }
    const result = await addToCart(
      productData._id,
      quantity,
      selectedSize,
      serverURL
    );
    if (result.status === "success") setShowAddToCartModal(true);
  };

  useEffect(() => {
    setSelectedImage(productData?.productImage);
  }, [productData]);
  return (
    <div className="px-4 lg:px-[120px] relative w-full">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 pt-4 text-[13px] text-[#7C7C7C]">
        <Link href="/" className="hover:text-[#EB8105]">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#EB8105]">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium line-clamp-1 max-w-[60vw]">
          {productData?.productName}
        </span>
      </nav>

      <div className="w-full mx-auto py-4 lg:py-8 bg-white grid sm:flex grid-cols-1 md:grid-cols-2 gap-[30px]">
        <div className="flex flex-col gap-2.5 items-center w-full sm:w-2/3">
          <div className="relative w-full">
            {NextPrevimages.length === 1 ? null : (
              <button
                onClick={() => {
                  const prevPage =
                    (page - 1 + NextPrevimages.length) % NextPrevimages.length;
                  setPage(prevPage);
                  handleImageClick(NextPrevimages[prevPage]);
                }}
                className="absolute left-0 flex p-3 ml-2 bg-white rounded-full top-36"
              >
                <AiOutlineLeft className="text-3xl font-bold " />
              </button>
            )}
            <div
              className="relative  overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                width={500}
                height={500}
                src={selectedImage}
                alt={`${productData?.productName}`}
                className="w-full h-[492px]"
                style={zoomStyle}
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            {NextPrevimages?.length === 1 ? null : (
              <button
                onClick={() => {
                  const nextPage = (page + 1) % NextPrevimages.length;
                  setPage(nextPage);
                  handleImageClick(NextPrevimages[nextPage]);
                }}
                className="absolute right-0 p-3 mr-2 bg-transparent bg-white rounded-full top-36"
              >
                <AiOutlineRight className="text-3xl font-bold " />
              </button>
            )}
          </div>
          <div className="flex items-center w-full gap-4">
            <div
              className="border border-gray-400 w-[48px] h-[60px] md:w-[75px] md:h-[90px]"
              onClick={() => handleImageClick(productData?.productImage)}
            >
              <Image
                width={500}
                height={500}
                src={`${productData?.productImage}`}
                alt={productData?.productName}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            {productData?.Images.length > 0 &&
              productData?.Images?.map((image, index) => (
                <div
                  className="border border-gray-400 w-[48px] h-[60px] md:w-[75px] md:h-[90px]"
                  key={index}
                  onClick={() => handleImageClick(image?.url)}
                >
                  <Image
                    width={500}
                    height={500}
                    src={`${image?.url}`}
                    alt={image?.filename}
                    className="w-full h-full "
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between w-full h-full">
          <div className="flex flex-col justify-start w-full itmes-start ">
            <div className="w-full space-y-3">
              <h1 className="text-2xl font-semibold text-gray-700">
                {productData?.productName}
              </h1>
              <h2 className="text-base">{productData?.shortDescription}</h2>
            </div>

            <div className="w-full mt-2 bg-gray-400"></div>
            <div className="flex flex-col items-start justify-between w-full gap-5 py-2 text-sm">
              <div className="flex flex-row items-center justify-between  ">
                <span className="font-Poppins text-3xl font-semibold">
                  ₹{discountedPrice}
                </span>

                <span className=" font-light text-gray-500 text-lg ml-2 line-through">
                  {/* {productData?.price} */}
                  {productData?.Size ? productData?.Size[selectedSize]?.MRP : 0}
                </span>
                <span className="text-red-500  ml-2 font-Poppins text-xl font-semibold">
                  {discountPercentage}% off
                </span>
              </div>
              <p className="text-xs text-[#7C7C7C] -mt-3">
                Inclusive of all taxes
              </p>

              {productData?.related_product?.length > 0 && (
                <>
                  <div className="w-full h-px bg-gray-400"></div>
                  <div className="relative flex  text-base font-semibold lg:text-xl">
                    <h2 className="text-black">Color</h2>
                  </div>
                  <div className="flex gap-4">
                    {productData?.related_product?.map((item, index) => (
                      <Link
                        key={index}
                        href={`/products/details?productId=${item?._id}`}
                        onClick={() => handleImageClick(item?.productImage)}
                      >
                        <img
                          src={item?.productImage}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </Link>
                    ))}
                  </div>{" "}
                </>
              )}
              <div className="w-full h-px  bg-gray-400"></div>

              <div className="relative flex  text-base font-semibold lg:text-xl">
                <h2 className="text-black">Select Size</h2>
                {/* <h2 className="text-black">: {selectedSize}</h2> */}
              </div>

              <div className="w-full py-2.5">
                {productData.Size ? (
                  Object.keys(productData.Size).map((size, index) => (
                    <div
                      key={index}
                      className={`inline-block mr-1 my-2 border cursor-pointer rounded-full px-6 py-1 border-gray-400 relative items-center justify-center ${
                        selectedSize === size
                          ? "border-primary bg-secondary bg-opacity-20"
                          : ""
                      }`}
                      onClick={() => {
                        handleSizeClick(size);
                      }}
                    >
                      <span className="text-sm md:text-base font-Poppins">
                        {size}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-full px-3 py-2 relative flex items-center justify-center border-primary bg-secondary bg-opacity-20">
                    <span className="text-sm md:text-base font-Poppins text-primary font-bold">
                      Free Size
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-5">
                <div className="mt-1">
                  {inStock ? (
                    <p className="text-green-500 text-[14px]">In Stock</p>
                  ) : (
                    <p className="text-red-500 text-[14px]">Out of Stock</p>
                  )}
                </div>
                {inStock && (
                  <div>
                    <label htmlFor="quantity">Quantity:</label>
                    <select
                      name="quantity"
                      onChange={(e) => {
                        setSelectedQuantity(e.target.value);
                      }}
                      defaultValue="1"
                      className="border-2 border-gray-400 px-1 py-1 rounded ml-2"
                    >
                      {quantityOptions.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {productData?.attributes?.map((attribute, index) => (
                <div
                  className="flex flex-row items-center justify-between w-full"
                  key={index}
                >
                  <span>{attribute.title}</span>
                  <span>{attribute.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start justify-between w-full gap-4">
            <div className="flex items-center justify-between w-full gap-4 ">
              {productData?.storeId && productData?.storeId?._id && (
                <Link
                  href={`/nearByStore/store?storeId=${productData?.storeId?._id}`}
                  className="text-base border-2 border-[#EB8105] font-semibold text-center w-1/2 px-4 py-2"
                >
                  View Store
                </Link>
              )}
              {inStock && (
                <div
                  onClick={addToBuyNowCart}
                  className="text-base bg-gradient-to-b from-[#FAAC06] to-[#EB8105] font-semibold hover:cursor-pointer text-center w-1/2 px-4 py-2"
                >
                  Buy Now
                </div>
              )}
            </div>
            {inStock && (
              <div className="flex  items-center justify-between w-full gap-4">
                <button
                  className={`text-base gap-4 ${
                    loaderAddCart
                      ? "bg-gray-100 pointer-events-none"
                      : "bg-gradient-to-b from-[#FAAC06] to-[#EB8105]"
                  } font-semibold  w-1/2 px-4 py-2`}
                  onClick={handleAddToCart}
                  disabled={loaderAddCart}
                >
                  {loaderAddCart ? (
                    <>
                      <Spin /> <span>Adding to Cart</span>
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  // onClick={handleAddToLiveView}
                  onClick={addToLiveDemo}
                  className="text-base border-2 border-[#EB8105] font-semibold w-1/2 px-4 py-2"
                >
                  {loaderAddLive ? (
                    <>
                      <Spin /> <span>Adding to Live view</span>
                    </>
                  ) : (
                    "Add to Live view"
                  )}
                </button>
              </div>
            )}
            
            {(productData?.tryOnEnabled || productData?.productImage) && (
              <div className="w-full mt-2">
                 <button
                  className="text-base bg-gradient-to-b from-[#FAAC06] to-[#EB8105] font-semibold w-full px-4 py-2 transition-all flex items-center justify-center gap-2"
                  onClick={() => handleTryOn(productData?.tryOnImage || productData?.productImage)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Virtual Try On
                </button>
              </div>
            )}
            
            <p className="text-red-500 text-sm">{error}</p>

            {/* Trust badges — standard e-commerce reassurance strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-3 pt-4 border-t border-gray-200">
              {[
                {
                  label: "Free Delivery",
                  d: "M3 13h13v-2H3v2zm0 4h10v-2H3v2zm14-8h3l1 3v5h-2a2 2 0 11-4 0h-2V6h3v3zM6 19a2 2 0 100-4 2 2 0 000 4z",
                },
                {
                  label: "7-Day Return",
                  d: "M12 5V2L8 6l4 4V7a5 5 0 11-5 5H5a7 7 0 107-7z",
                },
                {
                  label: "Secure Payment",
                  d: "M12 2l7 4v6c0 5-3.4 8.5-7 10-3.6-1.5-7-5-7-10V6l7-4z",
                },
                {
                  label: "100% Genuine",
                  d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center text-center gap-1">
                  <span className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-50 text-[#EB8105]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={b.d} />
                    </svg>
                  </span>
                  <span className="text-[11px] text-[#7C7C7C] font-medium">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {bargain && <Bargain bargain={bargain} setBargain={setBargain} />}
      <Modal isOpen={showAddToCartModal} onClose={closeModal}>
        <div className="p-4">
          <p className="text-lg font-semibold">
            Product added to Cart successfully!
          </p>
        </div>
      </Modal>

      <Modal isOpen={showAlreadyAddToCartModal} onClose={closeModal}>
        <div className="p-4">
          <p className="text-lg font-semibold">
            Product is already added in cart!
          </p>
        </div>
      </Modal>

      <Modal isOpen={showAddToLiveViewModal} onClose={closeModal}>
        <div className="p-4">
          <p className="text-lg font-semibold">
            Product added to Live View successfully!
          </p>
        </div>
      </Modal>
      <Modal isOpen={showAlreadyAddedModal} onClose={closeModal}>
        <div className="p-4">
          <p className="text-lg font-semibold">
            Product is already added to Live View!
          </p>
        </div>
      </Modal>
    </div>
  );
}
