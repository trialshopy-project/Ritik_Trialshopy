import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditSeller = ({
  sellerData,
  isShowSeller,
  setIsShowSeller,
  fetchData,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: sellerData?.firstName || "",
    middleName: sellerData?.middleName || "",
    lastName: sellerData?.lastName || "",
    email: sellerData?.email || "",
    phoneNumber: sellerData?.phoneNumber || "",
    alternatePhoneNumber: sellerData?.alternatePhoneNumber || "",
    addressLine: sellerData?.addressLine || "",
    city: sellerData?.city || "",
    pincode: sellerData?.pincode || "",
    state: sellerData?.state || "",
    country: sellerData?.country || "",
    role: sellerData?.role || "seller",
    isBlocked: sellerData?.isBlocked || false,
    access_level: sellerData?.access_level || "",
    status: sellerData?.status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    setFormData({
      firstName: sellerData?.firstName || "",
      middleName: sellerData?.middleName || "",
      lastName: sellerData?.lastName || "",
      email: sellerData?.email || "",
      phoneNumber: sellerData?.phoneNumber || "",
      alternatePhoneNumber: sellerData?.alternatePhoneNumber || "",
      addressLine: sellerData?.addressLine || "",
      city: sellerData?.city || "",
      pincode: sellerData?.pincode || "",
      state: sellerData?.state || "",
      country: sellerData?.country || "",
      role: sellerData?.role || "seller",
      isBlocked: sellerData?.isBlocked || false,
      access_level: sellerData?.access_level || "",
      status: sellerData?.status || "",
    });
  }, [sellerData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateSeller/${
          sellerData._id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setIsShowSeller(false);
        fetchData();
        toast.success("Seller Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const handleCancel = () => {
    setIsShowSeller(false);
    // Reset all fields to initial values if needed
    setFormData({
      firstName: sellerData?.firstName || "",
      middleName: sellerData?.middleName || "",
      lastName: sellerData?.lastName || "",
      email: sellerData?.email || "",
      phoneNumber: sellerData?.phoneNumber || "",
      alternatePhoneNumber: sellerData?.alternatePhoneNumber || "",
      addressLine: sellerData?.addressLine || "",
      city: sellerData?.city || "",
      pincode: sellerData?.pincode || "",
      state: sellerData?.state || "",
      country: sellerData?.country || "",
      role: sellerData?.role || "seller",
      isBlocked: sellerData?.isBlocked || false,
      access_level: sellerData?.access_level || "",
      status: sellerData?.status || "",
    });
  };

  return (
    <div
      className={`fixed overflow-auto top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isShowSeller ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[980px] my-16 mx-auto rounded-lg shadow-lg pb-11 px-5">
        <div className="flex justify-between items-center p-5">
          <h2 className="text-2xl font-bold mb-4">Update Seller</h2>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              X
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start w-full mt-3">
          <div className="w-full flex items-center justify-start">
            <div className="w-full">
              <form onSubmit={handleSubmit}>
                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="firstName" className="mb-2">
                      {formData.firstName ? (
                        "First Name"
                      ) : (
                        <span>
                          First Name <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Enter Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="middleName" className="mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      id="middleName"
                      name="middleName"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Enter Name"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="lastName" className="mb-2">
                      {formData.lastName ? (
                        "Last Name"
                      ) : (
                        <span>
                          Last Name <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Enter Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="email" className="mb-2">
                      {formData.email ? (
                        "Email"
                      ) : (
                        <span>
                          Email <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="user@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="phoneNumber" className="mb-2">
                      {formData.phoneNumber ? (
                        "Phone Number"
                      ) : (
                        <span>
                          Phone Number <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      id="phoneNumber"
                      name="phoneNumber"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="(304) 555-0108"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="alternatePhoneNumber" className="mb-2">
                      Alternate Phone Number
                    </label>
                    <input
                      type="number"
                      id="alternatePhoneNumber"
                      name="alternatePhoneNumber"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="(304) 555-0108"
                      value={formData.alternatePhoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="pincode" className="mb-2">
                      {formData.pincode ? (
                        "Pincode"
                      ) : (
                        <span>
                          Pincode <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="430023"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="addressLine" className="mb-2">
                      {formData.addressLine ? (
                        "Address Line"
                      ) : (
                        <span>
                          Address Line <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="addressLine"
                      name="addressLine"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Address Line"
                      value={formData.addressLine}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="city" className="mb-2">
                      {formData.city ? (
                        "City"
                      ) : (
                        <span>
                          City <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="state" className="mb-2">
                      {formData.state ? (
                        "State"
                      ) : (
                        <span>
                          State <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="country" className="mb-2">
                      {formData.country ? (
                        "Country"
                      ) : (
                        <span>
                          Country <span style={{ color: "red" }}>*</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="role" className="mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Role"
                      value={formData.role}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="status" className="mb-2">
                      Status
                    </label>
                    <select
                      type="text"
                      id="status"
                      name="status"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="access_level" className="mb-2">
                      Access Level
                    </label>
                    <input
                      type="text"
                      id="access_level"
                      name="access_level"
                      readOnly={!isEditing}
                      className="box-border flex flex-row justify-center items-center p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      placeholder="Access Level"
                      value={formData.access_level}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col w-full lg:w-1/3 mb-4">
                    <label htmlFor="isBlocked" className="mb-2">
                      Is Blocked
                    </label>
                    <input
                      type="checkbox"
                      id="isBlocked"
                      name="isBlocked"
                      readOnly={!isEditing}
                      className="box-border flex justify-start items-start p-2 gap-2 bg-white border border-gray-500 border-t-0 border-l-0 border-r-0 border-b-1 text-gray-700"
                      checked={formData.isBlocked}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          isBlocked: e.target.checked,
                        }))
                      }
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSeller;
