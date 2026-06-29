import React from 'react'
import { useNavigate } from 'react-router-dom'
const BannerPage= () => {
 const navigate=useNavigate()
  return (
    <div className='p-4 h-full w-full '>
       <p className='text-3xl text-center font-semibold'>Update Banners</p>
         <div className='mt-10'>
          <ul className='text-xl w-60 text-white text-center '>
          <li onClick={()=>navigate("/banner/home")} className='p-2 w-full mt-2 hover:bg-amber-500 cursor-pointer bg-neutral-400 rounded '>Home Page</li>
          
          <li onClick={()=>navigate("/banner/newsLetter")} className='p-2 w-full mt-2 hover:bg-amber-500 cursor-pointer bg-neutral-400 rounded '>News Letter</li>
          </ul>
         </div>
    </div>
  )
}

export default BannerPage
