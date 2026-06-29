import React, { useState } from "react"
import Topbar2 from "../../layouts/Topbar2"
import {SiHomeassistantcommunitystore} from "react-icons/si"
import {AiOutlineClose} from "react-icons/ai"
import {MdOutlineSend} from "react-icons/md"
import { useNavigate } from 'react-router-dom';

export default function FFormElementsInputPlainLgRequired() {
  const navigate = useNavigate();

  return (
    <>
      <Topbar2/>
      <div className="bg-white">
  <div className="flex justify-between items-center px-5 py-3">
    <div className="font-bold flex items-center text-lg">
      <SiHomeassistantcommunitystore className="mr-2" />
      Edit Merchant
    </div>
    <div className="flex">
      <div className="flex items-stretch focus:bg-gray-900" onClick={() => { navigate('../Merchant') }}>
        <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none">
          <AiOutlineClose className='mr-2 scale-125 border bg-white rounded-full fill-gray-900' />
          Close
        </button>
      </div>
    </div>
  </div>

  <div className="px-5">
    <div className="mt-5 font-semibold text-lg">
      Personal information
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      <div>
        <label className="block mb-2">Full Name</label>
        <input className="input-field" type="text" placeholder="Enter Business name" />
      </div>
      <div>
        <label className="block mb-2">E-Mail</label>
        <input className="input-field" type="email" placeholder="name@gmail.com" />
      </div>
      <div>
        <label className="block mb-2">Phone no.</label>
        <input className="input-field" type="tel" placeholder="+91 - 7983163574" />
      </div>
      <div>
        <label className="block mb-2">Alternate Phone no.</label>
        <input className="input-field" type="tel" placeholder="+91 - 7983163574" />
      </div>
      <div>
        <label className="block mb-2">Aadhaar no.</label>
        <input className="input-field" type="tel" placeholder="Aadhaar no." />
      </div>
      <div>
        <label className="block mb-2">Pan no.</label>
        <input className="input-field" type="text" placeholder="Enter no." />
      </div>
      <div>
        <label className="block mb-2">Country</label>
        <select name="Country" className="input-field">
          <option value="India">India</option>
          <option value="Australia">Australia</option>
          <option value="America">America</option>
          <option value="Canada">Canada</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">State</label>
        <input className="input-field" type="text" placeholder="State" />
      </div>
      <div>
        <label className="block mb-2">City</label>
        <input className="input-field" type="text" placeholder="City" />
      </div>
      <div>
        <label className="block mb-2">Address</label>
        <input className="input-field" type="text" placeholder="Enter Address" />
      </div>
      <div>
        <label className="block mb-2">Zip Code</label>
        <input className="input-field" type="text" placeholder="Enter Zip Code" />
      </div>
    </div>

    <div className="mt-5 font-semibold text-lg">
      Company information
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      <div>
        <label className="block mb-2">Company name</label>
        <input className="input-field" type="text" placeholder="Company name" />
      </div>
      <div>
        <label className="block mb-2">Store name</label>
        <input className="input-field" type="text" placeholder="Store name" />
      </div>
      <div>
        <label className="block mb-2">Store ID</label>
        <input className="input-field" type="text" placeholder="STORE1234" />
      </div>
      <div>
        <label className="block mb-2">Store Address</label>
        <input className="input-field" type="text" placeholder="Enter Address" />
      </div>
      <div>
        <label className="block mb-2">Store City</label>
        <input className="input-field" type="text" placeholder="Store City" />
      </div>
      <div>
        <label className="block mb-2">Zip Code</label>
        <input className="input-field" type="text" placeholder="Zip Code" />
      </div>
    </div>

    <div className="mt-5 font-semibold text-lg">
      Product Details
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <div>
        <label className="block mb-2">Product Categories</label>
        <select name="Category" className="input-field">
          <option value="Cake">Cake</option>
          <option value="Flower">Flower</option>
          <option value="Chocolates">Chocolates</option>
          <option value="Jewellery">Jewellery</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Product Sub-Categories</label>
        <select name="Category" className="input-field">
          <option value="Cake">Cake</option>
          <option value="Flower">Flower</option>
          <option value="Chocolates">Chocolates</option>
          <option value="Jewellery">Jewellery</option>
        </select>
      </div>
    </div>

    <div className="mt-5 font-semibold text-lg">
      Shipping Method
    </div>
    <div className="mt-2 border p-2 inline-block rounded-md">
      <div className="flex flex-wrap">
        <div className="selected-item">
          <span>Shiprocket</span>
          <button><AiOutlineClose className='scale-125 border bg-white rounded-full fill-gray-900' /></button>
        </div>
        <div className="selected-item">
          <span>E-Cart</span>
          <button><AiOutlineClose className='scale-125 border bg-white rounded-full fill-gray-900' /></button>
        </div>
        <div className="selected-item">
          <span>Firstflight</span>
          <button><AiOutlineClose className='scale-125 border bg-white rounded-full fill-gray-900' /></button>
        </div>
        <div className="selected-item">
          <span>Bluedart</span>
          <button><AiOutlineClose className='scale-125 border bg-white rounded-full fill-gray-900' /></button>
        </div>
      </div>
    </div>

    <div className="mt-5 font-semibold text-lg">
      Bank Details
    </div>
    <div className="mt-5 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      <div>
        <label className="block mb-2">Account Holder Name</label>
        <input className="input-field" type="text" placeholder="Name" />
      </div>
      <div>
        <label className="block mb-2">Account no.</label>
        <input className="input-field" type="text" placeholder="84988196818166" />
      </div>
      <div>
        <label className="block mb-2">IFSC Code</label>
        <input className="input-field" type="text" placeholder="SBIN000054961" />
      </div>
    </div>
  </div>


      {/* Update Button */}
      <div className='flex items-stretch m-5 focus:bg-gray-900' onClick={()=>{navigate('../Merchant')}}>
		    <button className="flex bg-gray-700 p-1 hover:bg-gray-900 text-white text-md items-center px-4 rounded-full focus:outline-none  ">
                Update Merchant<MdOutlineSend className='ml-2 scale-125  fill-white'/>
        </button>
      </div>
      </div>
    </>
  )
}
