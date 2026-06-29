import React, { useEffect, useState } from "react";
import { BsArrowDownRight } from "react-icons/bs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const RecentOrders = () => {
  const [dat, setDat] = useState([]);
  const [error, setError] = useState("");
  const [data, setData] = useState([{ name: "pending", value: 0 }, { name: "delivered", value: 0 }]);
  
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/orders/status`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        setDat(result.data);
        
        const chartData = [
          { name: "Order Pending", value: result.data.find(d => d.status === "pending" || d.status === "Pending")?.count || 0 },
          { name: "Order Delivered", value: result.data.find(d => d.status === "delivered" || d.status === "Delivered")?.count || 0 },
        ];
        setData(chartData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDelivered = data.find(d => d.name === "Order Delivered")?.value || 0;
  const totalPending = data.find(d => d.name === "Order Pending")?.value || 0;
  const increase = (totalDelivered / (totalDelivered + totalPending)) * 100;

  const RADIAN = Math.PI / 180;
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-sm border border-gray-200 flex flex-col shadow-lg">
        <div className="flex items-center gap-4">
          <strong className="text-gray-700 font-medium">Order Status</strong>
          <div className="flex items-center gap-2">
            <BsArrowDownRight color="green" />
            <div>
              <p>Last 7 days</p>
              <p>+{increase.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="mt-3 w-full flex-1 text-xs">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={105}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default RecentOrders;
