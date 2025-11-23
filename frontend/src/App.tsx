import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./features/store";
import { fetchUser } from "./features/user/userThunks";
import { DarkmodeContextProvider } from "./context/DarkmodeContext";
import { SocketContextProvider } from "./context/socketContext";
import { ToastContainer } from "react-toastify";
import LazyLoader from "./components/LazyLoader";

// Lazy imports
import { lazy } from "react";
import CustomerProfile from "./pages/customer/Profile/CustomerProfile";
import CustomersPage from "./pages/admin/Customers/Customers";
import PrivacyPolicy from "./pages/customer/PrivacyPolicy";
import TermsAndConditions from "./pages/customer/TermsAndConditions";
import FAQ from "./pages/customer/FAQ";
import Contact from "./pages/customer/Contact";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Vouchers from "./pages/admin/Vouchers/Vouchers";
import CreateOrderPage from "./pages/admin/Order/CreateOrder";
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard/Dashboard"));
const Products = lazy(() => import("./pages/admin/Product/Products"));
const ProductPage = lazy(() => import("./pages/admin/Product/Product"));
const Home = lazy(() => import("./pages/customer/Home/Home"));
const Orders = lazy(() => import("./pages/admin/Order/Orders"));
const POSPage = lazy(() => import("./pages/admin/Order/POS"));
const OrderDetails = lazy(() => import("./pages/admin/Order/Order"));
const CustomerLayout = lazy(() => import("./layouts/CustomerLayout"));
const CustomerProducts = lazy(() => import("./pages/customer/Product/Products"));
const CustomerProduct = lazy(() => import("./pages/customer/Product/Product"));
const CustomerLogin = lazy(() => import("./pages/auth/CustomerLogin"));
const CheckoutPage = lazy(() => import("./pages/customer/Order/Checkout"));
const Cart = lazy(() => import("./pages/customer/Order/Cart"));
const CustomerOrders = lazy(() => import("./pages/customer/Order/Orders"));
const CustomerOrderDetails = lazy(() => import("./pages/customer/Order/Order"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const ActivityLogs = lazy(() => import("./pages/admin/Activities/ActivityLogs"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const Admins = lazy(() => import("./pages/admin/Admins/Admins"));
const AdminProductReviews = lazy(() => import("./pages/admin/Product/Reviews"));
const MyActivity = lazy(() => import("./pages/admin/Activities/MyActivity"));
const CustomerSignupPage = lazy(() => import("./pages/auth/CustomerSignup"));
const RefundsPage = lazy(() => import("./pages/admin/Refunds/Refunds"));
const InventoryStatus = lazy(() => import("./pages/admin/Product/InventoryStatus"));
const SuppliersPage = lazy(() => import("./pages/admin/Suppliers/Suppliers"));
const PurchaseOrdersPage = lazy(() => import("./pages/admin/PurchaseOrders/PurchaseOrders"));
const PurchaseOrder = lazy(() => import("./pages/admin/PurchaseOrders/PurchaseOrder"));

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <DarkmodeContextProvider>
      <ToastContainer />
        <BrowserRouter>
          <SocketContextProvider>
          <LazyLoader>
            <Routes>
              <Route index element={<Home />} />
              <Route element={<CustomerLayout />}>
                <Route path="terms-and-conditions" element={<TermsAndConditions />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="contact" element={<Contact />} />
                <Route path="products" element={<CustomerProducts />} />
                <Route path="product/:id" element={<CustomerProduct />} />
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="order/:id" element={<CustomerOrderDetails />} />
                <Route path="profile" element={<CustomerProfile />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password/:token" element={<ResetPassword />} />
                <Route path="login" element={<CustomerLogin />} />
                <Route path="signup" element={<CustomerSignupPage />} />
              </Route>
              <Route path="admin">
                <Route path="login" element={<AdminLogin />} />
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="product" element={<ProductPage />} />
                  <Route path="products" element={<Products />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="activities" element={<ActivityLogs />} />
                  <Route path="myactivity" element={<MyActivity />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="admins" element={<Admins />} />
                  <Route path="reviews/:id" element={<AdminProductReviews />} />
                  <Route path="refunds" element={<RefundsPage />} />
                  <Route path="inventory-status" element={<InventoryStatus />} />
                  <Route path="suppliers" element={<SuppliersPage />} />
                  <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                  <Route path="purchase-order" element={<PurchaseOrder />} />
                  <Route path="purchase-order/:id" element={<PurchaseOrder />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="vouchers" element={<Vouchers />} />
                  <Route path="pos" element={<POSPage />}/>
                  <Route path="orders">
                    <Route index element={<Orders />} />
                    <Route path="create" element={<CreateOrderPage />} />
                    <Route path=":id" element={<OrderDetails />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </LazyLoader>
          </SocketContextProvider>
        </BrowserRouter>
    </DarkmodeContextProvider>
  );
}
