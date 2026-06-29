import React, { useState, useEffect } from "react";

const EditProductSize = ({ availableSizesProp, setData, makeVisible, sizeDetails ,onChange}) => {
  const [availableSizes, setAvailableSizes] = useState(availableSizesProp);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (sizeDetails) {
      const sizes = Object.keys(sizeDetails);
      setSelectedSizes(sizes);
    }
  }, [sizeDetails]);

  const handleApply = () => {
    setShowDropdown(false);
    
    selectedSizes.forEach((size) => {
      setData((prevData) => {
        const sizeData = prevData.Size || {};
        if (!sizeData[size]) {
          return {
            ...prevData,
            Size: {
              ...sizeData,
              [size]: {
                trialshopyPrice: "",
                defectivePrice: "",
                MRP: "",
                Inventory: "",
                SkuId: "",
              },
            },
          };
        }
        return prevData;
      });
    });
  };

  const handleCheckboxChange = (size) => {
    setSelectedSizes((prevSelected) =>
      prevSelected.includes(size)
        ? prevSelected.filter((s) => s !== size)
        : [...prevSelected, size]
    );

    setData((prevData) => {
      const sizeData = prevData.Size || {};
      if (sizeData[size]) {
        const { [size]: removedSize, ...filteredSizes } = sizeData;
        return {
          ...prevData,
          Size: {
            ...filteredSizes,
          },
        };
      } else {
        return {
          ...prevData,
          Size: {
            ...sizeData,
            [size]: {
              trialshopyPrice: "",
              defectivePrice: "",
              mrp: "",
              Inventory: "",
              SkuId: "",
            },
          },
        };
      }
    });
  };

  const handleInputChange = (e, size, field) => {
    onChange(e)
    const value = e.target.value;
    setData((prevData) => {
      const sizeData = prevData.Size || {};
      return {
        ...prevData,
        Size: {
          ...sizeData,
          [size]: {
            ...sizeData[size],
            [field]: value,
          },
        },
      };
    });
  };

  return (
    <div>
      <hr className="mb-6" />
      <section className="flex flex-col mt-6">
        <label className={`font-bold text-sm mb-2 ${makeVisible ? "" : "hidden"}`}>
          Select Sizes:
        </label>
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${makeVisible ? "" : "hidden"}`}
        >
          Choose Sizes
        </button>
        {showDropdown && (
          <div className="mt-4">
            {availableSizes.length > 0 &&
              availableSizes.map((size, index) => (
                <div key={index}>
                  <label className="flex flex-row gap-4 flex-wrap items-center">
                    <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(size)}
                      checked={selectedSizes.includes(size)}
                    />
                    <span className="ml-2">{size}</span>
                  </label>
                </div>
              ))}
            <button
              type="button"
              onClick={handleApply}
              className="mt-4 bg-customPurple text-white px-4 py-2 rounded-lg"
            >
              Apply
            </button>
          </div>
        )}
      </section>

      {Object.keys(sizeDetails || {}).length > 0 && (
        <div className="mt-6">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-100 border-b">Size</th>
                <th className="py-2 px-4 bg-gray-100 border-b">Trialshopy Price</th>
                <th className="py-2 px-4 bg-gray-100 border-b">Defective Price</th>
                <th className="py-2 px-4 bg-gray-100 border-b">MRP</th>
                <th className="py-2 px-4 bg-gray-100 border-b">Inventory</th>
                <th className="py-2 px-4 bg-gray-100 border-b">SKU ID</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(sizeDetails).map((size) => (
                <tr key={size}>
                  <td className="py-2 px-4 border-b">
                    <strong>{size}</strong>
                  </td>
                  {["trialshopyPrice", "defectivePrice", "MRP", "Inventory", "SkuId"].map((field, idx) => (
                    <td key={idx} className="py-2 px-4 border-b">
                      <input
                        type="text"
                        name={`${field}-${size}`}
                        id={`${field}-${size}`}
                        placeholder={field}
                        className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        value={sizeDetails[size]?.[field] || ""}
                        onChange={(e) => handleInputChange(e, size, field)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditProductSize;
