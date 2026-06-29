import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Support = () => {
  const location = useLocation();
  const [current, setCurrent] = useState(getActivePath(location.pathname));

  useEffect(() => {
    setCurrent(getActivePath(location.pathname));
  }, [location.pathname]);

  function getActivePath(pathname) {
    switch (pathname) {
      case '/support':
        return 'help';
      case '/tickets':
        return 'ticket';
      default:
        return 'help';
    }
  }

  return (
    <div className='border-gray-300 border-b-[1px]'>
      <div className='m-4'>
        <div className='text-3xl font-semibold mb-12'>Support</div>
        <div className='flex flex-row space-x-4 text-[16px] text-gray-500 font-medium'>
          <Link
            to='/support'
            className={`py-4 px-2 ${current === 'help' ? 'bg-customPurple text-white rounded-lg' : ''}`}
          >
            Help
          </Link>
          <Link
            to='/tickets'
            className={`py-4 px-2 ${current === 'ticket' ? 'bg-customPurple text-white rounded-lg' : ''}`}
          >
            My Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Support;
