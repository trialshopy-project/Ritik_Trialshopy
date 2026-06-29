import React from 'react'
import Return_Tracking from '../../Components/Return_Tracking'
import Header from '../../../../layouts/Topbar'
import Return from '../../Components/Return'
const Return_tracking_out_for_delivery = () => {
  return (
    <>
    <Header />
    <Return />
    
    <Return_Tracking/>
    <div className="p-4">
      
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
          <div className="flex flex-col md:flex-row md:space-x-4 mb-4 md:mb-0 w-full md:w-auto">
            <div className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto"> Filter by :</div> 
              <select className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto ">
                  <option>Status Attempt</option>
                  <option>Delivering Today
                  </option>

                  <option>To be Reattempted</option>
              </select>
              <select className="border border-border rounded-md p-2 mb-2 md:mb-0 w-full md:w-auto">
                  <option>Final Attempt</option>
                  <option>1st Attempt</option>
                  <option>2nd Attempt</option>
              </select>
          
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

export default Return_tracking_out_for_delivery