import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ data }) => {
  return (
    <>
      <div className="h-96 lg:w-full ml-4 bg-white p-4 rounded-md flex flex-col shadow-lg ">
        <strong className="text-sm">Sales Overview</strong>
        
        {(!data || data.length === 0) ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No sales data available yet.</p>
          </div>
        ) : (
          <div className="mt-3 w-full flex-1 text-xs ">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
                barCategoryGap={8}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis fontWeight={600} dataKey="name" />
                <YAxis fontWeight={600} yAxisId="left" orientation="left" stroke="#0F172A" />
                <YAxis fontWeight={600} yAxisId="right" orientation="right" stroke="#4F46E5" />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" name="Sales (₹)" fill="#0F172A" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="visits" name="Visits" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
};

export default SalesChart;
