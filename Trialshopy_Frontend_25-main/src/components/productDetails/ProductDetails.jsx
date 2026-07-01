"use client";
import React, { useState, useEffect } from "react";
import ProductDetailsComponent from "./ProductDetailsComponent";
import ProductInfo from "./ProductInfo";
import SimilarProducts from "./SimilarProducts";
import Bestsellers from "./Bestsellers";
import axios from "axios";
import AddProductReview from "./AddProductReview";
import ProductReviews from "../productReview/ProductReview";

// Lightweight skeleton that mirrors the product layout so the page feels
// instant instead of showing a blank spinner while data loads.
const ProductSkeleton = () => (
  <div className="px-4 lg:px-[120px] w-full animate-pulse">
    <div className="w-full mx-auto py-4 lg:py-8 grid grid-cols-1 md:grid-cols-2 gap-[30px]">
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full h-[492px] bg-gray-200 rounded-md" />
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[75px] h-[90px] bg-gray-200 rounded" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded w-1/3 mt-2" />
        <div className="flex gap-2 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-14 h-8 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded w-full mt-6" />
        <div className="h-12 bg-gray-200 rounded w-full" />
      </div>
    </div>
  </div>
);

export const ProductDetails = (props) => {
  const { productId } = props;
  const [productData, setProductData] = useState(null);
  const [productReviews, setProductReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  const serverURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  useEffect(() => {
    let isMounted = true;

    // ── 1. Product (highest priority — unblocks the whole page) ──────────
    const fetchProductData = async () => {
      try {
        const response = await fetch(`${serverURL}/api/v1/products/${productId}`, {
          method: "GET",
        });
        const res = await response.json();
        if (!isMounted) return;
        setProductData(res);

        // ── 2. Recommendations — fired only once we know the category,
        //     and capped with a limit so we don't pull the whole catalog.
        if (res?.category) {
          const listUrl = `${serverURL}/api/v1/products?limit=12`;

          // Similar products (same category)
          axios
            .post(listUrl, { filters: { categories: res.category } })
            .then((r) => {
              if (!isMounted) return;
              const items = (r?.data?.data || []).filter((p) => p?._id !== productId);
              setSimilarProducts(items);
            })
            .catch((e) => console.error("Error fetching similar products:", e));

          // Bestsellers (same category, most-rated first = popularity proxy)
          axios
            .post(listUrl, {
              filters: { categories: res.category },
              sortBy: "-rating.count",
            })
            .then((r) => {
              if (!isMounted) return;
              const items = (r?.data?.data || []).filter((p) => p?._id !== productId);
              setBestsellers(items);
            })
            .catch((e) => console.error("Error fetching bestsellers:", e));
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    // ── 3. Reviews (independent — runs in parallel) ─────────────────────
    const fetchProductReviews = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/v1/reviews/${productId}`);
        if (!isMounted) return;
        setProductReviews(response.data);
      } catch (error) {
        console.error("Error fetching product reviews:", error);
      }
    };

    fetchProductData();
    fetchProductReviews();

    return () => {
      isMounted = false;
    };
  }, [productId, serverURL]);

  const handleNewReview = (newReview) => {
    setProductReviews([...productReviews, newReview]);
  };

  const handleReviewDelete = (reviewId) => {
    const updatedReviews = productReviews.filter(
      (review) => review._id !== reviewId
    );
    setProductReviews(updatedReviews);
  };

  if (!productData) return <ProductSkeleton />;

  return (
    <div className="w-full">
      <ProductDetailsComponent productData={productData} />
      <ProductInfo productData={productData} />
      <AddProductReview
        productId={productId}
        setProductReviews={setProductReviews}
        productReviews={productReviews}
        handleNewReview={handleNewReview}
      />
      <div className="w-[85vw] mx-auto">
        <ProductReviews
          productReviews={productReviews}
          onDelete={handleReviewDelete}
        />
      </div>

      {bestsellers?.length > 0 && <Bestsellers bestsellers={bestsellers} />}

      {similarProducts?.length > 0 && (
        <SimilarProducts similarProducts={similarProducts} />
      )}
    </div>
  );
};
