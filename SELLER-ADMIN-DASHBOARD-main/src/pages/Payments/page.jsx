import React, { useState, useEffect, useRef } from "react";
import Topbar from "../../layouts/Topbar";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from '../../layouts/sidebar';
import { CiSearch } from "react-icons/ci";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import Section2 from "./section2";
import Section4 from "./section4";
import Header from "../../layouts/Topbar";
// import Modal from './Modal.jsx'
function Page() {
    const [isScroll, setIsScroll] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    function handleScroll() {
        if (window.scrollY > 0) {
            setIsScroll(true);
        } else {
            setIsScroll(false);
        }
    }

    const showModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Page layout */}
            <div className="flex flex-col">
                {/* Fixed Topbar */}
                {/* <Topbar className={`fixed top-0 left-0 w-full z-[50]`} /> */}
        <Header />
                {/* Main content */}
                <div className="flex flex-col mt-12">
                <div className={` top-20 flex flex-col lg:flex-row justify-between items-center ${isScroll ? 'shadow-xl' : 'shadow-none'} px-5 py-1 bg-white text-black my-1 mx-4 mt-9 rounded-xl`}>
                        {/* Payment section */}
                        <div className='flex items-start p-4'>
                            <h1 className='font-bold'>Payments</h1>
                        </div>
                        {/* Right side payment section */}
                        <div className='flex  flex-col lg:flex-row items-center justify-evenly p-4 gap-4'>
                            <Dropdown task="Download" onClickOption={showModal} />
                            <div className="flex flex-col lg:flex-row gap-0 bg-none ring-[#F19305] ring-2 rounded-md justify-between border-b-4 border-sky-400">
                                <Dropdown task="Order No." className='text-nowrap border-b-4 border-customPurple' />
                                <div className="flex flex-col lg:flex-row justify-between items-center border-l-2 border-blue-300">
                                    <input type='text' placeholder='' className="border-none border-[#F19305] border-l-2 focus:border-none focus:ring-0 border-t-4" />
                                    <CiSearch className="text-gray-400 m-4 hidden lg:block" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center section details */}
                    <div className="p-2 m-1 flex flex-col gap-4 mt-1 ">
                        <Section2 />
                    </div>

                    <div className="p-4 m-1 flex mt-1 ">
                        <Section4 />
                    </div>

                </div>
            </div>

            {/* Modal Implementation */}
            <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
        </>
    );
}

export default Page;

const Dropdown = ({ task, onClickOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const manage_out_click = useRef(null);
    const [selected, setSelected] = useState(task);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleItemClick = (item) => {
        setSelected(item);
        onClickOption(item); // Show modal with the selected item as content
        setIsOpen(false);
    };

    function handleOutsideClick(e) {
        if (manage_out_click.current && !manage_out_click.current.contains(e.target)) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        window.addEventListener('mousedown', handleOutsideClick);

        return () => {
            window.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const download_button_handler = [
        'GST Report',
        'Tax Invoice',
        'Commission Tax Invoice',
        'Payments to Date',
        'Outstanding Payments'
    ];

    const Order_radio = () => {
        const [selectedValue, setSelectedValue] = useState('Order No.');

        const handleSelection = (e) => {
            setSelectedValue(e.target.value);
            setSelected(e.target.value);
        };

        return (
            <div className="py-2 px-4 flex flex-col gap-4">
                <label className="flex flex-row gap-3 justify-start items-center">
                    <input
                        type='radio'
                        value='Order No.'
                        checked={selectedValue === 'Order No.'}
                        onChange={handleSelection}
                        className="text-left block"
                    />
                    Order No.
                </label>
                <label className="flex flex-row gap-3 justify-start items-center">
                    <input
                        type='radio'
                        value='NEFT/UTR'
                        checked={selectedValue === 'NEFT/UTR'}
                        onChange={handleSelection}
                        className="text-left block"
                    />
                    NEFT/UTR
                </label>
            </div>
        );
    };

    return (
        <div className="relative inline-block">
            <button 
                onClick={toggleDropdown} 
                className={`inline-flex justify-center w-full rounded-xl font-medium text-sm p-4 items-center flex-row ${task === 'Download' ? 'text-white bg-[#F19305] p-4 rounded-sm font-bold' : ''} text-nowrap`}
            >
                {task === 'Download' && <RiFileExcel2Fill className="text-white w-5 h-5 mr-2" />}
                {task === 'Download' ? 'Download' : selected}
                {isOpen ? <MdKeyboardArrowUp className="w-7 h-7" /> : <MdOutlineKeyboardArrowDown className="w-7 h-7" />}
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 min-w-48 bg-white rounded-lg shadow-lg" ref={manage_out_click}>
                    {task === 'Download' &&
                        download_button_handler.map((value, index) => (
                            <button key={index} onClick={() => handleItemClick(value)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                {value}
                            </button>
                        ))
                    }
                    {task === 'Order No.' && (
                        <>
                            <span className="text-sm text-gray-400 block px-4 py-2 hover:bg-gray-100 w-full text-left">Select</span>
                            <Order_radio />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-4">{content}</h2>
                <hr />
                <p className="mb-4 mt-4">You selected: {content}</p>
                {/**<------------------------------------------to be added here content to place here --------------------------------------> */}
                {
                    // ------------------------------------ added footer here ---------------------------------------------
                    <hr />
                    
                }
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={onClose}
                    >
                        OK
                    </button>
                    <button
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

