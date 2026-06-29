import React from "react";

const PricingAndCommission = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Pricing & Commission
      </h1>
      <p className="text-center text-gray-700 mb-8">
        Trianshopy charges 0% Commission rate across all categories making it
        the most profitable platform for you to sell online.
      </p>

      {/* <div className="text-center mb-8">
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
          Don't have a GSTIN or have a Composition GSTIN? Click here to know
          more.
        </button>
      </div> */}

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          No Registration Fee
        </h2>
        <p className="text-gray-700">
          Registering as a Trianshopy seller is free - no cost of creating your
          account or getting your products listed.
        </p>
      </div>

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          No Collection Fee
        </h2>
        <p className="text-gray-700">
          You keep 100% of the sale price with no charges on both payment
          gateway or cash on delivery orders on Trianshopy.
        </p>
      </div>

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          No Penalty
        </h2>
        <p className="text-gray-700">
          Sell on Trianshopy stress-free without the fear of penalties for order
          cancellations.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Payment Cycle
        </h2>
        <p className="text-gray-700 mb-4">
          The settlement amount is securely deposited directly into your bank
          account following a 7-day payment cycle from order delivery, including
          cash on delivery orders. You can view your deposited balance and the
          upcoming payments on the Trianshopy Supplier Panel.
        </p>
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center mr-6">
            <span className="text-yellow-500 text-2xl mr-2">📅</span>
            <span className="text-gray-700">7-day payment cycle</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-500 text-2xl mr-2">🔒</span>
            <span className="text-gray-700">
              Secured payment in your account
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Quick Facts on Shipping & Delivery
        </h2>
        <p className="text-gray-700 mb-4">
          Trianshopy’s shipping service allows you to focus on selling, while we
          take care of the shipping and delivery with only 18% GST on the
          shipping charges. You can sell your products to crores of Trianshopy
          customers, schedule delivery with access to tens of thousands of local
          couriers, and have the flexibility to set your own prices.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Trianshopy Return Policy
        </h2>
        <p className="text-gray-700 mb-4">
          The Trianshopy Supplier Panel will provide visibility for returns on
          your inventory. This means you can make adjustments in real-time and
          deliver a great customer experience and minimize your returns. Use the
          Panel to manage your returns and reduce your processing costs.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Cancellation
        </h2>
        <p className="text-gray-700 mb-4">
          Trianshopy charges 0 penalties for supplier cancellations and auto
          cancellations. For situations when a supplier is not able to fulfil an
          order due to lack of inventory or any other unforeseen situation,
          suppliers can conduct their business tension-free on Trianshopy
          without worrying about the fear of paying penalties.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Return to Origin
        </h2>
        <p className="text-gray-700 mb-4">
          The shipping partner will try three times to reach the customer. If
          the customer does not accept the product, it will be returned to you.
          Trianshopy will not charge a return shipping fee for any RTOs.
        </p>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Sell Products Online at 0% Commission on Trianshopy
        </h2>
        <p className="text-gray-700 mb-4">
          Join the fastest growing e-commerce platform in India and sell to
          crores of users and grow your business
        </p>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-full">
          Start Selling
        </button>
      </div>
    </div>
  );
};

export default PricingAndCommission;
