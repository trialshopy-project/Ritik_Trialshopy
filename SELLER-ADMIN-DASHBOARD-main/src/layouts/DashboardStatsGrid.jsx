import React from "react";

const DashboardStatsGrid = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 justify-around mx-4 mt-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="shadow-lg w-9/10 gap-y-2 lg:w-64 bg-gray-200 h-32 rounded-md flex gap-4 justify-between p-4 items-center">
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-32 mb-2"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 justify-around mx-4 mt-4">
        {/* Total Order */}
        <div className="shadow-lg w-9/10 gap-y-2 lg:w-64 bg-white rounded-md flex gap-4 justify-between p-4 items-center">
          <div>
            <h2 className="text-base font-bold">Total Order</h2>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <span className={stats.percentChangeOrders >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {stats.percentChangeOrders >= 0 ? "+" : ""}{stats.percentChangeOrders}%
              </span>
              from last month
            </p>
            <strong className="text-xl">{stats.totalOrders}</strong>
          </div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#4F46E5" />
            <path d="M18 29C16.9 29 16.01 29.9 16.01 31C16.01 32.1 16.9 33 18 33C19.1 33 20 32.1 20 31C20 29.9 19.1 29 18 29ZM12 13V15H14L17.6 22.59L16.25 25.04C16.09 25.32 16 25.65 16 26C16 27.1 16.9 28 18 28H30V26H18.42C18.28 26 18.17 25.89 18.17 25.75L18.2 25.63L19.1 24H26.55C27.3 24 27.96 23.59 28.3 22.97L31.88 16.48C31.9625 16.3274 32.004 16.156 32.0005 15.9825C31.9969 15.8091 31.9485 15.6395 31.8598 15.4904C31.7711 15.3413 31.6453 15.2177 31.4946 15.1317C31.3439 15.0458 31.1735 15.0004 31 15H16.21L15.27 13H12ZM28 29C26.9 29 26.01 29.9 26.01 31C26.01 32.1 26.9 33 28 33C29.1 33 30 32.1 30 31C30 29.9 29.1 29 28 29Z" fill="white" />
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#E4E4E7" />
          </svg>
        </div>

        {/* Total Revenue */}
        <div className="shadow-lg w-9/10 lg:w-64 bg-white rounded-md flex gap-4 justify-between p-4 items-center">
          <div>
            <h2 className="text-base font-bold">Total Revenue</h2>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <span className={stats.percentChangeRevenue >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {stats.percentChangeRevenue >= 0 ? "+" : ""}{stats.percentChangeRevenue}%
              </span>
              from last month
            </p>
            <strong className="text-xl">₹{stats.totalRevenue.toLocaleString("en-IN")}</strong>
          </div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#4F46E5" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 23C12 16.925 16.925 12 23 12C29.075 12 34 16.925 34 23C34 29.075 29.075 34 23 34C16.925 34 12 29.075 12 23ZM19 17C18.7348 17 18.4804 17.1054 18.2929 17.2929C18.1054 17.4804 18 17.7348 18 18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19H27C27.2652 19 27.5196 18.8946 27.7071 18.7071C27.8946 18.5196 28 18.2652 28 18C28 17.7348 27.8946 17.4804 27.7071 17.2929C27.5196 17.1054 27.2652 17 27 17H19ZM17 21C16.7348 21 16.4804 21.1054 16.2929 21.2929C16.1054 21.4804 16 21.7348 16 22C16 22.2652 16.1054 22.5196 16.2929 22.7071C16.4804 22.8946 16.7348 23 17 23H29C29.2652 23 29.5196 22.8946 29.7071 22.7071C29.8946 22.5196 30 22.2652 30 22C30 21.7348 29.8946 21.4804 29.7071 21.2929C29.5196 21.1054 29.2652 21 29 21H17ZM19 25C18.7348 25 18.4804 25.1054 18.2929 25.2929C18.1054 25.4804 18 25.7348 18 26C18 26.2652 18.1054 26.5196 18.2929 26.7071C18.4804 26.8946 18.7348 27 19 27H27C27.2652 27 27.5196 26.8946 27.7071 26.7071C27.8946 26.5196 28 26.2652 28 26C28 25.7348 27.8946 25.4804 27.7071 25.2929C27.5196 25.1054 27.2652 25 27 25H19Z" fill="white" />
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#E4E4E7" />
          </svg>
        </div>

        {/* Total Visitors */}
        <div className="shadow-lg w-9/10 lg:w-64 bg-white rounded-md flex gap-4 justify-between p-4 items-center">
          <div>
            <h2 className="text-base font-bold">Total Visitors Visited</h2>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              Across all items
            </p>
            <strong className="text-xl">{stats.totalVisitors ?? 0}</strong>
          </div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#4F46E5" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 23C12 16.925 16.925 12 23 12C29.075 12 34 16.925 34 23C34 29.075 29.075 34 23 34C16.925 34 12 29.075 12 23ZM19 17C18.7348 17 18.4804 17.1054 18.2929 17.2929C18.1054 17.4804 18 17.7348 18 18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19H27C27.2652 19 27.5196 18.8946 27.7071 18.7071C27.8946 18.5196 28 18.2652 28 18C28 17.7348 27.8946 17.4804 27.7071 17.2929C27.5196 17.1054 27.2652 17 27 17H19ZM17 21C16.7348 21 16.4804 21.1054 16.2929 21.2929C16.1054 21.4804 16 21.7348 16 22C16 22.2652 16.1054 22.5196 16.2929 22.7071C16.4804 22.8946 16.7348 23 17 23H29C29.2652 23 29.5196 22.8946 29.7071 22.7071C29.8946 22.5196 30 22.2652 30 22C30 21.7348 29.8946 21.4804 29.7071 21.2929C29.5196 21.1054 29.2652 21 29 21H17ZM19 25C18.7348 25 18.4804 25.1054 18.2929 25.2929C18.1054 25.4804 18 25.7348 18 26C18 26.2652 18.1054 26.5196 18.2929 26.7071C18.4804 26.8946 18.7348 27 19 27H27C27.2652 27 27.5196 26.8946 27.7071 26.7071C27.8946 26.5196 28 26.2652 28 26C28 25.7348 27.8946 25.4804 27.7071 25.2929C27.5196 25.1054 27.2652 25 27 25H19Z" fill="white" />
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#E4E4E7" />
          </svg>
        </div>

        {/* Unique Visitors */}
        <div className="shadow-lg w-9/10 lg:w-64 bg-white rounded-md flex gap-4 justify-between p-4 items-center">
          <div>
            <h2 className="text-base font-bold">Unique Visitors Visited</h2>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              Distinct customers
            </p>
            <strong className="text-xl">{stats.uniqueVisitors ?? 0}</strong>
          </div>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" fill="#4F46E5" />
            <path fillRule="evenodd" clipRule="evenodd" d="M12 23C12 16.925 16.925 12 23 12C29.075 12 34 16.925 34 23C34 29.075 29.075 34 23 34C16.925 34 12 29.075 12 23ZM19 17C18.7348 17 18.4804 17.1054 18.2929 17.2929C18.1054 17.4804 18 17.7348 18 18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19H27C27.2652 19 27.5196 18.8946 27.7071 18.7071C27.8946 18.5196 28 18.2652 28 18C28 17.7348 27.8946 17.4804 27.7071 17.2929C27.5196 17.1054 27.2652 17 27 17H19ZM17 21C16.7348 21 16.4804 21.1054 16.2929 21.2929C16.1054 21.4804 16 21.7348 16 22C16 22.2652 16.1054 22.5196 16.2929 22.7071C16.4804 22.8946 16.7348 23 17 23H29C29.2652 23 29.5196 22.8946 29.7071 22.7071C29.8946 22.5196 30 22.2652 30 22C30 21.7348 29.8946 21.4804 29.7071 21.2929C29.5196 21.1054 29.2652 21 29 21H17ZM19 25C18.7348 25 18.4804 25.1054 18.2929 25.2929C18.1054 25.4804 18 25.7348 18 26C18 26.2652 18.1054 26.5196 18.2929 26.7071C18.4804 26.8946 18.7348 27 19 27H27C27.2652 27 27.5196 26.8946 27.7071 26.7071C27.8946 26.5196 28 26.2652 28 26C28 25.7348 27.8946 25.4804 27.7071 25.2929C27.5196 25.1054 27.2652 25 27 25H19Z" fill="white" />
            <rect x="0.5" y="0.5" width="45" height="45" rx="22.5" stroke="#E4E4E7" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default DashboardStatsGrid;
