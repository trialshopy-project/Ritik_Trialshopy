import React, { useEffect } from "react";
import axios from "axios";

const ProductAttributesBasic_info = ({
  attributes,
  setAttributes,
  selectedAttribute,
  setSelectedAttribute,
  priceAdjustmentTypes,
  setPriceAdjustmentTypes,
  selectedPriceAdjustmentType,
  setSelectedPriceAdjustmentType,
  isLoading,
  setIsLoading,
}) => {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const attributesResponse = await axios.get("/api/attributes");
      const priceAdjustmentTypesResponse = await axios.get(
        "/api/price-adjustment-types"
      );

      setAttributes(attributesResponse.data);
      setPriceAdjustmentTypes(priceAdjustmentTypesResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleAttributeChange = (attribute) => {
    setSelectedAttribute(attribute);
  };

  const handlePriceAdjustmentTypeChange = (type) => {
    setSelectedPriceAdjustmentType(type);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="font-semibold mt-2">Product Attributes</div>
      <div className="ml-0 mt-5 flex space-x-20">
        <div>
          <label className="block mb-2">Attribute</label>
          <select
            name="attribute"
            value={selectedAttribute}
            onChange={(e) => handleAttributeChange(e.target.value)}
            className="form-control border-0 border-b-2"
          >
            <option value="">Select an attribute</option>
            {attributes.map((attribute) => (
              <option key={attribute.id} value={attribute.id}>
                {attribute.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Price Adjustment Types</label>
          <select
            name="priceAdjustmentType"
            value={selectedPriceAdjustmentType}
            onChange={(e) => handlePriceAdjustmentTypeChange(e.target.value)}
            className="form-control border-0 border-b-2"
          >
            <option value="">Select a price adjustment type</option>
            {priceAdjustmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ml-0 mt-5 flex space-x-20">
        <div>
          <label className="block mb-1">Price Adjustment</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter price adjustment"
          />
        </div>
        <div>
          <label className="block mb-2">Attribute Value</label>
          <select
            name="Category"
            id=""
            className="form-control mt-3 border-0 border-b-2"
          >
            <option value="Cake">Cake</option>
            <option value="Flower">Flower</option>
            <option value="Chocolates">Chocolates</option>
            <option value="Jewellery">Jewellery</option>
          </select>
        </div>
      </div>

      <div className="mt-4 w-full">
        <table className="w-full">
          <thead className="border-separate w-full">
            <tr className="w-full">
              <th className=" text-sm">S.No.</th>
              <th className=" text-sm">Attribute</th>
              <th className=" text-sm">Attribute Value</th>
              <th className=" text-sm">Price Adjustment Type</th>
              <th className=" text-sm">Price Adjustment</th>
            </tr>
          </thead>

          <tbody className="w-full">
            <tr className="w-full">
              <td className="text-black-600  text-xs font-[400]">1</td>
              <td className="text-black-600  text-xs font-[400]">95605</td>
              <td className="text-black-600  text-xs font-[400]">
                Ronald Richards
              </td>
              <td className="text-black-600  text-xs font-[400]">95605</td>
              <td className="text-black-600  text-xs font-[400]">95605</td>
            </tr>

            <tr className="w-full">
              <td className="text-black-600  text-xs font-[400]">2</td>
              <td className="text-black-600  text-xs font-[400]">39771</td>
              <td className="text-black-600  text-xs font-[400]">
                Cody Fisher
              </td>
              <td className="text-black-600  text-xs font-[400]">39771</td>
              <td className="text-black-600  text-xs font-[400]">39771</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-stretch mt-5 rounded-md cursor-pointer">
        <button className="flex bg-customPurple rounded-full text-white items-center px-4 py-1 gap-2 focus:outline-none">
          Add Attribute
          <ion-icon name="send" className="text-white"></ion-icon>
        </button>
      </div>
    </>
  );
};

export default ProductAttributesBasic_info;
