import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../components/context/UserContext";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const EditProductAttributes = ({ categories, productId, productData, submit_it }) => {
  const [dynamicAttributes, setDynamicAttributes] = useState([]);
  const [attributeData, setAttributeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const buttonRef = useRef();
  const navigate = useNavigate(); 

  useEffect(() => {
    console.log(submit_it,' value ')
    if (submit_it) {
      buttonRef.current.click();
    }
  }, [submit_it]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/categories/${categories}`
      );
      console.log("Fetched Category Response:", response.data);

      if (
        response.data.message === "success" &&
        response.data.result.attributes.length > 0
      ) {
        const attributes = response.data.result?.attributes || [];
        console.log("Fetched Attributes:", attributes);
        const filteredAttributes = attributes.filter(
          (attribute) => attribute.name !== "Size"
        );

        setDynamicAttributes(filteredAttributes);
        const savedAttributeData = {};
        filteredAttributes.forEach((attribute) => {
          if (productData && productData.attributes) {
            savedAttributeData[attribute.name] = productData.attributes[attribute.name] || "";
          } else {
            savedAttributeData[attribute.name] = "";
          }
        });
        console.log("Saved Attribute Data:", savedAttributeData);
        setAttributeData(savedAttributeData);
      } else {
        console.log("No attributes found or error in response");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const handleAttributeChange = (e, attributeName) => {
    const { value } = e.target;
    setAttributeData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[attributeName] = value;
      return updatedData;
    });
  };

  const handleAttributeUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`,
        {
          sellerId,
          attributes: attributeData,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

    //   if (response.data.success) {
    //     toast.success("Product Updated Successfully");
    //     // navigate("/Products");
    //   }
    } catch (error) {
      toast.error("An error occurred while updating attributes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <section className="p-6 lg:p-8 bg-white rounded-lg">
        <div className="mt-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-100 border-b">Attribute</th>
                <th className="py-2 px-4 bg-gray-100 border-b">Option</th>
                <th className="py-2 px-4 bg-gray-100 border-b">Value</th>
              </tr>
            </thead>
            <tbody>
              {dynamicAttributes.map((attribute) => (
                <tr key={attribute._id}>
                  <td className="py-2 px-4 border-b">
                    <strong>{attribute.name}</strong>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {attribute.type === "select" ? (
                      <select
                        className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={attributeData[attribute.name] || ""}
                        onChange={(e) => handleAttributeChange(e, attribute.name)}
                        name="option"
                      >
                        <option value="">Select</option>
                        {(attribute.options || []).map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="value"
                        placeholder="Enter value"
                        className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={attributeData[attribute.name] || ""}
                        onChange={(e) => handleAttributeChange(e, attribute.name)}
                      />
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {attribute.type === "select" ? (
                      <span>{attributeData[attribute.name] || "Not Selected"}</span>
                    ) : (
                      <span>{attributeData[attribute.name] || "No Value"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={handleAttributeUpdate}
          className="bg-customPurple hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-4"
          ref={buttonRef}
        >
          Save Attributes Details
        </button>
      </section>
    </div>
  );
};

export default EditProductAttributes;
