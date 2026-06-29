import React from 'react'
import { RxCross1 } from "react-icons/rx";
function CheckStatusModel({show,setShow}) {
  return (
    <>
    <div className=' bg-gray-200 p-2 rounded-lg'>
        <div className=' w-full flex justify-end'>
            <RxCross1 className=' text-2xl' onClick={()=>{
                setShow(false)
            }} />
        </div>
    <div className=' text-yellow-800  md:text-2xl font-bold  py-10 md:p-20 flex justify-center text-center'>
        Verification in progress .....
    </div>
    </div>
    
    </>
  )
}

export default CheckStatusModel