import React from 'react'
import Return_Tracking from '../../Components/Return_Tracking'
import Return from '../../Components/Return'
import Header from '../../../../layouts/Topbar'
const Return_Tracking_Delivered = () => {
  return (
    <>
    <Header />
    <Return />

    <Return_Tracking/>
    <div className="p-4">
      
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <div className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto"> Filter by :</div> 
              <select className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto">
                  <option>Return Created</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
              </select>
              <select className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto">
                  <option>Expected Delivery Date</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
              </select>
              <div className="relative w-full md:w-auto">
                  <select className="border border-border rounded-md p-2 mb-2 md:mb-0">
                      <option>Return Type</option>
                      <option>Customer Return</option>
                      <option>Courier Return</option>
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

export default Return_Tracking_Delivered