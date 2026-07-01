import React from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import FilterSub from "@/components/pages/category/FilterSub";

async function fetchBlog(id) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: {
            categories: [id],
          },
        }),
        next: { revalidate: 60 },
      }
    );
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error(err);
  }
}

const SingleNearByStorePage = async ({ params }) => {
  const blog = await fetchBlog(params.id);
  if (!blog) {
    notFound();
  }
  return (
    <>
      <FilterSub data={blog} CategoryProductsId={params.id}  />
    </>
  );
};
export default SingleNearByStorePage;
