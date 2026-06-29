import React, { useEffect, useState } from "react";
import axios from "axios";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return "#16A34A"; // green
    case 'shipped': return "#4F46E5"; // blue
    case 'cancelled': return "#DC2626"; // red
    case 'processing': return "#9333EA"; // purple
    case 'pending':
    default: return "#EAB308"; // yellow
  }
};

const RecentActivity = ({ sellerId }) => {
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
        `${import.meta.env.VITE_API_ENDPOINT}/activity/recent?sellerId=${sellerId}`
      );
      
      const transformedData = response.data.data.map((item) => ({
        time: item.orderDate,
        color: getStatusColor(item.status),
        activity: `Order ${item.status}`,
        productName: item.productName,
        productImage: item.productImage
      }));

      setData(transformedData);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (loading) {
    return (
      <div className="p-4 w-7/10 lg:w-64 bg-white ml-4 rounded-md shadow-lg text-sm animate-pulse">
        <strong>Recent Activity</strong>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex mt-4 items-center">
            <div className="w-10 h-3 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200 ml-4"></div>
            <div className="w-24 h-3 bg-gray-200 rounded ml-4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 w-7/10 lg:w-64 bg-white ml-4 rounded-md shadow-lg text-sm">
      <strong>Recent Activity</strong>
      
      {data.length === 0 ? (
        <div className="text-gray-500 mt-4 text-center">No recent activity.</div>
      ) : (
        <div className="mt-4">
          {data.map((d, index) => (
            <div className="flex text-xs items-start mb-4" key={index}>
              {/* Time */}
              <div className="w-12 pt-1 font-semibold text-gray-500 whitespace-nowrap">
                {new Date(d.time).toLocaleString("en-IN", options)}
              </div>
              
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center mx-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7" cy="7" r="5" stroke={d.color} strokeWidth="4" />
                </svg>
                {index < data.length - 1 && (
                  <div className="w-0.5 h-10 bg-gray-200 mt-1"></div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex flex-col flex-1 pb-2">
                <p className="font-medium capitalize">{d.activity}</p>
                <p className="text-gray-500 truncate max-w-[120px]" title={d.productName}>{d.productName}</p>
                
                {/* Product Thumbnail */}
                {d.productImage && (
                  <div className="mt-2 flex">
                    <img
                      src={d.productImage}
                      alt={d.productName}
                      className="w-8 h-8 rounded object-cover border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
