import { Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Myaccount from "./pages/Myaccount";
import Reviews from "./pages/Products/Reviews";
import Category from "./pages/Products/Category";
import Commission from "./pages/Products/Commission";
import Commision from "./pages/Merchant/Commision";
import Payments from "./pages/Merchant/Payments";
import BulkUpload from "./pages/Products/Bulkupload";
import Merchant from "./pages/Merchant/Merchant";
import Products from "./pages/Products/Products";
import Customers from "./pages/Customers/Customers";
import AddCustomers from "./pages/Customers/Addcustomers";
import CustomerDetails from "./pages/Customers/CustomerDetails";
import AddressTypes from "./pages/Customers/AddressTypes";
import Orders from "./pages/Orders/Orders";
import AddMerchant from "./pages/Merchant/AddMerchant";
import EditMerchant from "./pages/Merchant/EditMerchant";
import Details from "./pages/Orders/Details";

import Addproducts from "./pages/Products/Addproducts";
import Editproducts from "./pages/Products/Editproducts";
import Reviewsdetails from "./pages/Products/Reviewsdetails";
import Editcategories from "./pages/Products/Editcategories";

import Offers from "./pages/Offers/Offers";

import "react-toastify/dist/ReactToastify.css";
import Login from "./admin/Login";
import AdminRegistrationForm from "./pages/AdminRegistrationForm";

import { Toaster } from "react-hot-toast";
import AddNewOffer from "./pages/Offers/AddNewOffer";
import CreateCategory from "./pages/Products/CreateCategory";
import { ProtectedRoute } from "./pages/ProtectedRoute";
import ForgotPassword from "./pages/home/ForgotPassword";
import ResetPassword from "./pages/home/ResetPassword";
import RootLayout from "./layouts/RootLayout";
import SellerDetails from "./pages/Merchant/SellerDetails";
import NotificationPage from './pages/Notification/NotificationPage';
import SendNotification from './pages/Notification/SendNotification';
import SupportPage from "./pages/supportAction/supportPage";
import AnsweredPage from "./pages/supportAction/answeredPage";
import { useContext } from "react";
import { UserContext } from "./components/context/UserContext";
import BannerPage from "./pages/banner/BannerPage";
import HomeBanner from "./pages/banner/HomeBanner";
import NewsLetterBanner from "./pages/banner/NewsLetterBanner";
import Domain from "./pages/domain/Domain";
import Coupons from "./pages/domain/Coupons";
const App = () => {
  const [authenticated] = useContext(UserContext);
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegistrationForm />} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route
          exact
          path="/password/reset/:token"
          element={<ResetPassword />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/myaccount" element={<Myaccount />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/details" element={<Details />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/addcustomers" element={<AddCustomers />} />
          <Route path="/customer-details/:id" element={<CustomerDetails />} />

          <Route path="/customers/address types" element={<AddressTypes />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/addproducts" element={<Addproducts />} />
          <Route path="/products/editproducts" element={<Editproducts />} />
          <Route path="/products/reviews" element={<Reviews />} />
          <Route
            path="/products/reviews/reviewsdetails"
            element={<Reviewsdetails />}
          />
          <Route path="/products/commission" element={<Commission />} />
          <Route path="/products/bulkUpload" element={<BulkUpload />} />
          <Route path="/products/category" element={<Category />} />
          <Route path="/products/addcategory" element={<CreateCategory />} />

          <Route path="/offers" element={<Offers />} />
          <Route path="/offers/addnewoffer" element={<AddNewOffer />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/notifications/sendnotification" element={<SendNotification />} />
          
          <Route
            path="/products/category/editcategories"
            element={<Editcategories />}
          />
          <Route path="/merchant/commission" element={<Commision />} />
          <Route path="/merchant/payments" element={<Payments />} />
          <Route path="/merchant/addmerchant" element={<AddMerchant />} />
          <Route path="/seller-details/:id" element={<SellerDetails />} />
          <Route path="/merchant/editmerchant" element={<EditMerchant />} />
          <Route path="/merchant" element={<Merchant />} />
          <Route path="/ticket" element={<SupportPage />} />
          <Route path="/answered" element={<AnsweredPage />} />
          <Route path="/banner" element={<BannerPage/>} />
          <Route path="/banner/home" element={<HomeBanner/>} />
          <Route path="/banner/newsLetter" element={<NewsLetterBanner/>} />
          <Route path="/domain" element={<Domain/>}/>
          <Route path="/coupons" element={<Coupons/>}/>
        </Route>
      </Routes>
      {/* {<button onClick={logout}>Logout</button>} */}
      <Toaster />
    </>
  );
};

export default App;
