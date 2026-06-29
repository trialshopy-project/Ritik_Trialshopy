import React from 'react'
import { Link } from 'react-router-dom';
const Claim_Tracking = () => {
  return (
    <>
    <div className="p-4">
    <div className="  mt-4  justify-between items-center border-b-8 border-gray-300 text-lg space-x-4">
      <Link
        to="/claim_tracking/all"
        className="text-1xl text-black hover:text-purple-600 hover:underline">
        All
      </Link>
      <Link
        to="/claim_tracking/open"
        className="text-1xl text-black hover:text-purple-800 hover:underline">
        Open
      </Link>
      <Link
        to="/claim_tracking/approved"
        className="text-1xl text-black  hover:text-purple-800 hover:underline">
        Approved
      </Link>
      <Link
        to="/claim_tracking/rejected"
        className="text-1xl text-black hover:text-purple-800 hover:underline">
        Rejected
      </Link>
      
    </div>
    </div></>
  )
}

export default Claim_Tracking