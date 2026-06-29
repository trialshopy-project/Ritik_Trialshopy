import React, { useEffect } from 'react';
import { useRef } from 'react';
const Modal = ({ isOpen, onClose, orderDetails }) => {
  if (!isOpen) return null;

  const {
    shippingAddress,
    userId,
    products,
    payment,
    totalPrice,
    phone_number,
    status,
    orderDate
  } = orderDetails;

  const sideRef=useRef();
  const handleClick = (e) => {
    if (sideRef.current && !sideRef.current.contains(e.target)) {
      onClose(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto" ref={sideRef}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Shipping Address</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-gray-600">{shippingAddress.country}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">User Details</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="flex justify-between mb-1 text-gray-600"><strong>Name:</strong> {userId.name}</p>
            <p className="flex justify-between text-gray-600"><strong>Email:</strong> {userId.email}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Products</h3>
          {products.length > 0 ? (
            products.map(product => (
              <div key={product._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                <p className="flex justify-between mb-1 text-gray-600"><strong>Product ID:</strong> {product._id}</p>
                <p className="flex justify-between text-gray-600"><strong>Status:</strong> {product.orderStatus}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No products in this order.</p>
          )}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Details</h3>
          {payment.length > 0 ? (
            payment.map(pay => (
              <div key={pay._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                <p className="flex justify-between mb-1 text-gray-600"><strong>Transaction ID:</strong> {pay.transactionId}</p>
                <p className="flex justify-between mb-1 text-gray-600"><strong>Total Amount:</strong> ${pay.totalAmount?.toFixed(2)}</p>
                <p className="flex justify-between text-gray-600"><strong>Payment Date:</strong> {new Date(pay.paymentDate).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No payment details available.</p>
          )}
        </div>

        <div className="mb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="flex justify-between mb-1 text-gray-600"><strong>Total Price:</strong> ${totalPrice?.toFixed(2)}</p>
            <p className="flex justify-between mb-1 text-gray-600"><strong>Phone Number:</strong> {phone_number}</p>
            <p className="flex justify-between mb-1 text-gray-600"><strong>Status:</strong> {status}</p>
            <p className="flex justify-between text-gray-600"><strong>Order Date:</strong> {new Date(orderDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
