import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation(); // Hook to get the current path

  return (
    <div className="container mx-auto p-4 border-b-8 border-black bg-white text-black shadow-lg border-4  font-bold mt-16">
      {/* <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Orders</h1> */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          {/* <Link
            to="/onhold"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname === '/onhold' ? 'bg-primary text-black' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`}
          >
            On Hold
          </Link> */}
          <Link
            to="/pending"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname ==='/pending' ? 'bg-customPurple text-white p-4' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`} 
          >
            Pending
          </Link>
          <Link
            to="/processed"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname === '/processed' ? 'bg-customPurple text-white p-4' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`}
          >
            Processed
          </Link>
          {/* <Link
            to="/ready_to_ship"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname === '/ready_to_ship' ? 'bg-primary text-purple-800' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`}
          >
            Ready to Ship
          </Link> */}
          <Link
            to="/shipped"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname === '/shipped' ? 'bg-customPurple text-white p-4' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`}
          >
            Shipped
          </Link>
          <Link
            to="/cancelled"
            className={`px-4 py-2 rounded transition-colors duration-300
              ${location.pathname === '/cancelled' ? 'bg-customPurple text-white p-4' : 'bg-secondary text-secondary-foreground'}
              hover:bg-primary/80 hover:text-primary-foreground`}
          >
            Cancelled
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
