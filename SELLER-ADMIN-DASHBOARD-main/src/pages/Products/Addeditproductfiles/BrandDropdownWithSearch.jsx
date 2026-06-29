import React, { useState } from 'react';

const BrandDropdownWithSearch = ({ brand_, handleChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
    handleChange(event);
  };

  const filteredBrands = brand_?.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex flex-col items-start justify-center w-auto">
      {/* <div className="flex items-center border rounded p-2 w-auto">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow outline-none"
        />
        <svg
          className="w-4 h-4 text-gray-500 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-4.35-4.35M18 10a8 8 0 10-16 0 8 8 0 0016 0z"
          />
        </svg>
      </div> */}
      <select
        name="brand"
        value={selectedValue}
        onChange={handleSelectChange}
        className="border rounded p-2 w-full mt-2"
      >
        <option>
          Select a Brand
        </option>
        {filteredBrands && filteredBrands.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BrandDropdownWithSearch;
