import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function ViewDocument({ verificationData, isShowDocument, setIsShowDocument }) {
  const [aadharNumber, setAadharNumber] = useState(
    verificationData?.aadharNumber || ""
  );
  const [panNumber, setPanNumber] = useState(verificationData?.panNumber || "");
  const [GstinNumber, setGstinNumber] = useState(
    verificationData?.GstinNumber || ""
  );
  const [fullName, setFullName] = useState(verificationData?.fullName || "");
  const [accountNumber, setAccountNumber] = useState(
    verificationData?.accountNumber || ""
  );
  const [ifscNumber, setIfscNumber] = useState(
    verificationData?.ifscNumber || ""
  );
  const [aadharUpload, setAadharUpload] = useState(
    verificationData?.aadharUpload || null
  );
  const [panUpload, setPanUpload] = useState(
    verificationData?.panUpload || null
  );
  const [GstinUpload, setGstinUpload] = useState(
    verificationData?.GstinUpload || null
  );
  const [accountUpload, setAccountUpload] = useState(
    verificationData?.accountUpload || null
  );

  useEffect(() => {
    if (verificationData) {
      setAadharNumber(verificationData?.aadharNumber || "");
      setPanNumber(verificationData?.panNumber || "");
      setGstinNumber(verificationData?.GstinNumber || "");
      setFullName(verificationData?.fullName || "");
      setAccountNumber(verificationData?.accountNumber || "");
      setIfscNumber(verificationData?.ifscNumber || "");
      setAadharUpload(verificationData?.aadharUpload || {});
      setPanUpload(verificationData?.panUpload || {});
      setGstinUpload(verificationData?.GstinUpload || {});
      setAccountUpload(verificationData?.accountUpload || {});
    }
  }, [verificationData]);

  const handleCancel = () => {
    setIsShowDocument(false);
    // Reset all fields to initial values if needed
    setAadharNumber(verificationData?.aadharNumber || "");
    setPanNumber(verificationData?.panNumber || "");
    setGstinNumber(verificationData?.GstinNumber || "");
    setFullName(verificationData?.fullName || "");
    setAccountNumber(verificationData?.accountNumber || "");
    setIfscNumber(verificationData?.ifscNumber || "");
    setAadharUpload(verificationData?.aadharUpload || {});
    setPanUpload(verificationData?.panUpload || {});
    setGstinUpload(verificationData?.GstinUpload || {});
    setAccountUpload(verificationData?.accountUpload || {});
    setIsEditing(false);
  };

  const handleChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleFileChange = (e, setState) => {
    setState(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      aadharNumber,
      panNumber,
      GstinNumber,
      fullName,
      accountNumber,
      ifscNumber,
      aadharUpload,
      panUpload,
      GstinUpload,
      accountUpload,
    };

    try {
      const api = `${import.meta.env.VITE_API_ENDPOINT}/api/v1/updateFormData/${
        verificationData?._id
      }`;

      const response = await axios.put(api, formData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response, "aaya");

      if (response.data.success === true) {
        setIsShowDocument(false);
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const renderFileLink = (file) => {
    if (file) {
      return (
        <div>
          <p>{file.originalname}</p>
          <a
            href={`${import.meta.env.VITE_API_ENDPOINT}/${file.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View File
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`fixed overflow-auto top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isShowDocument ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[700px] my-16 mx-auto rounded-lg shadow-lg pb-11 px-5">
        <div className="flex flex-col justify-between items-center">
          <h2 className="text-2xl font-bold mb-4 mt-5">Varification Details</h2>
          <div className="flex justify-between items-center gap-5 mb-4">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Aadhar Number:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="aadharNumber"
                value={aadharNumber}
                onChange={(e) => handleChange(e, setAadharNumber)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">PAN Number:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="panNumber"
                value={panNumber}
                onChange={(e) => handleChange(e, setPanNumber)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">GSTIN Number:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="GstinNumber"
                value={GstinNumber}
                onChange={(e) => handleChange(e, setGstinNumber)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Full Name:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="fullName"
                value={fullName}
                onChange={(e) => handleChange(e, setFullName)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Account Number:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="accountNumber"
                value={accountNumber}
                onChange={(e) => handleChange(e, setAccountNumber)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">IFSC Number:</label>
              <input
                readOnly={!isEditing}
                type="text"
                name="ifscNumber"
                value={ifscNumber}
                onChange={(e) => handleChange(e, setIfscNumber)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Aadhar Upload:</label>
              <input
                readOnly={!isEditing}
                type="file"
                name="aadharUpload"
                onChange={(e) => handleFileChange(e, setAadharUpload)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {renderFileLink(aadharUpload)}
            <div>
              <label className="block font-medium">PAN Upload:</label>
              <input
                readOnly={!isEditing}
                type="file"
                name="panUpload"
                onChange={(e) => handleFileChange(e, setPanUpload)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {renderFileLink(panUpload)}
            <div>
              <label className="block font-medium">GSTIN Upload:</label>
              <input
                readOnly={!isEditing}
                type="file"
                name="GstinUpload"
                onChange={(e) => handleFileChange(e, setGstinUpload)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {renderFileLink(GstinUpload)}
            <div>
              <label className="block font-medium">Account Upload:</label>
              <input
                readOnly={!isEditing}
                type="file"
                name="accountUpload"
                onChange={(e) => handleFileChange(e, setAccountUpload)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            {renderFileLink(accountUpload)}
            {isEditing && (
              <div className="flex justify-center items-center mt-4">
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
  );
}

export default ViewDocument;
