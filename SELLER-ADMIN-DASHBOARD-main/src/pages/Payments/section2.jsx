import React, { useState, useRef,useEffect } from 'react';
import { TbInfoSmall } from 'react-icons/tb';
import { RiArrowRightSLine } from 'react-icons/ri';
import { Link, Navigate } from 'react-router-dom';
// import { Router } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client'
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../components/context/UserContext';
function Section2() {
  const [paymentData, setPaymentData] = useState([
    { id: 1, label: 'Payment to Date', amount: '0', lastPayment: '$ 0' },
    { id: 2, label: 'New Payment', amount: '0', lastPayment: '$ 0' }
  ]);
  const [authenticated]=useContext(UserContext);
  const sellerId=authenticated?.user?._id;
  // const router=Router()
  const navigate=useNavigate()
  const socket=io('http://localhost:8000')//to be updated with real time server id 
  //fetching on every update
  // useEffect(
  //   ()=>{
      

  //   },[socket]
  // )


  //first fetching
  // useEffect(() => {
  //   axios.get('http://localhost:8000/api/v1/payment/last_payment')
  //     .then(response => {
  //       console.log(response);
  //     })
  //     .catch(err => {
  //       console.error('Error fetching the data', err);
  //     });
  // }, []);

const fetchPaymentData=async ()=>{
  const response=await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/api/payment/getPaymentDetails/${sellerId}`);
  console.log(response);
}


  const viewDetailsRefs = useRef([]);

  const handleViewDetailsClick = (id) => {
    const ref = viewDetailsRefs.current[id];
    if (ref) {
      // Handle button click logic here
      console.log(`View details for section ${id}`);
      if (id==1){
        navigate('/Payments/payment to date')
      }
      if (id==2){
        navigate('/Payments/total outstanding payment')
      }
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-2 w-full gap-4 flex flex-col ">
      {paymentData.map((data, index) => (
        <div key={data.id} className="bg-white text-black shadow-md rounded-lg p-6 m-2 flex flex-col justify-between items-start">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-600">{data.label}</span>
                {/* <TbInfoSmall className="h-7 w-7 text-gray-500 align-super" /> */}
              </div>
              <span className="text-black font-semibold text-3xl mt-2 mb-2">${data.amount}</span>
            </div>
            <button
              ref={(e) => (viewDetailsRefs.current[data.id] = e)}
              onClick={() => handleViewDetailsClick(data.id)}
              className="ring-2 ring-[#F19305] text-[#F19305] rounded-md px-4 py-2 hover:bg-[#F19305] hover:text-white transition-colors"
            >
              View Details
            </button>
          </div>
          <hr className="w-full border-t border-gray-300 my-4" />
          <Link className="flex justify-between w-full items-center text-gray-500" to={`${data.label==='Payment to Date'?'/Payments/last payment':'/Payments/next payment'}`}>
            <span className={`${data.label==='Payment to Date'?'':'hidden'}`}>Last Payment: {data.lastPayment}</span>
            <span className={`${data.label==='New Payment'?'':'hidden'}`}>Next Payment: {data.lastPayment}</span>
            <RiArrowRightSLine className="text-gray-500" />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Section2;
