import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../components/context/UserContext";
import Header from "../../layouts/Topbar";

const Editproductsize = () => {
  const [searchParams] = useSearchParams();
  const [productData, setProductData] = useState({});
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const productId = searchParams.get("productId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/categories/${productData?.categories}`
      );
      console.log(response.data);

      if (
        response.data.message === "success" &&
        response.data.result.attributes.length > 0
      ) {
        const attributes = response.data.result?.attributes || [];
        const sizeAttribute = attributes.find((attr) => attr.name === "Size");
        const sizeOptions = sizeAttribute ? sizeAttribute.options : ["free size"];
        setAvailableSizes(sizeOptions);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`
        );
        setProductData(response.data.products);
        setData(response.data.products.Size || {});
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (productData?.categories) {
      fetchCategories();
    }
  }, [productData]);

  const handleSizeChange = (e, size) => {
    const { name, value } = e.target;
    setData((prevData) => {
      const updatedData = { ...prevData };
      if (!updatedData[size]) updatedData[size] = {};
      updatedData[size][name] = value;
      return updatedData;
    });
  };

  const handleSizeUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`,
        {
          sellerId,
          Size: data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Size Information Updated Successfully");
      }
    } catch (error) {
      toast.error("An error occurred while updating size information");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (size) => {
    setSelectedSizes((prevSelected) => {
      const updatedSizes = prevSelected.includes(size)
        ? prevSelected.filter((s) => s !== size)
        : [...prevSelected, size];

      if (!prevSelected.includes(size)) {
        setData((prevData) => ({
          ...prevData,
          [size]: {
            trialshopyPrice: "",
            defectivePrice: "",
            MRP: "",
            Inventory: "",
            SkuId: "",
          },
        }));
      } else {
        setData((prevData) => {
          const { [size]: removed, ...rest } = prevData;
          return rest;
        });
      }

      return updatedSizes;
    });
  };

  const handleApply = () => {
    setShowDropdown(false);
    selectedSizes.forEach((size) => {
      if (!data[size]) {
        setData((prevData) => ({
          ...prevData,
          [size]: {
            trialshopyPrice: "",
            defectivePrice: "",
            MRP: "",
            Inventory: "",
            SkuId: "",
          },
        }));
      }
    });
  };

  useEffect(() => {
    if (data) {
      const sizesWithData = Object.keys(data);
      setSelectedSizes(sizesWithData);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <section className="">
        <Header />
      </section>
      <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full">
          <section className="w-full p-6 lg:p-8 border border-gray-300 bg-white rounded-lg">
            <div>
              <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
                Available Sizes
              </h3>
              <div className="mt-4">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Select Sizes
                </button>
                {showDropdown && (
                  <div className="mt-4">
                    {availableSizes.length > 0 &&
                      availableSizes.map((size, index) => (
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
                      ))}
                    <button
                      type="button"
                      onClick={handleApply}
                      className="mt-4 bg-customPurple text-white px-4 py-2 rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
                Size Details
              </h3>
              <div className="mt-6">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-100 border-b">Size</th>
                      <th className="py-2 px-4 bg-gray-100 border-b">
                        Trialshopy Price
                      </th>
                      <th className="py-2 px-4 bg-gray-100 border-b">
                        Defective Price
                      </th>
                      <th className="py-2 px-4 bg-gray-100 border-b">MRP</th>
                      <th className="py-2 px-4 bg-gray-100 border-b">
                        Inventory
                      </th>
                      <th className="py-2 px-4 bg-gray-100 border-b">SKU ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSizes.map((size) => (
                      <tr key={size}>
                        <td className="py-2 px-4 border-b">
                          <strong>{size}</strong>
                        </td>
                        {["trialshopyPrice", "defectivePrice", "MRP", "Inventory", "SkuId"].map((field) => (
                          <td key={field} className="py-2 px-4 border-b">
                            <input
                              type="text"
                              name={field}
                              id={field}
                              placeholder={field}
                              className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                              value={data[size]?.[field] || ""}
                              onChange={(e) => handleSizeChange(e, size)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSizeUpdate}
              className="bg-customPurple hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Save Size Details
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default Editproductsize;
