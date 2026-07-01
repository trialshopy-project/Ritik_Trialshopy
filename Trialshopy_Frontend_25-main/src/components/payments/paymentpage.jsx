"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const serverURL = process.env.NEXT_PUBLIC_BASE_API_URL;
import { UserContext } from "@/lib/UserContext";
import { CartContext } from "@/lib/cartProvider";
const Paymentpage = () => {
  const [authenticated, setAuthenticated] = useContext(UserContext);
  const { buyNow } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalMRPPrice, setTotalMRPPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [personalCart, setPersonalCart] = useState(null);
  const [address, setAddress] = useState(null);
  const [totalCouponDiscount,setTotalCouponDiscount]=useState(0);
  const [totalDiscountPercentage,setTotalDiscountPercentage]=useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(
    buyNow?.quantity || 1
  );
  const [couponAppliedSuccess, setCouponAppliedSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Online");

  useEffect(() => {
    const fetchCartItems = async () => {
      console.log("here it is", buyNow)
      if (buyNow.productDetails !== null) {
        setAddress(buyNow?.address);
        setCartItems([buyNow]);
        setLoading(false);
      } else if (
        authenticated.user &&
        authenticated.user._id &&
        authenticated.user._id !== null
      ) {
        try {
          const customerId = authenticated.user?._id;
          const response = await axios.get(
            `${serverURL}/api/v1/cart/${customerId}`
          );
          const data = response.data;
          setCartItems(data[0].items);
          setPersonalCart(data[0]);
          // console.log("personalCart", data[0]);
          setAddress(data[0]?.shippingAddress);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCartItems();
  }, [serverURL, authenticated.user?._id, buyNow]);

  useEffect(() => {
    console.log(buyNow,"hiii")
    let totalProductPrice = 0;
    let totalDiscount = 0;
    let totalMRPPrice = 0;
    let couponDiscount=0;
    let totalPercentage=0;
    // Calculate total product price and discount
    cartItems?.forEach((item) => {
      console.log("item ji", item);
      const selectedSize = item.size;

      const itemPrice =
        item.productDetails?.Size?.[selectedSize]?.trialshopyPrice ||
        item.productId?.Size?.[selectedSize]?.trialshopyPrice ||
        item.productDetails?.price ||
        item.productId?.price ||
        0;
      const itemMRP =
        item.productId?.Size?.[selectedSize]?.MRP ||
        item.productDetails?.Size?.[selectedSize]?.MRP ||
        item.productDetails?.price ||
        item.productId?.price ||
        0;
      const itemDiscount = item.productId?.discount || 0;
      const itemQuantity = item?.count || item?.quantity || 1;
      const couDiscount=buyNow?.coupon?.discount||0;
      totalProductPrice += itemPrice * itemQuantity;
      totalDiscount += itemMRP * itemQuantity - itemPrice * itemQuantity ;
      couponDiscount=(totalProductPrice*(couDiscount/100))
      totalMRPPrice += itemMRP * itemQuantity;
      totalPercentage=( (((couponDiscount+totalDiscount)/ totalMRPPrice)*100).toFixed(2))
    });

    // Calculate subtotal
    const subtotal = totalMRPPrice - totalDiscount-couponDiscount;

    // Update state
    setTotalMRPPrice(totalMRPPrice);
    setTotalProductPrice(totalProductPrice);
    setTotalDiscount(totalDiscount);
    setSubtotal(subtotal);
    setTotalCouponDiscount(couponDiscount);
    setTotalDiscountPercentage(totalPercentage);
  }, [cartItems]);

  const router = useRouter();

  const handleOpenRazorpay = async (data) => {
    try {
      const orderData = {
        products: cartItems.map((item, index) => ({
          product: item.productId?._id || item.productDetails?._id,
          quantity: item.count || item.quantity || 1,
          orderStatus: "placed",
          mrp:
            item.productDetails?.Size[item.size]?.MRP ||
            item.productId?.Size[item.size]?.MRP ||
            item.productDetails?.price ||
            item.productId?.price,
          finalPrice:
            item.productDetails?.Size[item.size]?.trialshopyPrice ||
            item.productId?.Size[item.size]?.trialshopyPrice,
          amount:
            item.productDetails?.price * (item.quantity || item.count || 1) ||
            item.productId?.price * (item.count || item.quantity || 1),
          storeId: item.productId?.storeId || item.productDetails?.storeId,
          sellerId: item.productId?.sellerId || item.productDetails?.sellerId,
          size: item.size,
          skuId: item.productId?.Size[item.size]?.SkuId || item.productDetails?.Size[item.size]?.SkuId,
        })),
        totalPrice: Number(data),
        shippingAddress: buyNow.address || personalCart.shippingAddress,
        status: paymentMethod === "COD" ? "success" : "pending",
        currency: "INR",
        paymentMethod: paymentMethod,
        coupon:{
          couponType: buyNow?.coupon?.couponType || null,
          email: buyNow?.coupon?.email || null,
          studentId: buyNow?.coupon?.studentId || null,
          discount: buyNow?.coupon?.discount || 0,
        }
      };
      
      const newOrder = await axios.post(
        `${serverURL}/api/v1/${authenticated.user._id}/addOrder`,
        orderData
      );

      if (paymentMethod === "COD") {
        router.push(
          `/checkout/confirmation?orderId=${newOrder.data.newOrder?._id}`
        );
        return;
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(data * 100),
        currency: "INR",
        name: "Trialshopy Marketplace Pvt. Ltd.",
        description: "Created by Satyam Prakash",
        image: "/images/NameLogo.png",
        order_id: newOrder.data?.razorpayResponse?.id,
        handler: async function (response) {
          try {
            const res = await axios.put(
              `${serverURL}/api/v1/updateOrder/${newOrder.data.newOrder?._id}`,
              {
                payment: [
                  {
                    transactionId: response?.razorpay_payment_id,
                    totalAmount: data,
                    status: "success",
                  },
                ],
                status: "success",
              }
            );

            // console.log(res);
            router.push(
              `/checkout/confirmation?orderId=${newOrder.data.newOrder?._id}`
            );
          } catch (error) {
            console.error("Error processing payment success:", error);
            alert("Error processing payment");
          }
        },
        prefill: {
          name: `${authenticated.user?.name}`,
          email: `${authenticated.user?.email}`,
          contact: `${authenticated.user?.phone_number}`,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", async function (response) {
        alert("Payment failed. Please try again. Contact support for help");
        const res = await axios.put(
          `${serverURL}/api/v1/updateOrder/${newOrder.data.newOrder._id}`,
          {
            payment: [
              {
                transactionId: response?.razorpay_payment_id,
                totalAmount: data,
                status: "failed",
              },
            ],
            status: "failed",
          }
        );
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };


  return (
    <>
      <div className="flex flex-col my-3 justify-center items-center">
        <Image
          height={150}
          width={150}
          alt="Logo"
          src="/images/NameLogo.png"
          className="block"
        ></Image>
        <div className="flex">
          <h3 className="text-[#7C7C7C] font-poppins ml-[2px] text-[14px] sm:text-[17px] ">
            SHOPPING CART
          </h3>
          <hr className="border border-dashed md:w-[100px] ml-[4px] mt-[12.5px] border-[#7C7C7C]" />
          <div className="">
            <h3 className="text-[#EB8105] font-semibold font-poppins ml-[2px]   text-[14px] sm:text-[17px] ">
              PAYMENT
            </h3>
            <hr className=" border-[#EB8105] border-[1.5px] w-full  mt-[1px] " />
          </div>

          <hr className="border border-dashed  md:w-[100px] ml-[4px] mt-[12.5px] border-[#7C7C7C]" />

          <div>
            <h3 className=" text-[#7C7C7C]  font-poppins ml-[4px] text-[14px] sm:text-[17px] ">
              CONFIRMATION
            </h3>
          </div>
        </div>
      </div>

      <div className="px-3 md:px-[120px] xl:mx-[200px] mt-[10px] flex flex-col lg:flex-row gap-6 overflow-hidden pb-10">
        {/* ── Left column: address + payment method ─────────────────── */}
        <div className="w-full lg:w-3/5 flex flex-col gap-5">
          {/* Delivery address */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[15px] text-gray-800">
                Delivery Address
              </h3>
              <Link
                href="/checkout"
                className="text-[13px] font-medium text-[#EB8105] hover:underline"
              >
                Change
              </Link>
            </div>
            <p className="font-medium text-gray-800">{address?.fullName}</p>
            <p className="text-[14px] text-[#7C7C7C] mt-1 leading-relaxed">
              {address
                ? `${address.landmark ? address.landmark + ", " : ""}${address.addressLine}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`
                : ""}
            </p>
            <p className="text-[14px] text-[#7C7C7C] mt-1">
              Contact: {address ? `${address.PhoneNumber}` : ""}
            </p>
          </div>

          {/* Payment method */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-[15px] text-gray-800 mb-4">
              Select Payment Method
            </h3>
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
                  paymentMethod === "Online"
                    ? "border-[#EB8105] bg-orange-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#EB8105] w-4 h-4"
                />
                <span className="text-gray-700 text-[14px]">
                  Online Payment{" "}
                  <span className="text-[#7C7C7C] text-[13px]">
                    (UPI, Cards, NetBanking)
                  </span>
                </span>
              </label>
              <label
                className={`flex items-center gap-3 cursor-pointer rounded-lg border p-3 transition-colors ${
                  paymentMethod === "COD"
                    ? "border-[#EB8105] bg-orange-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#EB8105] w-4 h-4"
                />
                <span className="text-gray-700 text-[14px]">Cash on Delivery (COD)</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Right column: price summary ───────────────────────────── */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 lg:sticky lg:top-4">
            <h3 className="font-semibold text-[15px] text-gray-800 border-b border-gray-100 pb-3 mb-4">
              Price Details{" "}
              <span className="text-[#7C7C7C] font-normal text-[13px]">
                ({cartItems.length} item)
              </span>
            </h3>

            <div className="flex flex-col gap-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[#7C7C7C]">Total MRP</span>
                <span className="text-gray-800">₹ {totalMRPPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C7C7C]">Discount on MRP</span>
                <span className="text-[#059669]">-₹ {totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C7C7C]">Coupon Discount</span>
                <span className="text-[#DC2626]">-₹ {totalCouponDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C7C7C]">Total Discount</span>
                <span className="text-[#DC2626]">- {totalDiscountPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C7C7C] flex items-center gap-1">
                  Convenience Fee
                  <span className="text-[#EB8105] text-[12px] cursor-pointer">
                    Know More
                  </span>
                </span>
                <span className="text-[#059669]">Free</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 my-4" />

            <div className="flex justify-between items-center mb-5">
              <span className="font-semibold text-[16px] text-gray-800">
                Total Amount
              </span>
              <span className="font-semibold text-[18px] text-gray-900">
                ₹ {subtotal}
              </span>
            </div>

            <button
              className="w-full px-3 py-3 text-center text-white font-semibold rounded-md bg-gradient-to-b from-primary to-secondary hover:opacity-95 transition-opacity"
              onClick={() => handleOpenRazorpay(subtotal.toFixed(2))}
            >
              {paymentMethod === "COD" ? "Place Order" : `Pay Now · ₹ ${subtotal}`}
            </button>

            <p className="text-center text-[12px] text-[#7C7C7C] mt-3">
              Safe and secure payments. 100% authentic products.
            </p>
            <Link href="/checkout/confirmation"></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Paymentpage;
