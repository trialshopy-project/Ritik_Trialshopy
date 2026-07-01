import React from "react";
import { notFound } from "next/navigation";
import axios from "axios";
import FilterSub from "@/components/pages/category/FilterSub";

export const revalidate = 3600; // ISR - Revalidate every 1 hour

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/homeCategories`,
      { cache: "no-store" }
    );
    const categoryTree = await res.json();

    // Recursively collect every category ID at every depth level,
    // because the [id] segment can be a top-level, mid-level, or leaf category.
    function collectAllIds(nodes) {
      const ids = [];
      for (const node of nodes) {
        ids.push({ id: node._id.toString() });
        if (node.children && node.children.length > 0) {
          ids.push(...collectAllIds(node.children));
        }
      }
      return ids;
    }

    const params = collectAllIds(Array.isArray(categoryTree) ? categoryTree : []);
    return params;
  } catch (err) {
    console.error("Error fetching categories for static params:", err);
    return [];
  }
}

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
        next: { revalidate: 3600 },
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
