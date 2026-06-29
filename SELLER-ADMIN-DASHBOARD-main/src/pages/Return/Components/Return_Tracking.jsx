import React, { useState } from 'react'
import { Link } from 'react-router-dom';
const Return_Tracking = () => {

  const [val,setVal]=useState("transit");

  return (
    <>
    <div className="p-4">
    <div className="  mt-4  justify-between items-center border-b-8 border-gray-300 text-lg space-x-4">
      <Link
        to="/return_tracking/in_transit"
        onClick={()=>setVal("transit")}
        className={`text-1xl text-purple-800 hover:underline ${val==="transit" && "text-red-500"}`}>
        In Transit
      </Link>
      <Link
        to="/return_tracking/out_for_delivery"
        onClick={()=>setVal("out")}
        className={`text-1xl text-purple-800 hover:underline ${val==="out" && "text-red-500"}`}>
        Out for Delivery
      </Link>
      <Link
        to="/return_tracking/delivered"
        onClick={()=>setVal("delivered")}
        className={`text-1xl text-purple-800 hover:underline ${val==="delivered" && "text-red-500"}`}>
        Delivered
      </Link>
      <Link
        to="/return_tracking/lost"
        onClick={()=>setVal("lost")}
        className={`text-1xl text-purple-800 hover:underline ${val==="lost" && "text-red-500"}`}>
        Lost
      </Link>
      <Link
        to="/return_tracking/disposed"
        onClick={()=>setVal("dis")}
        className={`text-1xl text-purple-800 hover:underline ${val==="dis" && "text-red-500"}`}>
        Disposed
      </Link>
    </div>
    </div></>
  )
}

export default Return_Tracking