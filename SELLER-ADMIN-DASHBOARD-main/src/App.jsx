import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";

// import Login from "./pages/Login";
import Reviews from "./pages/Products/Reviews";
import Category from "./pages/Products/Category";

import Commission from "./pages/Products/Commission";

import Bulkupload from "./pages/Products/Bulkupload";

import Products from "./pages/Products/Products";
import Customers from "./pages/Customers/Customers";
import AddCustomers from "./pages/Customers/Addcustomers";
import Orders from "./pages/Orders/Orders";
import Page from "./pages/Payments/page.jsx";
import Offers from "./pages/Offers/Offers";
// import Tracking from "./pages/Tracking/Tracking";
// import Country from "./pages/Customers/Country";
// import State from "./pages/Customers/State";
// import City from "./pages/Customers/CustomerDetails.jsx";
import Details from "./pages/Orders/Details";
import Basicinfo from "./pages/Orders/Basicinfo";
import Ordernote from "./pages/Orders/Ordernote";
import Paymentdetails from "./pages/Orders/Paymentdetails";
import Shippingdetails from "./pages/Orders/Shippingdetails";
import Addproducts from "./pages/Products/Addproducts";
import Reviewsdetails from "./pages/Products/Reviewsdetails";
import Editproducts from "./pages/Products/Editproducts";
import Editcategories from "./pages/Products/Editcategories";
// import AddressTypes from "./pages/Customers/Addresstypes";
import PhoneOtp from "./pages/PhoneOtp";
import HomePage from "./pages/Home";
import Become_sheller_otp from "./pages/account/become-seller-growth";
import { Toaster } from "react-hot-toast";
import Chats from "./pages/chats/chats.jsx";
import Livemeeting from "./pages/livemeeting/livemeeting.jsx";

