import React, { useState, useEffect } from "react";
import {
  BsFillCartCheckFill,
  BsArrowDownRight,
  BsArrowUpRight,
} from "react-icons/bs";
import { TbMoneybag } from "react-icons/tb";
import { MdAddBusiness } from "react-icons/md";
import { MdOutlinePeopleAlt } from "react-icons/md";

const DashboardStatsGrid = () => {
  const [data, setData] = useState({});
  const [error,setError]=useState("")
  const [loading,setLoading]=useState("loading")

  const fetchData = async () => {
    try {
      // Make the API call here and replace 'API_ENDPOINT' with your actual API endpoint URL
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/dashboard/summary`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setData(data);
  
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="shadow-lg flex gap-4 justify-between px-2 items-center">
          <div>
            <h2 className="font-bold">Total Order</h2>
            <p className="flex items-center gap-1">
              <BsArrowUpRight color="green" />
              +2.5% from last week
            </p>
            <p>{data.totalOrders}</p>
          </div>
          <div>
            <BsFillCartCheckFill size={30} />
          </div>
        </div>
        <div className="shadow-lg  flex gap-4  justify-between px-2 items-center ">
          <div>
            <h2 className="font-bold">Total Revenue</h2>
            <p className="flex items-center gap-1">
              <BsArrowUpRight color="green" />
              +2.5% from last week
            </p>
            <p>₹{data.totalRevenue}</p>
            <p></p>
          </div>
          <div>
            <TbMoneybag size={30} />
          </div>
        </div>
        <div className="shadow-lg flex gap-4 justify-between px-2 items-center ">
          <div>
            <h2 className="font-bold">Total Merchants</h2>
            <p className="flex items-center gap-1 ">
              <BsArrowDownRight color="red" />
              -2.5% from last week
            </p>
            <p>{data.totalMerchants}</p>
          </div>
          <div>
            <MdAddBusiness size={30} />
          </div>
        </div>
        <div className="shadow-lg flex gap-4 justify-between px-2 items-center ">
          <div>
            <h2 className="font-bold">Total Customers</h2>
            <p className="flex items-center gap-1">
              <BsArrowUpRight color="green" />
              +2.5% from last week
            </p>
            <p>{data.totalCustomers}</p>
          </div>
          <div>
            <MdOutlinePeopleAlt size={30} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStatsGrid;
