import React, { useState } from "react";
import Topbar2 from "../../layouts/Topbar2";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [subDescriptions, setSubDescriptions] = useState([""]);
  const [parent, setParent] = useState("");
  const [featured, setFeatured] = useState(false);

  const navigate = useNavigate();

  const [avatar, setAvatar] = useState("/Profile.png");

  const fileUploadDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !avatar) {
      toast.error("Name, Avatar, and Description are required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/categories`,
        {
          name,
          description,
          detailedDescription,
          subDescriptions,
          parent,
          featured,
          avatar,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "response aaya");

      if (response.status === 201) {
        toast.success("Category Created Successfully");
        navigate("/Products/Category");
        setName("");
        setDescription("");
        setDetailedDescription("");
        setSubDescriptions([""]);
        setParent("");
        setFeatured(false);
      }

      console.log(response, "f");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSubDescriptionChange = (index, value) => {
    const updatedSubDescriptions = [...subDescriptions];
    updatedSubDescriptions[index] = value;
    setSubDescriptions(updatedSubDescriptions);
  };

  const addSubDescriptionField = () => {
    setSubDescriptions([...subDescriptions, ""]);
  };

  return (
    <>
      <Topbar2 />
      <div className="flex m-5 w-1/2">
        <div className="font-bold flex items-center justify-between text-lg">
          <p>Categories</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="px-7 flex flex-col gap-5">
          <div>
            <label className="block">
              Name <span className="text-[#F60002]">*</span>
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block">
              Description <span className="text-[#F60002]">*</span>
            </label>
            <textarea
              className="input-field"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block">Detailed Description</label>
            <textarea
              className="input-field"
              placeholder="Enter Detailed Description"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block">Sub Descriptions</label>
            {subDescriptions.map((subDescription, index) => (
              <input
                key={index}
                className="input-field"
                type="text"
                placeholder="Enter Sub Description"
                value={subDescription}
                onChange={(e) =>
                  handleSubDescriptionChange(index, e.target.value)
                }
              />
            ))}
            <button
              type="button"
              onClick={addSubDescriptionField}
              className="bg-gray-700 hover:bg-gray-900 text-white rounded px-4 py-1 mt-2 flex items-center justify-center"
            >
              <AiOutlinePlus /> Add Sub Description
            </button>
          </div>
          <div>
            <label className="block">Parent</label>
            <input
              className="input-field"
              type="text"
              placeholder="Enter Parent Category"
              value={parent}
              onChange={(e) => setParent(e.target.value)}
            />
          </div>
          <div>
            <p>
              Upload Category Image <span className="text-[#F60002]">*</span>
            </p>
            <input
              type="file"
              name="avatar"
              accept="image/*" //any type of image acceptable
              autoComplete="off"
              onChange={fileUploadDataChange}
            />
          </div>
          <div>
            <label className="block">Featured</label>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
          </div>
          <div className="flex items-stretch my-7">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-900 text-white rounded px-4 py-1"
            >
              Add Category
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddCategory;
