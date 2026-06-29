import React, { useContext, useEffect, useState } from "react";
import Topbar from "../layouts/Topbar";
import DashboardStatsGrid from "../layouts/DashboardStatsGrid";
import SalesChart from "../layouts/SalesChart";
import OrderStatus from "../layouts/OrderStatus";
import RecentOrders from "../layouts/RecentOrders";
import RecentActivity from "../layouts/RecentActivity";
import axios from "axios";
import Sidebar from "../layouts/sidebar";
import { UserContext } from "../components/context/UserContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [dataorder, setDataorder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("tokenx");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    fetchSalesData();
    fetchOrderData();
  }, [sellerId]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/dashboard/summary?sellerId=${sellerId}`
      );
      setStats(response.data);
    } catch (err) {
      console.log("Stats fetch error:", err.message);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/dashboard/sales-by-month?sellerId=${sellerId}`
      );
      if (response.data.success && response.data.data.length > 0) {
        setSalesData(response.data.data);
      }
    } catch (err) {
      console.log("Sales data fetch error:", err.message);
    }
  };

  const fetchOrderData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/order/list?sellerId=${sellerId}`
      );
      setDataorder(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen lg:w-full lg:h-full h-screen overflow-y-scroll">
      <Topbar />

      <div className="flex w-full flex-col mt-20">
        <DashboardStatsGrid stats={stats} loading={loading} />
        <div>
          <div className="flex flex-col lg:flex-row w-full gap-4">
            <div className="flex flex-col  lg:w-3/4 gap-4">
              <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
                <div className="w-full md:w-1/2 lg:w-full">
                  <SalesChart data={salesData} />
                </div>
                <div className="w-3/5 ml-12  lg:w-full md:w-1/2 sm:justify-center lg:ml-4 md:ml-0">
                  <OrderStatus sellerId={sellerId} />
                </div>
              </div>
              <div className="mt-4  lg:ml-4 lg:w-full">
                <div className="overflow-x-scroll">
                  <RecentOrders data={dataorder} loading={loading} />
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:w-1/4 mt-4 lg:mt-4 mb-4 lg:mr-6">
              <RecentActivity sellerId={sellerId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
