import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MerchantPopup = ({ dataStore, isShow, setIsShow }) => {
  console.log(dataStore, "wow");
  const [isEditing, setIsEditing] = useState(false);

  const [storeName, setStoreName] = useState(dataStore?.storeName || "");
  const [storeDescription, setStoreDescription] = useState(
    dataStore?.storeDescription || ""
  );
  const [gstId, setGstId] = useState(dataStore?.gstId || "");
  const [status, setStatus] = useState(dataStore?.status || "active");
  const [categories, setCategories] = useState(
    dataStore?.categories?.map((cat) => cat.name).join(", ") || []
  );
  const [rating, setRating] = useState(dataStore?.rating?.rating || "N/A");
  const [followers, setFollowers] = useState(dataStore?.followers?.count || 0);
  const [varification, setVerification] = useState(
    dataStore.varification || "Process"
  );
  const [addressLine, setAddressLine] = useState(dataStore?.addressLine || "");
  const [city, setCity] = useState(dataStore?.city || "");
  const [pincode, setPincode] = useState(dataStore?.pincode || "");
  const [landmark, setLandmark] = useState(dataStore?.landmark || "");
  const [state, setState] = useState(dataStore?.state || "");
  const [country, setCountry] = useState(dataStore?.country || "");

  useEffect(() => {
    if (dataStore) {
      setStoreName(dataStore.storeName || "");
      setStoreDescription(dataStore.storeDescription || "");
      setGstId(dataStore.gstId || "");
      setStatus(dataStore.status || "active");
      setCategories(
        dataStore.categories?.map((cat) => cat.name).join(", ") || []
      );
      setRating(dataStore.rating?.rating || "N/A");
      setFollowers(dataStore.followers?.count || 0);

      setVerification(dataStore.varification || "Process");
      setAddressLine(dataStore.addressLine || "");
      setCity(dataStore.city || "");
      setPincode(dataStore.pincode || "");
      setLandmark(dataStore.landmark || "");
      setState(dataStore.state || "");
      setCountry(dataStore.country || "");
    }
  }, [dataStore]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    const formData = {
      storeName,
      storeDescription,
      gstId,
      status,
      categories,
      rating,
      varification,
      addressLine,
      city,
      pincode,
      landmark,
      state,
      country,
    };

    console.log(formData, "D");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateStore/${
          dataStore._id
        }`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "okkkkkkkkkkkkkkkkk");
      if (response.status === 200) {
        setIsShow(false);
        toast.success("Store Updated Successfully");
        // Update the state with new data if needed
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const handleCancel = () => {
    setIsShow(false);
    // Reset all fields to initial values if needed
    setStoreName(dataStore?.storeName || "");
    setStoreDescription(dataStore?.storeDescription || "");
    setGstId(dataStore?.gstId || "");
    setStatus(dataStore?.status || "active");
    setCategories(
      dataStore?.categories?.map((cat) => cat.name).join(", ") || ""
    );
    setRating(dataStore?.rating?.rating || "N/A");

    setVerification(dataStore.varification || "Process");
    setAddressLine(dataStore?.addressLine || "");
    setCity(dataStore?.city || "");
    setPincode(dataStore?.pincode || "");
    setLandmark(dataStore?.landmark || "");
    setState(dataStore?.state || "");
    setCountry(dataStore?.country || "");
    setIsEditing(false);
  };

  return (
    <div
      className={`fixed overflow-auto top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isShow ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[780px] my-16 mx-auto rounded-lg shadow-lg pb-11 px-5">
        <div className="flex justify-between items-center p-5">
          <h2 className="text-2xl font-bold mb-4">Store Details</h2>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Store Name:</label>
            <input
              type="text"
              name="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Description:</label>
            <input
              type="text"
              name="storeDescription"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">GST ID:</label>
            <input
              type="text"
              name="gstId"
              value={gstId}
              onChange={(e) => setGstId(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Status:</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Categories:</label>
            <input
              type="text"
              name="categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Rating:</label>
            <input
              type="text"
              name="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Verification:</label>
            <select
              name="varification"
              value={varification}
              onChange={(e) => setVerification(e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="Submitted">Submitted</option>
              <option value="Varified">Varified</option>
              <option value="Failed">Failed</option>
              <option value="Process">Process</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Address Line:</label>
            <input
              type="text"
              name="addressLine"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">City:</label>
            <input
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Landmark:</label>
            <input
              type="text"
              name="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">State:</label>
            <input
              type="text"
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Country:</label>
            <input
              type="text"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              readOnly={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
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
      </div>
    </div>
  );
};

export default MerchantPopup;