import Login from "./components/verification/BecomeSellerLogin.jsx";
import MainBasicInfo from "./components/verification/MainBasicInfo.jsx";
import MainBusinessInfo from "./components/verification/MainBusinessInfo.jsx";
import MainVerification from "./components/verification/MainVerification.jsx";
import MainVerificationDone from "./components/verification/MainVerificationDone.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import NotFound from "./layouts/Notfound/NotFound.jsx";
import Myaccount from "./pages/MyAccount/Myaccount.jsx";
import MyStore from "./pages/MyStore/MyStore.jsx";
import CustomerDetails from "./pages/Customers/CustomerDetails.jsx";
import EditCommission from "./pages/Products/EditCommission.jsx";
import AddNewOffer from "./pages/Offers/Addnewoffer";
// import { UserProvider } from "./components/UserContext.jsx";
import StatusPage from "./components/verification/StatusPage.jsx";
import Meetings from "./pages/meetings/meetings.jsx";
import SellOnline from "./pages/home/SellOnline.jsx";
import PricingAndCommission from "./pages/home/PricingAndCommission.jsx";
import HowItWorks from "./pages/home/HowItWorks.jsx";
import GrowBussiness from "./pages/home/GrowBussiness.jsx";
import DonHaveGST from "./pages/home/DonHaveGST.jsx";
import ForgotPassword from "./pages/home/ForgotPassword.jsx";
import ResetPassword from "./pages/home/ResetPassword.jsx";
import TermsConditions from "./pages/account/TermsConditions.jsx";
import App_support from "./pages/support/app_support.jsx";
import Refferal_payments from "./pages/Payments/referral_payment.jsx";
// import HomePage from "./pages/support/pages/HomePage.jsx";
import Compensation from "./pages/Payments/compensation.jsx";
import Payment_to_date from "./pages/Payments/payment_to_date.jsx";
import Outstanding from "./pages/Payments/Total_outstanding_page.jsx";
import SupportHomePage from "./pages/support/pages/HomePage.jsx";
import IssueCategoryPage from "./pages/support/pages/IssueCategoryPage.jsx";
import IssueSubCat from "./pages/support/pages/IssueSubCat.jsx";
import Last_Payment from "./pages/Payments/last_payment.jsx";
import Next_Payment from "./pages/Payments/Next_Payment.jsx";
import OnHold from "./pages/Orders/pages/OnHold.jsx";
import Pending from "./pages/Orders/pages/Pending.jsx";
import Ready_to_Ship from "./pages/Orders/pages/Ready_to_Ship.jsx";
import Shipped from "./pages/Orders/pages/Shipped.jsx";
import Cancelled from "./pages/Orders/pages/Cancelled.jsx";
import Overview from "./pages/Return/Pages/Overview.jsx";
import Return_Tracking from "./pages/Return/Components/Return_Tracking";
import Claim_Tracking from "./pages/Return/Components/Claim_Tracking";
import Courier_Partner from "./pages/Return/Components/Courier_partner.jsx";
import Return_Tracking_In_transit from "./pages/Return/Pages/Return_tracking/Return_tracking_In_transit.jsx";
import Return_Tracking_Disposed from "./pages/Return/Pages/Return_tracking/Return_Tracking_Disposed";
import Return_Tracking_lost from "./pages/Return/Pages/Return_tracking/Return_Tracking_lost";
import Return_Tracking_Delivered from "./pages/Return/Pages/Return_tracking/Return_Tracking_Delivered.jsx";
import Return_tracking_out_for_delivery from "./pages/Return/Pages/Return_tracking/Return_tracking_out_for_delivery";
import All from "./pages/Return/Pages/Claim_Tracking/All.jsx";
import Approved from "./pages/Return/Pages/Claim_Tracking/Approved.jsx";
import Rejected from "./pages/Return/Pages/Claim_Tracking/Rejected.jsx";
import Open from "./pages/Return/Pages/Claim_Tracking/Open.jsx";
import Rent_upload from "./pages/Products/Rent_upload.jsx";
import Processed from "./pages/Orders/pages/processed.jsx";
import AddRent from "./pages/Products/addRent.jsx";
import TicketHomePage from "./pages/support/pages/ticketPage.jsx";
import UpdateOffer from "./pages/Offers/updateOffer.jsx";
import Basic_info from "./pages/Products/Addeditproductfiles/Basic_info.jsx";
import { ChatContextProvider } from "./pages/chats/ChatContext.jsx";
import SellerLiveStream from "./pages/LiveStream/LiveStream.jsx";
import MeetRequest from "./pages/meetings/MeetRequests.jsx";
import Reel from "./pages/reels/reel.jsx";
import UploadReel from "./pages/reels/UploadReel.jsx";
const App = () => {
  return (
    <ChatContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route
          path="/account/become-seller-growth"
          element={<Become_sheller_otp />}
        />
        <Route path="/become-seller/sellerlogin" element={<Login />} />
        <Route
          path="/become-seller/verification"
          element={<MainVerification />}
        />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />
        <Route
          exact
          path="/becomes-seller/terms-and-condition"
          element={<TermsConditions />}
        />
        <Route
          path="/become-seller/verificationdone"
          element={<MainVerificationDone />}
        />
        <Route path="/sell-online" element={<SellOnline />} />{" "}
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route
          path="/pricing-commission"
          element={<PricingAndCommission />}
        />{" "}
        <Route path="/grow-business" element={<GrowBussiness />} />
        <Route path="/no-gst" element={<DonHaveGST />} />
        <Route
          path="/become-seller/verification-status"
          element={<StatusPage />}
        />
        <Route path="/phoneotp" element={<PhoneOtp />} />
        {/* PROTECT ROUTE ==========================> */}
        <Route path="/become-seller/basic-info" element={<MainBasicInfo />} />
        <Route
          path="/become-seller/business-info"
          element={<MainBusinessInfo />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/myaccount" element={<Myaccount />} />
          <Route path="/dashboard/mystore" element={<MyStore />} />
          {/* <Route path="/support" element={<HomePage />} /> */}
          {/**--------------------------------------order route updation -------------------------------------------- */}
          {/* <Route path="/orders" element={<Orders />} /> */}
          <Route path="/onhold" element={<OnHold />} />
          <Route path="/orders" element={<Pending />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/processed" element={<Processed />} />
          <Route path="/ready_to_ship" element={<Ready_to_Ship />} />
          <Route path="/shipped" element={<Shipped />} />
          <Route path="/cancelled" element={<Cancelled />} />
          {/**--------------------------------------------------------------------------------------------------------- */}
          {/**Return route -------------------------------------------------------------------> */}

          <Route path="/overview" element={<Overview />} />
          <Route path="/return_tracking" element={<Return_Tracking />} />
          <Route path="/claim_tracking" element={<Claim_Tracking />} />
          <Route path="/courier_partner" element={<Courier_Partner />} />
          <Route
            path="/return_tracking/in_transit"
            element={<Return_Tracking_In_transit />}
          />
          <Route
            path="/return_tracking/out_for_delivery"
            element={<Return_tracking_out_for_delivery />}
          />
          <Route
            path="/return_tracking/delivered"
            element={<Return_Tracking_Delivered />}
          />
          <Route
            path="/return_tracking/lost"
            element={<Return_Tracking_lost />}
          />
          <Route
            path="/return_tracking/disposed"
            element={<Return_Tracking_Disposed />}
          />
          <Route path="/claim_tracking/all" element={<All />} />
          <Route path="/claim_tracking/open" element={<Open />} />
          <Route path="/claim_tracking/approved" element={<Approved />} />
          <Route path="/claim_tracking/rejected" element={<Rejected />} />

          {/**-------------------------------------------------------------------------------------------------------------- */}
          <Route path="/basicinfo" element={<Basicinfo />} />
          <Route path="/ordernote" element={<Ordernote />} />
          <Route path="/paymentdetails" element={<Paymentdetails />} />
          <Route path="/shippingdetails" element={<Shippingdetails />} />

          <Route path="/orders/details" element={<Details />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/addcustomers" element={<AddCustomers />} />
          <Route path="/livestream" element={<SellerLiveStream />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/meetings/request" element={<MeetRequest />} />

          <Route path="/livemeeting/meeting/:id" element={<Livemeeting />} />

          <Route
            path="/customers/customer details"
            element={<CustomerDetails />}
          />

          <Route
            // path="/Payments/:Refferal_Payments"
            path="/Payments/Refferal_Payments"
            element={<Refferal_payments />}
          />

          <Route path="/Payments/compensation" element={<Compensation />} />
          <Route
            path="/Payments/payment to date"
            element={<Payment_to_date />}
          />
          <Route
            path="/Payments/total outstanding payment"
            element={<Outstanding />}
          />
          <Route path="/Payments/last payment" element={<Last_Payment />} />
          <Route path="/Payments/next payment" element={<Next_Payment />} />

          {/*-----------------------------------------------support routing ---------------------------------------------*/}

          <Route path="/support" element={<SupportHomePage />} />
          <Route path="/tickets" element={<TicketHomePage />} />
          <Route path="/support/issue" element={<IssueCategoryPage />} />
          {/* <Route path="/support/issue" element={<IssueSubCat/>} /> */}

          {/* <Route path="/customers/address types" element={<AddressTypes />} /> */}
          {/* <Route path="/tracking" element={<Tracking />} /> */}
          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/updateOffer" element={<UpdateOffer />} />
          <Route path="/payments" element={<Page />} />
          <Route path="/offers/addnewoffer" element={<AddNewOffer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/addproducts" element={<Addproducts />} />
          <Route path="/products/addRent" element={<AddRent />} />

          {/* reels */}
          <Route path="/reels" element={<Reel />} />
          <Route path="/reels/uploadReels" element={<UploadReel />} />

          {/* <Route path="/products/editproducts" element={<Editproducts />} /> */}
          <Route path="/products/editproducts" element={<Editproducts />} />
          <Route path="/editcommission" element={<EditCommission />} />

          <Route path="/products/reviews" element={<Reviews />} />
          <Route
            path="/products/reviews/reviewsdetails"
            element={<Reviewsdetails />}
          />
          <Route path="/products/commission" element={<Commission />} />
          <Route path="/products/bulk upload" element={<Bulkupload />} />
          <Route path="/products/category" element={<Category />} />
          <Route path="/products/Upload for Rent" element={<Rent_upload />} />
          <Route
            path="/products/category/editcategories"
            element={<Editcategories />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ChatContextProvider>
  );
};

export default App;
