import React from 'react'
import Claim_Tracking from '../../Components/Claim_Tracking'
import Header from '../../../../layouts/Topbar'
import Return from '../../Components/Return'
const approved = () => {
  return (
    <><Header /><Return />
    <Claim_Tracking/>
    <div className="p-4">
      
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <div className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto"> Filter by :</div> 
              <select className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto">
                  <option>Claim Protection Plan</option>
                  <option>CPP Eligible</option>
                  <option>CPP Not Eligible</option>
              </select>
              <div className="relative w-full md:w-auto">
                  <select className="border border-border rounded-md p-2 mb-2 md:mb-0">
                      <option>Created Date</option>
                      <option>Today</option>
                      <option>Yesterday</option>
                      <option>Last 3 Days</option>
                      <option>Last 1 Weeks</option>
                      <option>Last 3 Weeks</option>
                      <option>Last 1 Months</option>
                      <option>Last 3 Months</option>

                      {/* <button className="absolute right-0 top-0 mt-1 mr-2 text-sm text-secondary-foreground hidden md:block">Clear Filter</button> */}
                  </select>
                  {/* <button className="absolute right-0 top-0 mt-1 mr-2 text-sm text-secondary-foreground hidden md:block">Clear Filter</button> */}
              </div>
              <div className="relative w-full md:w-auto">
                  <select className="border border-border rounded-md p-2 mb-2 md:mb-0">
                  <option>Issue Type</option>
                  <option>I have received wrong return</option>

                  <option>Item/s are missing in my return</option>

                  <option>I have received used product as return</option>

                  <option>I have not received my Return/RTO shipment</option>

                  <option>I have received damaged return</option>

                  <option>I have received a wrong barcoded package in RTO</option>

                  <option>I have received an RTO in a non-barcoded package</option>

                      {/* <button className="absolute right-0 top-0 mt-1 mr-2 text-sm text-secondary-foreground hidden md:block">Clear Filter</button> */}
                  </select>
                  {/* <button className="absolute right-0 top-0 mt-1 mr-2 text-sm text-secondary-foreground hidden md:block">Clear Filter</button> */}
              </div>
          </div>
          <button className="bg-orange-400 text-secondary-foreground hover:bg-secondary/80 p-2 rounded-md w-full md:w-auto">Download</button>
      </div>
      <div className="flex flex-col items-center justify-center h-64">
          <img alt="no-undefined" src="https://openui.fly.dev/openui/100x100.svg?text=💸" className="w-24 h-24" />
          <p className="text-muted-foreground mt-2">No undefined as of now.</p>
      </div>
  </div>
   </>
  )
}

export default approved