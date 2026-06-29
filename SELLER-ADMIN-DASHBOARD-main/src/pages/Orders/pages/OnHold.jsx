import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Header from '../../../layouts/Topbar.jsx'
const OnHold = () => {
  return (
    <>
    <Header />
    <Navbar />
    
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <h2 className="text-lg font-semibold mb-4 lg:mb-0">Ongoing Products</h2>
        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
          <label htmlFor="filter" className="text-muted-foreground">Filter by:</label>
          <div className="flex flex-col lg:flex-row lg:space-x-2">
            <select id="filter" className="border border-border rounded p-2 mb-2 lg:mb-0">
              <option>Order Date</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <select id="filter" className="border border-border rounded p-2 mb-2 lg:mb-0">
              <option>SKU ID</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
            <input type="text" placeholder="Enter" className="border border-border rounded p-2" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="border border-gray-300 p-2">On Hold Products</th>
              <th className="border border-gray-300 p-2">Sub-order ID</th>
              <th className="border border-gray-300 p-2">SKU ID</th>
              <th className="border border-gray-300 p-2">Trialshopy ID</th>
              <th className="border border-gray-300 p-2">Quantity</th>
              <th className="border border-gray-300 p-2">Size</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">
              <img src="https://placehold.co/50x50" alt="Alluring Cotton Suit Material" className="inline-block mr-2" />
                Alluring Cotton Suit Material<br />
                <span className="text-gray-500">Order ID: 384574253269</span>
              </td>
              <td className="border border-gray-300 p-2">384574253269_1</td>
              <td className="border border-gray-300 p-2">ACSM2</td>
              <td className="border border-gray-300 p-2">3H8G7C0B</td>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">Un Stitched</td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">
              <img src="https://placehold.co/50x50" alt="Fabulous Cotton Women's Kurta Set" className="inline-block mr-2" />
                Fabulous Cotton Women's Kurta Set<br />
                <span className="text-gray-500">Order ID: 368112604706</span>
              </td>
              <td className="border border-gray-300 p-2">368112604706_1</td>
              <td className="border border-gray-300 p-2">D.no: 2005</td>
              <td className="border border-gray-300 p-2">7J6J0J1</td>
              <td className="border border-gray-300 p-2">1</td>
              <td className="border border-gray-300 p-2">M</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}

export default OnHold
