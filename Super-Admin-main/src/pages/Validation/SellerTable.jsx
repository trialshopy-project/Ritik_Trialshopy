import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const SellerTable = ({ sellers, handleValidate, handleDelete }) => {
  return (
    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
      <thead className="bg-gray-100 border-b">
        <tr>
          <th className="py-2 px-4 text-left">Aadhar Number</th>
          <th className="py-2 px-4 text-left">PAN Number</th>
          <th className="py-2 px-4 text-left">GSTIN</th>
          <th className="py-2 px-4 text-left">IFSC Code</th>
          <th className="py-2 px-4 text-left">Account Number</th>
          <th className="py-2 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sellers.map(seller => (
          <tr key={seller._id} className="border-b hover:bg-gray-50">
            <td className="py-2 px-4">{seller.documentVerification.aadharNumber}</td>
            <td className="py-2 px-4">{seller.documentVerification.panNumber}</td>
            <td className="py-2 px-4">{seller.documentVerification.gstin}</td>
            <td className="py-2 px-4">{seller.documentVerification.ifscCode}</td>
            <td className="py-2 px-4">{seller.documentVerification.accountNumber}</td>
            <td className="py-2 px-4 text-center">
              <button
                onClick={() => handleValidate(seller._id)}
                className="text-green-500 hover:text-green-700 mx-2"
              >
                <FaCheck size={20} />
              </button>
              <button
                onClick={() => handleDelete(seller._id)}
                className="text-red-500 hover:text-red-700 mx-2"
              >
                <FaTimes size={20} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SellerTable;
