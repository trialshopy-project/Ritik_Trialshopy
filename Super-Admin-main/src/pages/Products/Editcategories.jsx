import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineClose } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditCategories = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const id = search.get("id");
  const [images, setImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    featured: false,
    status: "active",
    SubCategory: [],
    attributes: [{ name: "", type: "text", options: [] }],
  });
  const [subCategories, setSubCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [categoriesFetched, setCategoriesFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch category data to edit
    if (!id) {
      console.error("Category ID is undefined. Cannot fetch category data.");
      return;
    }

    // const [images, setImage] = useState(null);

    // const registerDataChange = (e) => {
    //   const reader = new FileReader();

    //   reader.onload = () => {
    //     if (reader.readyState === 2) {
    //       setImage([reader.result]);
    //     }
    //   };

    //   reader.readAsDataURL(e.target.files[0]);
    // };

    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/${id}`
        );
        const category = res.data.category;
        const subcategory = res.data.subCategory;
        console.log(res.data.category);
        setFormData({
          name: category.name,
          description: category.description,
          parent: category.parent || "",
          featured: category.featured,
          status: category.status,
          // SubCategory:res.data.SubCategory,
          attributes: category.attributes.length
            ? category.attributes
            : [{ name: "", type: "text", options: [] }],
        });
        setImage([category.image.url]);
        setSubCategories(subcategory);
      } catch (error) {
        console.error("Error fetching category details:", error);
      }
    };
    fetchCategory();
  }, [id]);

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

  const registerDataChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage([reader.result]);
        // console.log(images);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
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
  const [imageurl,setimageurl]=useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images) {
      toast.error("Please Upload Image");
      return;
    } 
    let imageUrl = images[0];
    
    // console.log(imageUrl)
    // If the image was changed, upload it
    if (typeof images[0] === "string") {
      const responseData = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
        { images:images}
        
      )
      // console.log(response.message);
      imageUrl = responseData.data.urls[0];
    }

    // setimageurl(images[0]);
    // console.log('object',images[0])
    //   if (typeof imageurl === "string" && imageurl.trim() !== "") {
    //     try {
    //       const responseData = await axios.post(
    //         `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
    //         { images: images[0] }
    //       );
          
    //       if (responseData.data && responseData.data.urls && responseData.data.urls.length > 0) {
    //         setimageurl(responseData.data.urls[0]);
    //         console.log('Image URL is:', responseData.data.urls[0]);
    //       } else {
    //         console.error('Unexpected response format:', responseData);
    //       }
    //     } catch (error) {
    //       console.error('Error uploading image:', error);
    //     }
    // // else {
    // //     console.error('Invalid image URL:', imageurl);
    // //   }
    const validAttributes = formData.attributes.every(
      (attr) => attr.type.trim() !== ""
    );
    if (!validAttributes) {
      alert("Please specify a type for all attributes.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/categories/${id}`,
        {
          ...formData,
          image: imageUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Category updated successfully");
        navigate("../products/category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/subcategories/${id}`
      );
      console.log(response.data);
      setSubCategories((prevSubCategories) =>
        prevSubCategories.filter((subCategory) => subCategory._id !== id)
      );
      toast.success("Subcategory deleted successfully");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("Failed to delete subcategory");
    }
  };

  const handleEdit = async ( id) => {
  //   // //http://localhost:5173/Products/Category/editcategories?id=66a6994a26eaf594470aaa4b
    navigate(`/Products/Category/editcategories?id=${id}`)
  // alert(id)
  
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="font-bold m-5 flex items-center text-lg">
          <BsPeopleFill className="mr-2" size={22} />
          Edit Category
        </div>

        {/* Close */}
        <div className="flex mr-4">
          <div
            className="flex items-stretch my-4 focus:bg-gray-900"
            onClick={() => {
              navigate("../products/category");
            }}
          >
            <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none">
              <AiOutlineClose className="mr-2 scale-125 border bg-white rounded-full fill-gray-900" />
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Update Category</h2>
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
              {parentCategories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Image:(size should be upto 100 Kb)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*" //any type of image acceptable
              autoComplete="off"
              onChange={registerDataChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {images && (
              <img
                src={images[0]}
                alt="Selected"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>

          <div className="flex items-center">
            <label className="block mb-2 text-sm font-medium text-gray-700 mr-4">
              Featured{" "}
              <span className="text-purple-500">(show on homepage)</span>:
            </label>
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
            />
          </div>

          {/* <div>
            <h1>SubCategories</h1>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subCategories.map((subCategory) => (
                  <tr key={subCategory._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {subCategory.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subCategory.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row justify-between">
                      <button
                        onClick={() => handleEdit(subCategory._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(subCategory._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}

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

          <div className="my-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Attributes:
            </label>
            {formData.attributes.map((attribute, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Attribute Name"
                  value={attribute.name}
                  onChange={(e) =>
                    handleAttributeChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <select
                  value={attribute.type}
                  onChange={(e) =>
                    handleAttributeChange(index, "type", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                >
                  <option value="">Select Type</option>
                  <option value="text">Text</option>
                  <option value="select">Dropdown</option>
                </select>
                {attribute.type === "select" && (
                  <div className="pl-4">
                    {attribute.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index, optionIndex)}
                          className="ml-2 px-2 py-1 text-sm bg-red-600 text-white rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddOption(index)}
                      className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      Add Option
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(index)}
                  className="mt-2 px-2 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Remove Attribute
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAttribute}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
            >
              Add Attribute
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
            >
              {loading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategories;
