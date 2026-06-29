import React from 'react'
import Image from 'next/image'
import Model from './model'
function CheckMyStatus() {
    const [show, setShow] = React.useState(false)
    return (
        <>
            <div className=' h-screen flex justify-center items-center'>
                <div className='  w-full md:w-1/2 lg:w-1/3 py-5  sm:shadow-2xl flex  sm:border-2 border-gray-300 items-center flex-col gap-8'>
                    <div className="flex items-center justify-center mt-5 md:mt-10">
                        <Image
                            width={20}
                            height={20}
                            src={'/images/NameLogo.svg'}
                            className="ml-[-100px] sm:w-[260px] w-[210px] h-[47px] sm:ml-0 sm:h-[60px] sm:justify-center sm:items-center"
                            alt="Logo"
                        />
                    </div>
                    <div>
                        <p className=' text-2xl font-bold'>
                            CHECK YOUR STATUS
                        </p>
                    </div>
                  { show &&
                    <div>
                        <Model show={show} setShow={setShow} />
                    </div>}
                    <div className=' w-full px-6 flex  flex-col gap-5'>
                        <div className=' w-full'>
                            <div>
                                <p>Enter your email</p>
                            </div>
                            <div className=' border-2 border-gray-400  mt-1 w-full'>
                                <input type="email" className=' p-1 w-full focus:outline-none'
                                    placeholder='Enter your email' />
                            </div>
                        </div>
                        <div className=' w-full'>
                            <div>
                                <p>Enter your Aadhar number</p>
                            </div>
                            <div className=' border-2 border-gray-400  mt-1 w-full'>
                                <input type="number" className=' p-1 w-full focus:outline-none'
                                    placeholder='Enter your Aadhar number' />
                            </div>
                        </div>
                    </div>
                    <div className=' bg-[#EB8105] py-1 px-3 rounded-lg' onClick={()=>{
                        setShow(true)
                    }}>
                        <button>CHECK STATUS</button>
                    </div>

                </div>
            </div>

        </>
    )
}

export default CheckMyStatus