"use client";
import React, { useState, useEffect, useContext } from "react";
import RemoveAddress from "./RemoveAddress";
import AddAddress from "./AddAddress";
import EditAddress from "./EditAddress";
import { UserContext } from "@/lib/UserContext";

const AddressComponent = () => {
  const [authenticated, setAuthenticated] = useContext(UserContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressToDelete, setAddressToDelete] = useState(null); // Store the address to delete
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const serverURL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const fetchAddresses = () => {
    if (authenticated.user?._id) {
      const apiUrl = `${serverURL}/api/v1/address/user/${authenticated.user?._id}`;
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => setAddresses(data))
        .catch((error) => console.error("Error fetching addresses:", error));
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [serverURL, authenticated.user]);

  const handleRemoveClick = (address) => {
    setAddressToDelete(address);
    setShowConfirmation(true);
  };

  const handleAddAddress = () => {
    fetchAddresses();
  };

  const handleEditAddress = () => {
    fetchAddresses();
    setShowEditAddress(false);
  };

  const toggleAddAddress = () => {
    setShowAddAddress(!showAddAddress);
  };

  const toggleEditAddress = () => {
    setShowEditAddress(!showEditAddress);
  };

  const handleDeleteAddress = () => {
    if (addressToDelete) {
      const apiUrl = `${serverURL}/api/v1/address/${addressToDelete._id}/status`;
      fetch(apiUrl, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then(() => {
          fetchAddresses(); // Re-fetch from server after delete
        })
        .catch((error) => console.error("Error deleting address:", error));
    }
    setShowConfirmation(false);
  };

  return (
    <div className="relative">
      <div className="px-6">
        <div className="flex justify-between p-2 items-center">
          <div className="font-bold font-Poppins font-500 text-gray-900">
            Saved Addresses
          </div>
          <button
            className="text-gray-900 font-bold p-2 rounded border"
            onClick={() => setShowAddAddress(true)}
          >
            + ADD NEW ADDRESS
          </button>
        </div>

        {addresses?.length > 0 ? (
          addresses.map((address, index) => (
            <div
              className="w-full items-center shadow-lg my-10"
              key={address._id}
            >
              <div className="box-shadow p-10 -mt-5">
                <div className="font-bold font-poppins uppercase">
                  {address.type} Address
                </div>
                <div className="flex justify-between items-center my-5">
                  <div className="font-bold text-lg">{address.fullName}</div>
                  <button className="text-black font-bold py-2 px-4 rounded border bg-gray-200">
                    {address.type}
                  </button>
                </div>
                <div className="font-semibold text-gray-800 my-2">
                  {address.addressLine}
                </div>
                <div className="text-left text-gray-500 my-2">
                  {`${address.city}, ${address.state} ${address.pincode}, ${address.country}`}
                </div>
                <div className="text-gray-700 my-2 font-medium">
                  Contact: {address.PhoneNumber || address.phoneNumber}
                </div>
                <div className="text-gray-500 my-2">
                  Status: {address.status}
                </div>
                <hr className="border border-gray-400 mt-2" />
                <div className="flex justify-between text-center mt-0 mx-auto">
                  <button
                    className="font-bold text-center mx-auto text-orange-500"
                    onClick={() => {
                      setAddressToEdit(address);
                      setShowEditAddress(true);
                    }}
                  >
                    EDIT
                  </button>
                  <hr className="border border-gray-400 mx-4 h-9" />
                  <button
                    className="font-bold rounded text-center mx-auto text-orange-500"
                    onClick={() => handleRemoveClick(address)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No Address Saved Yet!</p>
        )}
      </div>
      {showConfirmation && (
        <RemoveAddress
          address={addressToDelete}
          onDelete={handleDeleteAddress}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
      {/* {showAddAddress && (
				<AddAddress
					onAdd={handleAddAddress}
					onCancel={() => setShowAddAddress(false)}
				/>
			)} */}

      {showAddAddress && (
        <AddAddress onAdd={handleAddAddress} onClose={toggleAddAddress} />
      )}
      {showEditAddress && (
        <EditAddress
          existingAddress={addressToEdit}
          onSave={handleEditAddress} // You need to define handleEditAddress function
          onCancel={() => toggleEditAddress()}
        />
      )}
    </div>
  );
};

export default AddressComponent;
