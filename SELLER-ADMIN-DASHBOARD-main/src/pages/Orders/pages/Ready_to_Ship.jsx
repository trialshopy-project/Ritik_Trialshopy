import React from 'react';
import Navbar from '../Components/Navbar.jsx'
import Header from '../../../layouts/Topbar.jsx';
const Ready_to_Ship = () => {
  return (
    <>
    <Header />
    <Navbar />
    
      <div className="container mx-auto p-4">
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 p-4 bg-background rounded-lg shadow-md mb-4">
          <span className="text-muted-foreground mb-2 sm:mb-0">Filter by:</span>
          <div className="flex flex-col sm:flex-row sm:space-x-4 w-full">
            <select className="border border-border rounded-md p-2 bg-card text-foreground mb-2 sm:mb-0 w-full sm:w-auto">
              <option>SLA Status</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground mb-2 sm:mb-0 w-full sm:w-auto">
              <option>Label downloaded</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground mb-2 sm:mb-0 w-full sm:w-auto">
              <option>Dispatch Date</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground mb-2 sm:mb-0 w-full sm:w-auto">
              <option>Order Date</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground mb-2 sm:mb-0 w-full sm:w-auto">
              <option>SKU ID</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <input type="text" placeholder="Search..." className="border border-border rounded-md p-2 bg-card text-foreground w-full sm:w-auto" />
          </div>
        </div>
        
        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card border border-border">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="p-2 text-left border-r border-border">Product Details</th>
                <th className="p-2 text-left border-r border-border">Sub-order ID</th>
                <th className="p-2 text-left border-r border-border">SKU ID</th>
                <th className="p-2 text-left border-r border-border">Trialshopy ID</th>
                <th className="p-2 text-left border-r border-border">Quantity</th>
                <th className="p-2 text-left border-r border-border">Size</th>
                <th className="p-2 text-left border-r border-border">Dispatch Date/SLA</th>
                <th className="p-2 text-left border-r border-border">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Example Row 1 */}
              <tr className="border-b border-border bg-slate-100">
                <td className="p-2 border-r border-border">
                  <input type="checkbox" className="mr-2" />
                  <img src="https://placehold.co/50x50" alt="tops" className="inline-block mr-2" />
                  tops<br />
                  <span className="text-muted-foreground">Order ID: 3040324212781</span>
                </td>
                <td className="p-2 border-r border-border">304032421278_1</td>
                <td className="p-2 border-r border-border">MI-D-545</td>
                <td className="p-2 border-r border-border">8F6C2C7G</td>
                <td className="p-2 border-r border-border">1</td>
                <td className="p-2 border-r border-border">S</td>
                <td className="p-2 border-r border-border">19 Oct</td>
                <td className="p-2 border-r border-border">
                <button className="bg-purple-600  text-white border border-purple-700 rounded-md px-4 py-1 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2">
 Label
</button>
<button className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
  Downloaded
</button>
                </td>
              </tr>
              {/* Example Row 2 */}
              <tr className="border-b border-border bg-slate-100">
                <td className="p-2 border-r border-border">
                  <input type="checkbox" className="mr-2" />
                  <img src="https://placehold.co/50x50" alt="Saree Swarg" className="inline-block mr-2" />
                  Saree Swarg <br />
                  <span className="text-muted-foreground">Order ID: 983787595931</span>
                </td>
                <td className="p-2 border-r border-border">983787595931_1</td>
                <td className="p-2 border-r border-border">SC-1030-Blue</td>
                <td className="p-2 border-r border-border">2B5G3B2B</td>
                <td className="p-2 border-r border-border">1</td>
                <td className="p-2 border-r border-border">L</td>
                <td className="p-2 border-r border-border">20 Oct</td>
                <td className="p-2 border-r border-border">
                <button className="bg-purple-600  text-white border border-purple-700 rounded-md px-4 py-1 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2">
 Label
</button>
<button className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
  Downloaded
</button>
                </td>
              </tr>
              {/* Example Row 3 */}
              <tr className="border-b border-border bg-slate-100">
                <td className="p-2 border-r border-border">
                  <input type="checkbox" className="mr-2" />
                  <img src="https://placehold.co/50x50" alt="tops" className="inline-block mr-2" />
                  tops<br />
                  <span className="text-muted-foreground">Order ID: 3040324212781</span>
                </td>
                <td className="p-2 border-r border-border">304032421278_1</td>
                <td className="p-2 border-r border-border">MI-D-545</td>
                <td className="p-2 border-r border-border">8F6C2C7G</td>
                <td className="p-2 border-r border-border">1</td>
                <td className="p-2 border-r border-border">S</td>
                <td className="p-2 border-r border-border">19 Oct</td>
                <td className="p-2 border-r border-border">
                <button className="bg-purple-600  text-white border border-purple-700 rounded-md px-4 py-1 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2">
 Label
</button>
<button className="bg-white text-gray-800 border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
  Downloaded
</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Ready_to_Ship;
