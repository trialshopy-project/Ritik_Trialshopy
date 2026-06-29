import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Return = () => {
  const location = useLocation();
  const [active, setActive] = useState(getActivePath(location.pathname));

  useEffect(() => {
    setActive(getActivePath(location.pathname));
  }, [location.pathname]);

  function getActivePath(pathname) {
    switch (pathname) {
      case '/return_tracking/in_transit':
        return 'Return Tracking';
      case '/claim_tracking/all':
        return 'Claim Tracking';
      case '/courier_partner':
        return 'Courier Partner';
      default:
        return 'Overview';
    }
  }

  return (
    <div className="p-6 bg-gray-800 text-white mt-11 rounded-lg shadow-md">

      <nav className="flex flex-col md:flex-row gap-4 mb-6 mt-5">
        <Link
          to="/overview"
          className={`text-xl md:text-2xl font-semibold py-2 px-4 rounded-md transition-colors ${active === 'Overview' ? 'bg-[#EB8105] text-white' : 'hover:bg-[#EB8105] hover:text-white'}`}
        >
          Overview
        </Link>
        <Link
          to="/return_tracking/in_transit"
          className={`text-xl md:text-2xl font-semibold py-2 px-4 rounded-md transition-colors ${active === 'Return Tracking' ? 'bg-[#EB8105] text-white' : 'hover:bg-[#EB8105] hover:text-white'}`}
        >
          Return Tracking
        </Link>
        {/* <Link
          to="/claim_tracking/all"
          className={`text-xl md:text-2xl font-semibold py-2 px-4 rounded-md transition-colors ${active === 'Claim Tracking' ? 'bg-[#EB8105] text-white' : 'hover:bg-[#EB8105] hover:text-white'}`}
        >
          Claim Tracking
        </Link> */}
        <Link
          to="/courier_partner"
          className={`text-xl md:text-2xl font-semibold py-2 px-4 rounded-md transition-colors ${active === 'Courier Partner' ? 'bg-[#EB8105] text-white' : 'hover:bg-[#EB8105] hover:text-white'}`}
        >
          Courier Partner
        </Link>
      </nav>
    </div>
  );
};

export default Return;
