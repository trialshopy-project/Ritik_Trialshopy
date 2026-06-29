import React from 'react'
import Shippingtable from './Shippingtable'

const Shippingdetails = () => {
  return (
    <>
       <div className="ml-5 mt-5 flex  gap-20">
          <div className="">
            <label className="block mb-2">Delivery Address 1</label>
            <input
              className="gap-5 border border-slate-600 shadow-sm text-sm bg-transparent h-[100px] w-[400px] px-2"
              type="text"
              placeholder="Dubai,street-5"
            />
          </div>
          <div className="">
            <label className="block mb-2">Delivery Address 2</label>
            <input
              class="gap-5 border border-slate-600 shadow-sm text-sm bg-transparent h-[100px] w-[400px] px-2"
              type="text"
              placeholder="dubai,street-6"
            />
          </div>
          
        </div>

        <div className="ml-5 mt-5 flex  gap-20">
          <div className="">
            <label className="block mb-2">City</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="City"
            />
          </div>
          <div className="">
            <label className="block mb-2">State</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="State"
            />
          </div>
          <div className="">
            <label className="block mb-2">Country</label>
            <input
              class="input-field  "
              type="email"
              placeholder="Country"
            />
          </div>
        </div>

        <div className="ml-5 mt-5 flex  gap-20">
          <div className="">
            <label className="block mb-2">Postal Code</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="1784"
            />
          </div>
          <div className="">
            <label className="block mb-2">Email</label>
            <input
              class="input-field gap-5"
              type="text"
              placeholder="info@gmail.com"
            />
          </div>
          <div className="">
            <label className="block mb-2">Phone No</label>
            <input
              class="input-field  "
              type="email"
              placeholder="1784"
            />
          </div>
        </div>

        <div>
          <Shippingtable/>
        </div>
    </>
  )
}

export default Shippingdetails