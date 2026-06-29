import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    featured: false,
    status: "active",
    attributes: [{ name: "", type: "text", options: [] }],
  });
  const [parentCategories, setParentCategories] = useState([]);
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // For navigation

  const registerDataChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages([reader.result]);
        setImagePreview(reader.result); // Set preview
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const fetchParentCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/`
      );
      setParentCategories(response.data);
      setCategoriesFetched(true);
    } catch (error) {
      console.error("Error fetching parent categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = formData.attributes.map((attribute, i) =>
      i === index ? { ...attribute, [field]: value } : attribute
    );
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleAddAttribute = () => {
    setFormData({
      ...formData,
      attributes: [...formData.attributes, { name: "", type: "", options: [] }],
    });
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleAddOption = (index) => {
    const newAttributes = formData.attributes.map((attribute, i) =>
      i === index
        ? { ...attribute, options: [...attribute.options, ""] }
        : attribute
    );
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleOptionChange = (index, optionIndex, value) => {
    const newAttributes = formData.attributes.map((attribute, i) =>
      i === index
        ? {
            ...attribute,
            options: attribute.options.map((option, oi) =>
              oi === optionIndex ? value : option
            ),
          }
        : attribute
    );
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleRemoveOption = (index, optionIndex) => {
    const newAttributes = formData.attributes.map((attribute, i) =>
      i === index
        ? {
            ...attribute,
            options: attribute.options.filter((_, oi) => oi !== optionIndex),
          }
        : attribute
    );
    setFormData({ ...formData, attributes: newAttributes });
  };

  const handleParentCategoryFocus = () => {
    if (!categoriesFetched) {
      fetchParentCategories();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please Upload Image");
      return;
    }

    try {
      setLoading(true);
      const responseData = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
        { images }
      );

      const validAttributes = formData.attributes.every(
        (attr) => attr.type.trim() !== ""
      );
      if (!validAttributes) {
        toast.error("Please specify a type for all attributes.");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories`,
        {
          ...formData,
          image: responseData.data.urls[0],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Category created successfully");
        navigate("/Products/Category"); // Redirect to category table page
        setFormData({
          name: "",
          description: "",
          parent: "",
          featured: false,
          status: "active",
          attributes: [{ name: "", type: "text", options: [] }],
        });
        setImages([]);
        setImagePreview("");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Parent Category:
          </label>
          <select
            name="parent"
            value={formData.parent}
            onChange={handleInputChange}
            onFocus={handleParentCategoryFocus}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Parent Category</option>
            {parentCategories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Image:
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={registerDataChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover border border-gray-300 rounded"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <label className="block mb-2 text-sm font-medium text-gray-700 mr-4">
            Featured <span className="text-purple-500">(show in NavBar)</span>:
          </label>
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Attributes:
          </label>
          {formData.attributes.map((attribute, index) => (
            <div
              key={index}
              className="mb-4 p-2 border border-gray-300 rounded"
            >
              <div className="flex items-center mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 mr-4">
                  Attribute Name:
                </label>
                <input
                  type="text"
                  value={attribute.name}
                  onChange={(e) =>
                    handleAttributeChange(index, "name", e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex items-center mb-2">
                <label className="block mb-2 text-sm font-medium text-gray-700 mr-4">
                  Type:
                </label>
                <select
                  value={attribute.type || "text"} // Default to "text" if type is empty
                  onChange={(e) =>
                    handleAttributeChange(index, "type", e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded"
                >
                  <option value="text">Text</option>
                  <option value="select">Select</option>
                </select>
              </div>
              {attribute.type === "select" && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Options:
                  </label>
                  {attribute.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-300 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index, optionIndex)}
                        className="ml-2 text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddOption(index)}
                    className="mt-2 text-blue-500"
                  >
                    Add Option
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveAttribute(index)}
                className="text-red-500"
              >
                Remove Attribute
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAttribute}
            className="text-blue-500"
          >
            Add Attribute
          </button>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
