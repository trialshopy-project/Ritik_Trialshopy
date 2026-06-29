import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ConsoleLevel } from "@zegocloud/zego-uikit-prebuilt";
import BrandDropdownWithSearch from "./BrandDropdownWithSearch";
import DynamicForm from "./dynamicForm";
import toast from "react-hot-toast";
const Basic_info = ({
  categories,
  data,
  dataSubCategory,
  index,
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
  active_categories,
  uploadedImages,
  globalformData,
  setglobalFormData,
  forRent,
}) => {
  let statusCategories = ["active", "inactive"];

  const [formData, setFormData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(index);
  useEffect(() => {
    setFormData(globalformData);
  });
  useEffect(() => {
    setCurrentIndex(index);
    if (!formData[index]) {
      setFormData((prevData) => ({
        ...prevData,
        [index]: {
          productImage: "",
          productName: "",
          shortDescription: "",
          fullDescription: "",
          manufacturerDrop: "",
          brand: "",
          IsNumber: "",
          gstNumber: "",
          sgstNumber: "",
          countryOfOrigin: "",
          Color: "",
          status: "",
          type: "",
          material: "",
          quantity: "",
          startDate: "",
          endDate: "",
          Weight: "",
          tags: "",
          sku: "",
          HSNCode: "",
          Images: [],
          Size: [],
          CMLNumber: "",
          Rent: "",
          RentPerHour: "",
          showonhome: false,
          marknew: false,
          reviewallow: false,
          attributes: [],
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
      }));
    }
  }, [index]);
  const [imageLoader, setimageLoader] = useState(false);
  const [brand_, setbrand] = useState(null);

  const hasFetchedCategories = useRef(false);
  useEffect(() => {
    if (formData?.[0]?.categories && !hasFetchedCategories.current) {
      fetch_categories();
      hasFetchedCategories.current = true;
    }
  }, [formData]);
  const [makeVisible,setVisible]=useState(false)
  const [dynamicAttributes, setdynamicAttributes] = useState(null);
  const [availableSizes, setavailablesize] = useState([]);
  const [availableFabric, setavailableFabric] = useState([]);
  // console.log(availableFabric,"error");
  const fetch_categories = async () => {
    // console.log("gorm data is ", formData, formData?.[0]?.categories);
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/categories/${
        formData?.[0]?.categories
      }`
    );
    console.log(response.data);

    if (response.data.message === "success" && response.data.result.attributes.length>0) {
      setVisible(true)
      const attributes = response.data.result?.attributes || [];
      setdynamicAttributes(attribute => {
        // const filteredAttributes=attributes.map((attr_)=>attr_.filter((attr => attr.name !== 'Brand' && attr.name !== 'Size')));
        const filteredAttributes=attributes;
        return filteredAttributes;
    });
    
    
      const sizeAttribute = attributes.find((attr) => attr.name === "Size");
      const brandAttribute = attributes.find((attr) => attr.name === "Brand");
      const FabricAttribute = attributes.find((attr) => attr.name === "Fabric");
      const FabricOptions = FabricAttribute ? FabricAttribute.options : [];
      const brandOptions = brandAttribute ? brandAttribute.options : [];
      const sizeOptions = sizeAttribute ? sizeAttribute.options : "free size";
      // console.log(sizeOptions,'sizeopptions sis oadia ')
      setavailablesize(sizeOptions);
      console.log(brandOptions, "brand k oirek d");
      setbrand(brandOptions);

      // dynamic attribute allocation ----------------------------------------------------------------------->
    } else {
      console.log(e.message, "this is me ");
    }
  };

  {
    /**-----------------side image logic-------------------- */
  }
  const [url, setUrl] = useState([]);
  const fileInputRef = useRef("");
  const tryOnFileRef = useRef("");

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
    setimageLoader(true); //---------------------------------------------------------->
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageBlob = reader.result;
        const uploadedUrl = await responseData(imageBlob);
        setimageLoader(false); //------------------------------------------------------->
        setUrl(uploadedUrl);

        setFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            Images: [...(prevData[currentIndex]?.Images || []), uploadedUrl],
          },
        }));

        setglobalFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            Images: [...(prevData[currentIndex]?.Images || []), uploadedUrl],
          },
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleTryOnFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    setimageLoader(true);
    reader.onload = async () => {
      if (reader.readyState === 2) {
        const imageBlob = reader.result;
        const uploadedUrl = await responseData(imageBlob);
        setimageLoader(false);
        const imageUrl = uploadedUrl?.url || uploadedUrl;

        setFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            tryOnImage: imageUrl,
          },
        }));

        setglobalFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            tryOnImage: imageUrl,
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  {
    /**------------------------------------------------------ */
  }

  const dataForCurrentIndex = formData[currentIndex] || {};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(name, value, type, "iiiiiiiiiiiiiiiiiiiiiiiiiii");
    // console.log(name,value)
    // console.log(formData[currentIndex])
    console.log(formData);
    setFormData((prevData) => ({
      ...prevData,
      [currentIndex]: {
        ...prevData[currentIndex],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
    setglobalFormData((prevData) => ({
      ...prevData,
      [currentIndex]: {
        ...prevData[currentIndex],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const generateDescription = async () => {
    if (!dataForCurrentIndex?.productName || !active_categories) {
      toast.error("Product Name and Category are required to generate description.");
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const payload = {
        productName: dataForCurrentIndex.productName,
        categories: active_categories,
        color: dataForCurrentIndex.Color,
        weight: dataForCurrentIndex.Weight,
        brand: dataForCurrentIndex.brand,
        sizes: Object.keys(formData[currentIndex]?.Size || {}).join(", ")
      };

      const response = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/api/add_products/generate-description`, payload);

      if (response.data.success) {
        setFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            shortDescription: response.data.shortDescription,
            fullDescription: response.data.fullDescription,
          },
        }));
        setglobalFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            shortDescription: response.data.shortDescription,
            fullDescription: response.data.fullDescription,
          },
        }));
        toast.success("Description generated successfully!");
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  {
    /**-----------------------------size js code -------------------------------------------------------- */
  }

  // const [availableSizes,setavailablesize]=useState(['S', 'M', 'L', 'XL', 'XXL', 'XXXL'])

  // const availableSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCheckboxChange = (size) => {
    // alert(size + "hello from handle change ");
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(size)
        ? prevSelected.filter((s) => s !== size)
        : [...prevSelected, size]
    );
    setFormData((prevData) => {
      const currentData = prevData[currentIndex] || {};
      const sizeData = currentData.Size || {};
      if (sizeData[size]) {
        const { [size]: removedSize, ...filteredSizes } = sizeData;
        return {
          ...prevData,
          [currentIndex]: {
            ...currentData,
            Size: {
              ...filteredSizes,
            },
          },
        };
      } else {
        return {
          ...prevData,
          [currentIndex]: {
            ...currentData,
            Size: {
              ...sizeData,
              [size]: {
                trialshopyPrice: "",
                defectivePrice: "",
                mrp: "",
                Inventory: "",
                SkuId: "",
              },
            },
          },
        };
      }
    });
    setglobalFormData((prevData) => {
      const currentData = prevData[currentIndex] || {};
      const sizeData = currentData.Size || {};
      if (sizeData[size]) {
        const { [size]: removedSize, ...filteredSizes } = sizeData;
        return {
          ...prevData,
          [currentIndex]: {
            ...currentData,
            Size: {
              ...filteredSizes,
            },
          },
        };
      } else {
        return {
          ...prevData,
          [currentIndex]: {
            ...currentData,
            Size: {
              ...sizeData,
              [size]: {
                trialshopyPrice: "",
                defectivePrice: "",
                mrp: "",
                Inventory: "",
                SkuId: "",
              },
            },
          },
        };
      }
    });
  };

  const handleInputChange = (e, size, field) => {
    const value = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      [currentIndex]: {
        ...prevData[currentIndex],
        Size: {
          ...prevData[currentIndex]?.Size,
          [size]: {
            ...prevData[currentIndex]?.Size?.[size],
            [field]: value,
          },
        },
      },
    }));

    setglobalFormData((prevData) => ({
      ...prevData,
      [currentIndex]: {
        ...prevData[currentIndex],
        Size: {
          ...prevData[currentIndex]?.Size,
          [size]: {
            ...prevData[currentIndex]?.Size?.[size],
            [field]: value,
          },
        },
      },
    }));
  };
  const handleRemoveImage = (index) => {
    console.log(index);
    setFormData((prevData) => {
      const newData = { ...prevData };

      if (newData?.[currentIndex]?.Images?.[index]) {
        newData[currentIndex].Images = newData[currentIndex].Images.filter(
          (_, imgIndex) => imgIndex !== index
        );
      }

      return newData;
    });

    setglobalFormData((prevData) => {
      const newData = { ...prevData };

      if (newData?.[currentIndex]?.Images?.[index]) {
        newData[currentIndex].Images = newData[currentIndex].Images.filter(
          (_, imgIndex) => imgIndex !== index
        );
      }

      return newData;
    });
  };
  const handleApply = () => {
   
      setShowDropdown(false);
   
    

    selectedSizes.forEach((size) => {
      if (!formData[currentIndex]?.Size?.[size]) {
        setFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            Size: {
              ...prevData[currentIndex]?.Size,
              [size]: {
                trialshopyPrice: "",
                defectivePrice: "",
                mrp: "",
                Inventory: "",
                SkuId: "",
              },
            },
          },
        }));

        setglobalFormData((prevData) => ({
          ...prevData,
          [currentIndex]: {
            ...prevData[currentIndex],
            Size: {
              ...prevData[currentIndex]?.Size,
              [size]: {
                trialshopyPrice: "",
                defectivePrice: "",
                mrp: "",
                Inventory: "",
                SkuId: "",
              },
            },
          },
        }));
      }
    });
  };
  useEffect(() => {
    setglobalFormData((prevData) => ({
      ...prevData,
      [currentIndex]: {
        ...prevData[currentIndex],
        productImage: uploadedImages[currentIndex],
        categories: active_categories,
      },
    }));
  }, [uploadedImages, currentIndex]);

  return (
    <>
      {currentIndex >= 0 && (
        <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
          {console.log(globalformData)}
          <div className="w-full lg:w-[70%]">
            <section className="w-full p-6 lg:p-8 border border-gray-300 bg-white shadow-lg rounded-lg">
              <h3 className="font-bold text-xl lg:text-2xl text-start mb-6">
                Basic Info
              </h3>
              <hr className="mb-6" />
              {/* {console.log('object i s sdakda',dynamicAttributes,'hun')} */}

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: "Product Name",
                    name: "productName",
                    required: true,
                    placeholder: "Enter Product name",
                  },
                  {
                    label: "Manufacturer Details",
                    name: "manufacturerDrop",
                    required: true,
                    placeholder: "Enter manufacturer details",
                  },
                  // {
                  //   label: "IS Number",
                  //   name: "IsNumber",
                  //   placeholder: "Enter IS Number",
                  // },
                  // {
                  //   label: "CML Number",
                  //   name: "CMLNumber",
                  //   placeholder: "Enter CML Number",
                  // },
                  {
                    label: "Net Weight",
                    name: "Weight",
                    require: true,
                    placeholder: "Net Weight",
                  },
                  {
                    label: "Colors",
                    name: "Color",
                    placeholder: "red , green , blue , yellow",
                  },
                ].map((field, idx) => (
                  <section key={idx} className="flex flex-col">
                    {field.name !== "brand" ? (
                      <>
                        <label
                          htmlFor={field.name}
                          className="font-bold text-sm mb-2"
                        >
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-[#F60002]">*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          id={field.name}
                          placeholder={field.placeholder}
                          className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={dataForCurrentIndex?.[field.name] || ""}
                          onChange={handleChange}
                          // required={true}
                        />
                      </>
                    ) : (
                      <div className="flex flex-col items-start justify-center">
                        <hr />
                        <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
                          Brand
                        </h3>
                        {/**new one --------------------> */}
                        <BrandDropdownWithSearch
                          brand_={brand_}
                          handleChange={handleChange}
                        />
                      </div>
                    )}
                  </section>
                ))}
              </section>
                
              {/* <hr className="mt-7"/> */}
              {/**dynamic attribute validation */}
              <h3 className={`font-bold text-xl lg:text-2xl text-start mt-10 mb-6 ${makeVisible?'':'hidden'}`}>
                Attributes
              </h3>
              <hr className="mb-6" />
              <div className="mt-7">
                {makeVisible && 
                  dynamicAttributes?(
                    <DynamicForm attributes={dynamicAttributes} setFormData={setFormData} setglobalFormData={setglobalFormData} currentIndex={currentIndex} />
                  ):null
                }
              
              </div>
             

              {/** Size Details */}
              <h3 className={`font-bold text-xl lg:text-2xl text-start mt-10 mb-6 ${makeVisible?'':'hidden'}`}>
                Size Details
              </h3>
              <hr className="mb-6" />
              <section className="flex flex-col mt-6">
                <label className={`font-bold text-sm mb-2 ${makeVisible?'':'hidden'}`}>Select Sizes:</label>
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-full bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${makeVisible?'':'hidden'}`}
                >
                  Choose Sizes
                </button>
                {showDropdown && (
                  <div className="mt-4">
                    {/* {
                      console.log(availableSizes,availableSizes.length,'isdafalfdka;')
                    } */}
                    {availableSizes.length>0 && (availableSizes.map((size,index) => (
                      <div key={index}>
                        <label className="flex flex-row gap-4 flex-wrap items-center">
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(size)}
                            checked={selectedSizes.includes(size)}
                          />
                          <span className="ml-2">{size}</span>
                        </label>
                      </div>
                    )))}
                    <button
                      type="button"
                      onClick={handleApply}
                      className="mt-4 bg-customPurple text-white px-4 py-2 rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </section>

              {formData[currentIndex]?.Size &&
                Object.keys(formData[currentIndex]?.Size).length > 0 && (
                  <div className="mt-6">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            Size
                          </th>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            Trialshopy Price
                          </th>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            Defective Price
                          </th>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            MRP
                          </th>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            Inventory
                          </th>
                          <th className="py-2 px-4 bg-gray-100 border-b">
                            SKU ID
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(formData[currentIndex]?.Size).map(
                          (size) => (
                            <tr key={size}>
                              <td className="py-2 px-4 border-b">
                                <strong>{size}</strong>
                              </td>
                              {[
                                { name: "trialshopyPrice" },
                                { name: "defectivePrice" },
                                { name: "MRP" },
                                { name: "Inventory" },
                                { name: "SkuId" },
                              ].map((field, idx) => (
                                <td key={idx} className="py-2 px-4 border-b">
                                  <input
                                    type="text"
                                    name={`${field.name}-${size}`}
                                    id={`${field.name}-${size}`}
                                    placeholder={field.name}
                                    className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                    value={
                                      formData[currentIndex]?.Size?.[size]?.[
                                        field.name
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(e, size, field.name)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              {/**---------------------------------------------------------------- Rent Section ------------------------------------------------------------ */}

              {forRent ? (
                <>
                  <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
                    Rent Section
                  </h3>
                  <hr className="mb-6" />

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="flex flex-col">
                      <label htmlFor="Rent" className="font-bold text-sm mb-2">
                        Rent Money Per Hour{" "}
                        <span className="text-[#F60002]">*</span>
                      </label>
                      <input
                        name="RentPerHour"
                        id="RentPerHour"
                        placeholder="Rent Per Hour"
                        className="p-2 bg-gray-50 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dataForCurrentIndex?.RentPerHour || ""}
                        onChange={handleChange}
                      />
                    </section>
                  </section>
                </>
              ) : null}

              {/** Description section */}
              <div className="flex flex-wrap gap-4 justify-between items-center mt-10 mb-6">
                <h3 className="font-bold text-xl lg:text-2xl text-start">
                  Description
                </h3>
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={isGeneratingDesc || !dataForCurrentIndex?.productName || !active_categories}
                  className="bg-customPurple text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isGeneratingDesc ? "Generating..." : "✨ Generate Description with AI"}
                </button>
              </div>
              <hr className="mb-6" />

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="flex flex-col">
                  <label
                    htmlFor="shortDescription"
                    className="font-bold text-sm mb-2"
                  >
                    Short Description <span className="text-[#F60002]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="shortDescription"
                    id="shortDescription"
                    placeholder="Enter a short description"
                    className="p-2 bg-gray-50 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dataForCurrentIndex?.shortDescription || ""}
                    onChange={handleChange}
                  ></textarea>
                </section>

                <section className="flex flex-col">
                  <label
                    htmlFor="fullDescription"
                    className="font-bold text-sm mb-2"
                  >
                    Full Description
                  </label>
                  <textarea
                    rows={3}
                    name="fullDescription"
                    id="fullDescription"
                    placeholder="Enter a full description"
                    className="p-2 bg-gray-50 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dataForCurrentIndex?.fullDescription || ""}
                    onChange={handleChange}
                  ></textarea>
                </section>
              </section>

              {/** Additional Details */}
              <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
                Additional Details
              </h3>
              <hr className="mb-6" />

              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    label: "GST Number",
                    name: "gstNumber",
                    required: true,
                    placeholder: "Enter GST Number",
                  },
                  {
                    label: "SGST Number",
                    name: "sgstNumber",
                    placeholder: "Enter SGST Number",
                  },
                  {
                    label: "HSN Code",
                    name: "HSNcode",
                    placeholder: "HSNCode",
                  },
                  {
                    label: "Country of Origin",
                    name: "countryOfOrigin",
                    required: true,
                    type: "select",
                    options: [
                      { value: "", label: "Select Country", disabled: true },
                      { value: "India", label: "India" },
                      { value: "USA", label: "USA" },
                      { value: "China", label: "China" },
                      { value: "Germany", label: "Germany" },
                      { value: "UK", label: "UK" },
                      { value: "Other", label: "Other" },
                    ],
                  },
                ].map((field, idx) => (
                  <section key={idx} className="flex flex-col">
                    <label
                      htmlFor={field.name}
                      className="font-bold text-sm mb-2"
                    >
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-[#F60002]">*</span>
                      )}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        id={field.name}
                        className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dataForCurrentIndex?.[field.name] || ""}
                        onChange={handleChange}
                      >
                        {field.options.map((option, i) => (
                          <option
                            key={i}
                            value={option.value}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={field.name}
                        id={field.name}
                        placeholder={field.placeholder}
                        className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={dataForCurrentIndex?.[field.name] || ""}
                        onChange={handleChange}
                      />
                    )}
                  </section>
                ))}
              </section>
            </section>
          </div>

          {/** Handling side images */}
          <div className="flex flex-col items-center w-full lg:w-[30%] space-y-4">
            <h5 className="text-xl font-semibold text-gray-800 mb-4">
              Add images with details listed here
            </h5>

            {/**static side image */}
            <div className="flex flex-col  gap-6 mb-6">
              {/* Front Image */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                <figure className="mb-2">
                  <img
                    alt="Front View"
                    height="56"
                    width="56"
                    src="https://m.media-amazon.com/images/I/811yVGR87SS._UX500_.jpg"
                    className="mb-2"
                  />
                  <figcaption className="flex justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M9.167 15.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM17.5 17.5l-3.625-3.625M9.167 6.667v5m-2.5-2.5h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </figcaption>
                </figure>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Front Image <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Add a clear front image per pic
                  </p>
                </div>
              </div>

              {/* Side Image */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                <figure className="mb-2">
                  <img
                    alt="Side View"
                    height="56"
                    width="56"
                    src="https://m.media-amazon.com/images/I/714aZ9SdxXL._UX500_.jpg"
                    className="mb-2"
                  />
                  <figcaption className="flex justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M9.167 15.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM17.5 17.5l-3.625-3.625M9.167 6.667v5m-2.5-2.5h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </figcaption>
                </figure>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Side Image <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Add a side image of the product
                  </p>
                </div>
              </div>

              {/* Back Image */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                <figure className="mb-2">
                  <img
                    alt="Back View"
                    height="56"
                    width="56"
                    src="https://m.media-amazon.com/images/I/816rus6Ac-L._UX500_.jpg"
                    className="mb-2"
                  />
                  <figcaption className="flex justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M9.167 15.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM17.5 17.5l-3.625-3.625M9.167 6.667v5m-2.5-2.5h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </figcaption>
                </figure>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Back Image <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Add a clear back image per picture
                  </p>
                </div>
              </div>

              {/* Close-up View */}
              <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-lg">
                <figure className="mb-2">
                  <img
                    alt="Close-up View"
                    height="56"
                    width="56"
                    src="https://m.media-amazon.com/images/I/7110201MxKL._UX500_.jpg"
                    className="mb-2"
                  />
                  <figcaption className="flex justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M9.167 15.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM17.5 17.5l-3.625-3.625M9.167 6.667v5m-2.5-2.5h5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </figcaption>
                </figure>
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Close-up View <span className="text-red-500">*</span>
                  </p>
                  <p className="text-sm text-gray-600">Add a close-up image</p>
                </div>
              </div>
            </div>

            {/* Add Images Button */}
            <button
              className="bg-customPurple text-center px-4 py-2 rounded-lg text-white shadow-md hover:bg-purple-700 transition-colors duration-300 w-full"
              onClick={() => fileInputRef.current.click()}
            >
              Add Images of Product from Different Angles
            </button>
            {/* <button
              className="bg-customPurple text-center px-4 py-2 rounded-lg text-white shadow-md hover:bg-customPurple transition-colors duration-300 w-full"
              onClick={() => fileInputRef.current.click()}
            >
              Add Images of Product from Different Angles
            </button> */}

            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {imageLoader ? (
              "loading....."
            ) : (
              <div className="overflow-x-scroll h-36 w-full flex flex-row gap-4 px-2 lg:px-0">
                {dataForCurrentIndex?.Images?.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    {imageLoader ? (
                      "Loading..."
                    ) : (
                      <img
                        src={image?.url}
                        alt={`Uploaded image ${index + 1}`}
                        className="rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-300 w-[100px] h-[100px]"
                        onClick={() => handleChangeIndexClick(index)}
                      />
                    )}

                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors duration-300"
                      onClick={() => handleRemoveImage(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Virtual Try-On Image Section */}
            <div className="mt-8 border-t pt-6">
              <p className="text-lg font-medium text-gray-800">
                Virtual Try-On Image <span className="text-gray-500 text-sm">(Optional)</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Upload a flat-lay or hanging photo of just the garment (no model wearing it). Optional — enables Virtual Try-On for customers.
              </p>
              <button
                className="bg-customPurple text-center px-4 py-2 rounded-lg text-white shadow-md hover:bg-purple-700 transition-colors duration-300 w-full mb-4"
                onClick={() => tryOnFileRef.current.click()}
              >
                Upload Virtual Try-On Image
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={tryOnFileRef}
                onChange={handleTryOnFileChange}
              />
              {dataForCurrentIndex?.tryOnImage && (
                <div className="relative inline-block mt-2">
                  <img
                    src={dataForCurrentIndex.tryOnImage}
                    alt="Virtual Try-On"
                    className="rounded-lg object-cover w-[100px] h-[100px]"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                    onClick={() => {
                      setFormData(prev => ({...prev, [currentIndex]: {...prev[currentIndex], tryOnImage: ""}}));
                      setglobalFormData(prev => ({...prev, [currentIndex]: {...prev[currentIndex], tryOnImage: ""}}));
                    }}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Basic_info;
