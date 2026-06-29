import React from 'react'
import Return_Tracking from '../../Components/Return_Tracking'
import Return from '../../Components/Return'
import Header from '../../../../layouts/Topbar'
const Return_Tracking_Disposed = () => {
  return (
    <>
    <Header />
    <Return />
    
    <Return_Tracking/>
    <div className="p-6 bg-background">
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mb-4 md:mb-0 w-full">
          <div className="flex items-center mb-2 md:mb-0">
            <label className="mr-2 text-muted-foreground">Filter by:</label>
            <div className="relative w-full md:w-auto"><select className="border border-border rounded-md p-2 bg-card text-primary w-full md:w-auto">
              <option>Disposed Date</option>
              <option>Yesterday</option>

              <option>Last 3 days</option>

              <option>Last 1 week</option>

              <option>Last 2 weeks</option>

              <option>Last 1 month</option>

              <option>Last 3 months</option>

              <option>Custom date range</option>
            </select></div>
            
            <div className="relative w-full md:w-auto">
              <select className="mr-2 border border-border rounded-md p-2 ml-2 bg-card text-primary w-full md:w-auto">
              <option>Return Type</option><option>Customer Return</option><option>Courier Return</option>
            </select></div>
            
            <div className="relative w-full md:w-auto"><select className="mr-2 border border-border rounded-md p-2 bg-card text-primary w-full md:w-auto">
              <option>Return Date</option>
              <option>Yesterday</option>

              <option>Last 3 days</option>

              <option>Last 1 week</option>

              <option>Last 2 weeks</option>

              <option>Last 1 month</option>

              <option>Last 3 months</option>

              <option>Custom date range</option>
            </select></div>
            
          </div>
        </div>
        <div className="relative w-full md:w-auto">
          <button className="bg-purple-400 text-primary-foreground rounded-md p-2 hover:bg-primary/80 w-full md:w-auto flex items-center justify-center">
            Download ▼
          </button>
          {/* <div className="absolute right-0 mt-2 w-full max-w-xs bg-card border border-border rounded-md shadow-lg md:w-48">
            <div className="p-2 text-muted-foreground">0/0 ready for download</div>
          </div> */}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center h-64">
        <img alt="no-results" src="https://openui.fly.dev/openui/24x24.svg?text=🔍" className="mb-4 w-16 h-16" />
        <h2 className="text-primary font-bold">No results found.</h2>
        <p className="text-muted-foreground">Try using other filters.</p>
      </div>
    </div>
    </>
  )
}

export default Return_Tracking_Disposed