import React, { useState, useEffect } from "react";

const Seo_Basic_info = ({
  metaTitle,
  setMetaTitle,
  metaKeywords,
  setMetaKeywords,
  metaDescription,
  setMetaDescription,
}) => {
  useEffect(() => {
    // Fetch SEO data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch("/api/seo"); // Replace "/api/seo" with the actual API endpoint
        const data = await response.json();
        setMetaTitle(data.metaTitle);
        setMetaKeywords(data.metaKeywords);
        setMetaDescription(data.metaDescription);
      } catch (error) {
        console.error("Error fetching SEO data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMetaTitleChange = (e) => {
    setMetaTitle(e.target.value);
  };

  const handleMetaKeywordsChange = (e) => {
    setMetaKeywords(e.target.value);
  };

  const handleMetaDescriptionChange = (e) => {
    setMetaDescription(e.target.value);
  };

  return (
    <>
      <section className="border border-b-slate-300 bg-white shadow-lg rounded-lg mt-7">
        <h2 className="font-semibold sm:m-4 text-center">SEO</h2>

        <div className="flex -mt-3 items-center justify-between w-full">
          <section className="m-1 p-1 w-1/3  sm:m-4 flex flex-col justify-around gap-1.5">
            <p className="font-bold text-xs">
              Meta Title <span className="text-[#F60002]">*</span>
            </p>
            <input
              type="text"
              name="metaNameOne"
              id="metaNameOne"
              placeholder="Enter Meta Title"
              className="bg-transparent border border-b-black text-sm p-2"
              value={metaTitle}
              onChange={handleMetaTitleChange}
            />
          </section>

          <section className="m-1 p-1 w-1/3  sm:m-4 flex flex-col justify-around gap-1.5">
            <p className="font-bold text-xs">
              Meta Keywords <span className="text-[#F60002]">*</span>
            </p>
            <input
              type="text"
              name="metaNameTwo"
              id="metaNameTwo"
              placeholder="Enter Keywords"
              className="bg-transparent border border-b-black text-sm p-2"
              value={metaKeywords}
              onChange={handleMetaKeywordsChange}
            />
          </section>

          <section className="m-1 w-1/3  p-1 sm:m-4 flex flex-col justify-around">
            <p className="font-bold text-xs m-2">
              Meta Description <span className="text-[#F60002]">*</span>
            </p>
            <textarea
              rows={3}
              cols={30}
              className="bg-transparent border border-b-black text-sm p-2"
              placeholder="Enter Description"
              value={metaDescription}
              onChange={handleMetaDescriptionChange}
            ></textarea>
          </section>
        </div>
      </section>
    </>
  );
};

export default Seo_Basic_info;
