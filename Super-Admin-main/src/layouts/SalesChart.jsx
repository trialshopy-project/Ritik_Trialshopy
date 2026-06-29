import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'


const SalesChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/dashboard/sales-by-month`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                if (result.success && result.data) {
                    setData(result.data);
                }
            } catch (err) {
                console.error("Sales chart error:", err);
            }
        };

        fetchSalesData();
    }, []);
    

  return (
    <>
      {/* <div className="shadow-lg flex flex-col flex-1 gap-4  px-2 items-center">
        <h1 className="font-bold">Sales Overview</h1>
      
        <div className="mt-3 w-full flex-1 text-xs ">
        <h1 className="font-bold">Sales Overview</h1>
				<ResponsiveContainer width="100%" height="92%">
					<BarChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 20,
							right: 10,
							left: -10,
							bottom: 0
						}}
					>
						<CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="Income" fill="#0ea5e9" />
						<Bar dataKey="Expense" fill="#ea580c" />
					</BarChart>
				</ResponsiveContainer>
			</div>
      </div> */}

      <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col shadow-lg ">
      
			<strong className="text-gray-700 font-bold">Sales Overview</strong>
            
            
			<div className="mt-3 w-full flex-1 text-xs shadow-lg">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 20,
							right: 10,
							left: -10,
							bottom: 0
						}}
					>
						<CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar dataKey="sales" fill="#3cb371" />
						<Bar dataKey="visits" fill="SlateBlue" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>

    </>
  );
};

export default SalesChart;
