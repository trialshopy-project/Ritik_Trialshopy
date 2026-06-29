import React from 'react'
import Infotable from './Infotable'

const Basicinfo = () => {
  return (
    <>
      <div className="ml-5 mt-5 flex  gap-20">
          <div className="">
            <label className="block mb-2">Product Name</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="Enter Product name"
            />
          </div>
          <div className="">
            <label className="block mb-2">Order ID</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="Order ID"
            />
          </div>
          <div className="">
            <label className="block mb-2">Order No</label>
            <input
              class="input-field  "
              type="email"
              placeholder="Order No"
            />
          </div>
        </div>

        <div className='flex gap-2 ml-5 mt-5'>
          <label htmlFor="">Order Status</label>
          <input type="radio" />
        </div>

        <div className="ml-5 mt-5 flex  gap-20">
          <div className="">
            <label className="block mb-2">Vendor Name</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="Vendor Name"
            />
          </div>
          <div className="">
            <label className="block mb-2">Min Quantity</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="Min Quantity"
            />
          </div>
          <div className="">
            <label className="block mb-2">Max Quantity</label>
            <input
              class="input-field  "
              type="email"
              placeholder="Max Quantity"
            />
          </div>
        </div>

        <div>
          <Infotable/>
        </div>
    </>
  )
}

export default Basicinfo