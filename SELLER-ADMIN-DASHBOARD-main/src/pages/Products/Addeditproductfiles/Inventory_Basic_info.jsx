import React, { useEffect } from "react";

const Inventory_Basic_info = ({
  // inventoryMethod,
  // setInventoryMethod,
  // warehouse,
  // setWarehouse,
  inStock,
  setInStock,
  stock,
  setStock,
  orderMinQuantity,
  setOrderMinQuantity,
  orderMaxQuantity,
  setOrderMaxQuantity,
}) => {
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    try {
      // Fetch inventory method options
      const methodResponse = await fetch("apiapi/inventory_methods");
      const methodData = await methodResponse.json();
      // Set the fetched inventory method options to state
      // setInventoryMethodOptions(methodData);

      // Fetch warehouse options
      const warehouseResponse = await fetch("apiapi/warehouses");
      const warehouseData = await warehouseResponse.json();
      // Set the fetched warehouse options to state
      // setWarehouseOptions(warehouseData);

      // Fetch existing inventory data
      const inventoryResponse = await fetch("apiapi/inventory");
      const inventoryData = await inventoryResponse.json();
      // Set the fetched inventory data to state
      // setInventoryData(inventoryData);
    } catch (error) {
      console.error("Error fetching inventory data", error);
    }
  };

  const handleAddInventory = async () => {
    const inventoryData = {
      inventoryMethod,
      warehouse,
      orderMinQuantity,
      orderMaxQuantity,
    };

    try {
      const response = await fetch("apiapi/add_inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inventoryData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("New inventory added:", responseData);
      } else {
        console.error("Error in adding inventory");
      }
    } catch (error) {
      console.error("Error adding inventory", error);
    }
  };

  return (
    <div className="mt-7 border border-b-slate-300 bg-white shadow-lg rounded-lg">
      <h2 className="font-semibold sm:m-4 text-center"> Inventory</h2>
      <section className="flex flex-wrap items-center justify-between">
        <section className="sm:m-4">
          <ul className="flex gap-2">
            <li className="mx-2 flex items-center justify-center gap-1">
              <input
                type="radio"
                name="radioBtnBasic1"
                checked={inStock === true}
                onChange={() => setInStock(true)}
              />
              <label className="text-xs font-[500] ">InStock</label>
            </li>
            <li className="mx-2 gap-1">
              <input
                type="radio"
                name="radioBtnBasic1"
                checked={inStock === false}
                onChange={() => setInStock(false)}
              />
              <label className="text-xs  font-[500]">Out of Stock</label>
            </li>
          </ul>
        </section>

        <section className="m-1 p-1 flex flex-col   sm:m-4 ">
          <label className="font-semibold text-xs">Total Stock</label>
          <input
            type="number"
            name="cartQuantityMin"
            id="cartQuantityMin"
            placeholder="Total Stock Available"
            className="bg-transparent border border-b-black text-sm p-2"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </section>

        <section className="m-1 p-1  sm:m-4 flex flex-col ">
          <label className="font-semibold text-xs">
            Order Minimum Cart Quantity
          </label>
          <input
            type="number"
            name="cartQuantityMin"
            id="cartQuantityMin"
            placeholder="1"
            className="bg-transparent border border-b-black text-sm p-2"
            value={orderMinQuantity}
            onChange={(e) => setOrderMinQuantity(e.target.value)}
          />
        </section>

        <section className="m-1 p-1  sm:m-4 flex flex-col ">
          <label className="font-semibold text-xs">
            Order Maximum Cart Quantity
          </label>
          <input
            type="number"
            name="cartQuantityMax"
            id="cartQuantityMax"
            placeholder="7"
            className="bg-transparent border border-b-black text-sm p-2"
            value={orderMaxQuantity}
            onChange={(e) => setOrderMaxQuantity(e.target.value)}
          />
        </section>
      </section>
    </div>
  );
};

export default Inventory_Basic_info;
