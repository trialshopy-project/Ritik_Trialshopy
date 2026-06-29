import React, { useEffect } from "react";

const Shipping_Basic_info = ({
  shippingCharges,
  setShippingCharges,
  shippingType,
  setshippingType,
}) => {
  useEffect(() => {
    fetchShippingOptions();
  }, []);

  const fetchShippingOptions = async () => {
    try {
      const response = await axios.get("backend/shipping-options");
      // setShippingOptions(response.data.options);
    } catch (error) {
      console.error("Error fetching shipping options:", error);
    }
  };

  const handleShippingOptionChange = (option) => {
    setshippingType(option);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
      <div className="w-full lg:w-[80%]">
        <div className=" mt-7 border border-b-slate-300 bg-white rounded-lg shadow-lg">
          <h2 className="font-semibold sm:m-4 text-center">Shipping</h2>
          <section className="flex flex-wrap items-center justify-between">
            <ul className="flex w-full   items-center justify-between">
              <li className="mx-6 w-1/2">
                <input
                  type="radio"
                  name="radioBtnBasic"
                  checked={shippingType === "Free Shipping"}
                  onChange={() => handleShippingOptionChange("Free Shipping")}
                />
                <label className="text-sm font-[500] ms-2">
                  Free Shipping <span className="text-[#F60002]">*</span>
                </label>
              </li>
              <li className="mx-2 w-1/2">
                <input
                  type="radio"
                  name="radioBtnBasic"
                  checked={shippingType === "Returnable"}
                  onChange={() => handleShippingOptionChange("Returnable")}
                />
                <label className="text-sm font-[500] ms-2">
                  Returnable <span className="text-[#F60002]">*</span>
                </label>
              </li>
              <section className=" w-2/3 mb-2 sm:m-4 flex flex-col">
                <p className="font-bold text-xs mb-2">Shipping Charges</p>
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={shippingCharges}
                  onChange={(e) => setShippingCharges(e.target.value)}
                  className="bg-transparent border border-b-black text-sm p-2"
                />
              </section>
            </ul>
          </section>
        </div>
        </div>
    </div>
  );
};

export default Shipping_Basic_info;
