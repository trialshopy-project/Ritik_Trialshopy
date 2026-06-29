import React from 'react';
import Header from '../../../layouts/Topbar';
import { RiArrowDropRightLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
function Compensation() {
    const info=useParams()
    // console.log(info.compensation)
    // console.log(info.Refferal_Payments)
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-col gap-4 justify-start mt-20 px-4">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-start gap-5">
          <div className="flex flex-row gap-1 justify-start items-center">
            <span className="font-semibold text-sm text-gray-800">Payments</span>
            <RiArrowDropRightLine className='w-7 h-7' />
            <span className="font-semibold text-[12px] text-gray-400">Compensation & Recoveries</span>
          </div>

          <Link className='flex flex-row justify-start items-center' to='/payments'>
            <RiArrowLeftSLine className='w-7 h-7' />
            <h1 className='text-lg font-bold'>Compensation</h1>
          </Link>
        </div>
        <div>
            {/* to be added dynamically*/}
        </div>
        
      </div>
    </div>
  );
}

export default Compensation;
