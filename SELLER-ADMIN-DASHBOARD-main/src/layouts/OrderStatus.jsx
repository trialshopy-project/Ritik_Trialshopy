import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const OrderStatus = ({ sellerId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sellerId) {
      fetchData();
    }
  }, [sellerId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/status?sellerId=${sellerId}`
      );
      const transformedData = response.data.data.map((item) => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        value: item.count,
      }));
      setData(transformedData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#4F46E5", "#0F172A", "#581C87", "#16A34A", "#DC2626", "#EAB308"];

  return (
    <div className="h-96 w-full lg:w-full ml-4 bg-white p-4 rounded-md flex flex-col shadow-lg ">
      <div className="flex w-full justify-between items-center text-sm">
        <strong>Order Status</strong>
        <div className="flex items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16117 4.66117C1.81696 7.00537 0.5 10.1848 0.5 13.5V14H0.509993C0.635322 17.1335 1.93508 20.1127 4.16117 22.3388C6.50537 24.683 9.68479 26 13 26C16.3152 26 19.4946 24.683 21.8388 22.3388C24.183 19.9946 25.5 16.8152 25.5 13.5C25.5 10.1848 24.183 7.00537 21.8388 4.66117C19.4946 2.31696 16.3152 1 13 1C9.68479 1 6.50537 2.31696 4.16117 4.66117ZM9.50245 17.3509L9.50239 17.3509L9.49636 17.3571C9.4733 17.381 9.44571 17.4001 9.41521 17.4132C9.3847 17.4263 9.3519 17.4332 9.31871 17.4335C9.28551 17.4337 9.25259 17.4274 9.22187 17.4149C9.19115 17.4023 9.16323 17.3837 9.13976 17.3602C9.11628 17.3368 9.09772 17.3089 9.08515 17.2781C9.07258 17.2474 9.06625 17.2145 9.06654 17.1813C9.06683 17.1481 9.07373 17.1153 9.08683 17.0848C9.09993 17.0543 9.11898 17.0267 9.14286 17.0036L9.14291 17.0037L9.14905 16.9976L15.2931 10.8536L16.1466 10H14.9395H10.7875C10.7212 10 10.6576 9.97366 10.6107 9.92678C10.5638 9.87989 10.5375 9.8163 10.5375 9.75C10.5375 9.6837 10.5638 9.62011 10.6107 9.57322C10.6576 9.52634 10.7212 9.5 10.7875 9.5H16.75C16.8163 9.5 16.8799 9.52634 16.9268 9.57322C16.9737 9.62011 17 9.68369 17 9.75V15.7125C17 15.7788 16.9737 15.8424 16.9268 15.8893C16.8799 15.9362 16.8163 15.9625 16.75 15.9625C16.6837 15.9625 16.6201 15.9362 16.5732 15.8893C16.5263 15.8424 16.5 15.7788 16.5 15.7125V11.5605V10.3534L15.6464 11.2069L9.50245 17.3509Z"
              fill="#16A34A"
              stroke="white"
            />
          </svg>
        </div>
      </div>

      <div className="w-full flex-1 text-xs ">
        {loading ? (
          <div className="flex h-full items-center justify-center animate-pulse">
            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={false}
                outerRadius={70}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 text-sm">
            Pie Chart not Available! No orders found.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
