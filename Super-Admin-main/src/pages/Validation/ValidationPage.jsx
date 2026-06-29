import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaSort } from 'react-icons/fa';
import Topbar2 from '../../layouts/Topbar2'; 
axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT;

const ValidationPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState('ASC');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    axios.get('/api/sellers/unvalidated')
      .then(response => {
        setSellers(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching sellers');
        setLoading(false);
      });
  }, []);

  const handleValidate = (id) => {
    axios.put(`/api/sellers/validate/${id}`)
      .then(() => {
        setSellers(sellers.filter(seller => seller._id !== id));
      })
      .catch(() => setError('Error validating seller'));
  };

  const handleDelete = (id) => {
    axios.delete(`/api/sellers/delete/${id}`)
      .then(() => {
        setSellers(sellers.filter(seller => seller._id !== id));
      })
      .catch(() => setError('Error deleting seller'));
  };
  
  const sorting = (col) => {
    if (order === 'ASC') {
      const sorted = [...sellers].sort((a, b) =>
        a.documentVerification[col].toLowerCase() > b.documentVerification[col].toLowerCase() ? 1 : -1
      );
      setSellers(sorted);
      setOrder('DSC');
    } else {
      const sorted = [...sellers].sort((a, b) =>
        a.documentVerification[col].toLowerCase() < b.documentVerification[col].toLowerCase() ? 1 : -1
      );
      setSellers(sorted);
      setOrder('ASC');
    }
  };

  const totalPages = Math.ceil(sellers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sellers.length);
  const currentSellers = sellers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-600">{error}</div>;

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar2 />
      <div className="lg:w-full lg:ml-2 md:ml-20 md:mr-4 sm:mr-4">
        <div className="flex flex-col md:flex-row justify-between md:scale-75% mt-20">
          {/* Search Box */}
          <div className="flex items-center justify-center w-7/12 mt-4">
            <input
              type="text"
              placeholder="Search by Aadhar Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 shadow-lg rounded-full px-6 py-3 w-3/4 md:w-2/3 lg:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg shadow w-screen lg:w-full p-4">
          <div className="flex flex-col gap-4 w-full overflow-x-scroll">
            <div className="rounded-sm border border-gray-200 flex-1">
              <div className="overflow-x-scroll">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-white border-b-2">
                      <th className="py-2 px-4 text-left">S. No.</th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Aadhar Number
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting('aadharNumber')}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          PAN Number
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting('panNumber')}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          GSTIN
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting('gstin')}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          IFSC Code
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting('ifscCode')}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="flex items-center">
                          Account Number
                          <FaSort
                            className="ml-2 hover:cursor-pointer"
                            onClick={() => sorting('accountNumber')}
                          />
                        </div>
                      </th>
                      <th className="py-2 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  {sellers.length > 0 ? (
                    <tbody>
                      {currentSellers.map((seller, index) => (
                        <tr key={startIndex + seller._id} className={index % 2 !== 0 ? 'bg-white' : 'bg-gray-100'}>
                          <td className="py-2 px-4">{startIndex + index + 1}</td>
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
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan="7" className="text-center py-4 text-gray-500">No sellers available.</td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 rounded-md bg-customGray text-white"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`px-4 py-2 mx-1 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-customGray text-white'}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="px-4 py-2 rounded-md bg-customGray text-white"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPage;
