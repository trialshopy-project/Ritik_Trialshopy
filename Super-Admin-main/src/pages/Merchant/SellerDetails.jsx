import React from "react";

const SellerDetails = ({ sellerData, isShowDetails, setIsShowDetails }) => {
  const handleCancel = () => {
    setIsShowDetails(false);
  };

  return (
    <div
      className={`fixed overflow-auto top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 ${
        isShowDetails ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-[600px] my-16 mx-auto rounded-lg shadow-lg pb-11 px-5">
        <div className="flex flex-col justify-between items-center">
          <div className="p-8">
            <div className="uppercase flex items-center justify-between tracking-wide text-sm text-indigo-500 font-semibold">
              Seller Details
              <button
                onClick={handleCancel}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                X
              </button>
            </div>
            <div className="my-5 flex items-start justify-start">
              <img
                className="w-28 h-28 rounded-full"
                src={sellerData?.avatar?.url}
                alt=""
              />
            </div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">
              Name:{" "}
              {`${sellerData?.firstName} ${sellerData?.middleName} ${sellerData?.lastName}`}
            </p>
            <p className="mt-2 text-gray-500">Email: {sellerData?.email}</p>
            <p className="mt-2 text-gray-500">
              Phone Number: {sellerData?.phoneNumber}
            </p>
            <p className="mt-2 text-gray-500">
              Alternate Phone Number: {sellerData?.alternatePhoneNumber}
            </p>
            <p className="mt-2 text-gray-500">City: {sellerData?.city}</p>
            <p className="mt-2 text-gray-500">State: {sellerData?.state}</p>
            <p className="mt-2 text-gray-500">Country: {sellerData?.country}</p>
            <p className="mt-2 text-gray-500">Role: {sellerData?.role}</p>
            <p className="mt-2 text-gray-500">
              Store ID: {sellerData?.storeId}
            </p>
            <p className="mt-2 text-gray-500">
              Access Level: {sellerData?.access_level}
            </p>
            <p className="mt-2 text-gray-500">Status: {sellerData?.status}</p>
            <p className="mt-2 text-gray-500">
              Languages: {sellerData?.language?.join(", ") || "None"}
            </p>
            <p className="mt-2 text-gray-500">
              Address: {sellerData?.addressLine}
            </p>
            <p className="mt-2 text-gray-500">Pincode: {sellerData?.pincode}</p>
            <p className="mt-2 text-gray-500">
              Landmark: {sellerData?.landmark}
            </p>
            <p className="mt-2 text-gray-500">
              Document Verification Status:{" "}
              {sellerData?.documentVerification?.status}
            </p>
            <div className="mt-2 text-gray-500">
              Documents:
              <ul>
                {sellerData?.documentVerification?.documents?.map(
                  (doc, index) => (
                    <li key={index}>
                      <a
                        href={`${import.meta.env.VITE_API_ENDPOINT}/${doc.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {doc.name}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetails;
