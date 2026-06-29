import React, { useEffect } from "react";

const Basic_info = ({
  data,
  dataSubCategory,

  productName,
  setProductName,
  manufacturers,
  setManufacturers,
  status,
  setStatus,
  vendors,
  setVendors,
  selectedVendor,
  setSelectedVendor,
  tags,
  setTags,
  shortDescription,
  setShort,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sku,
  setSku,
  fullDescription,
  setfullDescription,
  showonhome,
  setShowonhome,
  marknew,
  setMarknew,
  reviewallow,
  setReviewallow,
}) => {
  let statusCategories = ["active", "inactive"];

  useEffect(() => {
    fetchManufacturers();

    fetchStatus();
  }, []);

  const fetchManufacturers = () => {
    fetch("apiapi.manufacturer")
      .then((response) => response.json())
      .then((data) => {
        setManufacturers(data);
      })
      .catch((error) => {
        console.error("Error fetching manufacturers:", error);
      });
  };

  const fetchStatus = () => {
    fetch("apiapi.status")
      .then((response) => response.json())
      .then((data) => {
        setStatus(data);
      })
      .catch((error) => {
        console.error("Error status vendors:", error);
      });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-[80%]">
          <section className="w-full p-6 lg:p-8 border border-gray-300 bg-white shadow-lg rounded-lg">
            <h3 className="font-bold text-xl lg:text-2xl text-start mb-6">Basic Info</h3>
            <hr className="mb-6" />

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <section className="w-full sm:w-2/3 flex flex-col gap-4">
                <label htmlFor="productName" className="font-bold text-sm">
                  Product Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  required
                  id="productName"
                  placeholder="Enter Product name"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2 w-full"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </section>

              <section className="w-full sm:w-2/3 flex flex-col gap-4">
                <label htmlFor="shortDescription" className="font-bold text-sm">
                  Short Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  rows={3}
                  name="shortDescription"
                  required
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2 w-full"
                  placeholder="Enter a short description"
                  value={shortDescription}
                  onChange={(e) => setShort(e.target.value)}
                ></textarea>
              </section>

              <section className="w-full sm:w-2/3 flex flex-col gap-4">
                <label htmlFor="fullDescription" className="font-bold text-sm">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  name="fullDescription"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2 w-full"
                  placeholder="Enter a full description"
                  value={fullDescription}
                  onChange={(e) => setfullDescription(e.target.value)}
                />
              </section>
            </section>


            <section className="flex lg:flex-row flex-col lg:justify-between lg:items-center items-start gap-4 mt-4">
              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="manufacturer" className="font-bold text-sm">
                  Manufacturer <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  id="manufacturer"
                  placeholder="Enter manufacturer"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={manufacturers}
                  onChange={(e) => setManufacturers(e.target.value)}
                />
              </section>

              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="status" className="font-bold text-sm">
                  Status <span className="text-red-600">*</span>
                </label>
                <select
                  name="status"
                  id="status"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statusCategories.map((statusCat, index) => (
                    <option key={index} value={statusCat}>
                      {statusCat}
                    </option>
                  ))}
                </select>
              </section>

              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="startDate" className="font-bold text-sm">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </section>

              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="endDate" className="font-bold text-sm">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </section>
            </section>

            <section className="flex lg:flex-row flex-col lg:justify-between lg:items-center items-start gap-4 mt-4">
              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="tags" className="font-bold text-sm">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  placeholder="Enter tags"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </section>

              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <label htmlFor="sku" className="font-bold text-sm">
                  Sku
                </label>
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  placeholder="Enter SKU"
                  className="bg-gray-100 border border-gray-300 rounded-lg text-sm p-2"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </section>

              <section className="w-full sm:w-1/3 flex flex-col gap-4">
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showonhome}
                      onChange={(e) => setShowonhome(e.target.checked)}
                      className="text-sm"
                    />
                    <label htmlFor="showonhome" className="text-sm ml-2">
                      Show on Home page
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      checked={marknew}
                      name="marknew"
                      onChange={(e) => setMarknew(e.target.checked)}
                      className="text-sm"
                    />
                    <label htmlFor="marknew" className="text-sm ml-2">
                      Mark as New
                    </label>
                  </li>
                  <li className="flex items-center">
                    <input
                      type="checkbox"
                      checked={reviewallow}
                      onChange={(e) => setReviewallow(e.target.checked)}
                      className="text-sm"
                    />
                    <label htmlFor="reviewallow" className="text-sm ml-2">
                      Allow Customer Reviews
                    </label>
                  </li>
                </ul>
              </section>
            </section>
          </section>
        </div>
      </div>
    </>
  );
};

export default Basic_info;

