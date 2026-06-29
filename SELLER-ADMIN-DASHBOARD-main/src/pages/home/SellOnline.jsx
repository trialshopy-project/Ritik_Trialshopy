import React from "react";

const SellOnline = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        How to Sell Your Products Online?
      </h1>

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          1. Register as a Trianshopy Seller
        </h2>
        <p className="text-gray-700">
          Create an account on Trianshopy and list the products you want to sell
          online. All you need for Trianshopy seller registration is an active bank
          account and your GSTIN number (for GST sellers) or Enrolment ID / UIN
          (for non-GST sellers) and you'll be on your way to joining 11 Lakh+
          suppliers. On completing the registration, you will have access to the
          Trianshopy Supplier Panel. You can then start selling products online to
          crores of customers who shop on Trianshopy.
        </p>
      </div>

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          2. Upload Catalog and Receive Orders
        </h2>
        <p className="text-gray-700">
          Once registered, set up your product page to start selling online on
          Trianshopy. Upload your product catalog on the Trianshopy Supplier Panel and
          you’ll be all set to sell and grow your business online. Uploading
          catalogs on Trianshopy is very simple. You can either upload a single
          catalog or upload bulk catalogs through excel. Your product catalog
          gets live post 72 hours from the time of upload.
        </p>
      </div>

      <div className="step mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          3. Shipping & Order Delivery
        </h2>
        <p className="text-gray-700">
          With Trianshopy, you can enjoy easy and stress-free delivery of all your
          products. Once you receive an order for your product, you will get an
          email notification. You can also check the order update on the Trianshopy
          Supplier panel. Trianshopy delivers your product at the lowest shipping
          cost across India. Our logistics partner picks up the product from
          your location and delivers it straight to the customer.
        </p>
      </div>

      <div className="step">
        <h2 className="text-xl font-semibold text-yellow-500 mb-2">
          4. Receive Payment in Your Bank Account / Safe and Secure Payments
        </h2>
        <p className="text-gray-700">
          Payment is securely deposited directly in your bank account, we follow
          a 7-day payment cycle from order delivery, including Cash on Delivery
          orders. You can view your deposited balance and future payments on the
          Trianshopy Supplier Panel.
        </p>
      </div>
    </div>
  );
};

export default SellOnline;
