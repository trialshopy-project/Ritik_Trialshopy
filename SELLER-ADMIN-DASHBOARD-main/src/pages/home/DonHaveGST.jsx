import React from "react";
import { useNavigate } from "react-router-dom";

const DonHaveGST = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        No GSTIN? No Worries!
      </h1>
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
        Composition GSTIN? No Worries!
      </h2>
      <p className="text-center text-gray-700 mb-8">
        Whether you're a big business or a small one, now sell to millions in
        your state, without a Regular GSTIN.
      </p>

      <div className="text-center mb-8">
        <button
          onClick={() => navigate("/account/become-seller-growth")}
          className="bg-yellow-500 text-white py-2 px-4 rounded-full"
        >
          Register Now and Start Selling
        </button>
      </div>

      <div className="text-center mb-8">
        {/* <img
          src="path-to-non-gst-banner-image"
          alt="Non GST Banner"
          className="mx-auto"
        /> */}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          Opportunity for Sellers without a GSTIN or having a Composition GSTIN
        </h2>
        <p className="text-gray-700">
          Trianshopy welcomes sellers without a GSTIN or having a Composition
          GSTIN to sign up and begin selling to lakhs of customers within their
          own state.
        </p>
        <p className="text-gray-700 mt-4">
          For sellers not registered under GST, it's necessary to possess an
          enrollment ID or UIN for the registration process. If you haven't
          obtained your Enrolment ID or UIN yet, you can apply for it{" "}
          <a href="link-to-apply" className="text-yellow-500">
            here
          </a>{" "}
          and proceed to register on Trianshopy.
        </p>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Why Suppliers Love Trianshopy
        </h2>
        <p className="text-gray-700 mb-8">
          All the benefits that come with selling on Trianshopy are designed to
          help you sell more, and make it easier to grow your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            {/* <img
              src="path-to-icon-10"
              alt="0% Commission Fee"
              className="w-12 h-12 mr-4"
            /> */}
            <div>
              <h3 className="font-bold text-gray-800">0% Commission Fee</h3>
              <p className="text-gray-700">
                Suppliers selling on Trianshopy keep 100% of their profit by not
                paying any commission.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {/* <img
              src="path-to-icon-16"
              alt="0 Penalty Charges"
              className="w-12 h-12 mr-4"
            /> */}
            <div>
              <h3 className="font-bold text-gray-800">0 Penalty Charges</h3>
              <p className="text-gray-700">
                Sell online without the fear of order cancellation charges with
                0 Penalty for late dispatch or order cancellations.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {/* <img
              src="path-to-icon-11"
              alt="Growth for Every Supplier"
              className="w-12 h-12 mr-4"
            /> */}
            <div>
              <h3 className="font-bold text-gray-800">
                Growth for Every Supplier
              </h3>
              <p className="text-gray-700">
                From small to large and unbranded to branded, all suppliers have
                grown their businesses on Trianshopy.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {/* <img
              src="path-to-icon-12"
              alt="Ease of Doing Business"
              className="w-12 h-12 mr-4"
            /> */}
            <div>
              <h3 className="font-bold text-gray-800">
                Ease of Doing Business
              </h3>
              <p className="text-gray-700">
                Easy Product Listing, Lowest Cost Shipping, 7-Day Payment Cycle
                from the delivery date.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Become a Seller on Trianshopy in Simple Steps
        </h2>
        <ol className="list-decimal list-inside text-left mx-auto max-w-md text-gray-700">
          <li className="mb-2">
            Get Enrolment ID/UIN: Get Enrolment ID/UIN from{" "}
            <a href="link-to-enrolment" className="text-yellow-500">
              here
            </a>{" "}
            if you don’t have GSTIN. Otherwise, use your Composition GSTIN.
          </li>
          <li className="mb-2">
            Sign up for free: Register as a Trianshopy Seller. All you need is
            an active bank account and Enrolment ID / UIN (for sellers without
            GSTIN) or GSTIN (for GSTIN sellers).
          </li>
          <li className="mb-2">
            Upload your product & catalog: After completing the registration,
            upload your product catalog on the Trianshopy Supplier Panel.
          </li>
          <li className="mb-2">
            Receive & Ship Orders: Trianshopy charges the lowest shipping cost
            for deliveries.
          </li>
          <li className="mb-2">
            Receive Payments: Payment is securely deposited directly to your
            bank account on Trianshopy following a 7-day payment cycle from
            order delivery, including Cash on Delivery orders.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DonHaveGST;
