import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Product/Products";
import ProductPage from "./pages/admin/Product/Product";
import Home from "./pages/customer/Home/Home";
import Orders from "./pages/admin/Order/Orders";
import CreateOrderPage from "./pages/admin/Order/CreateOrder";
import OrderDetails from "./pages/admin/Order/Order";
import CustomerLayout from "./layouts/CustomerLayout";
import CustomerProducts from "./pages/customer/Product/Products";
import CustomerProduct from "./pages/customer/Product/Product";
import CustomerLogin from "./pages/auth/CustomerLogin";
import { DarkmodeContextProvider } from "./context/DarkmodeContext";
import { SocketContextProvider } from "./context/socketContext";
import CheckoutPage from "./pages/customer/Order/Checkout";
import Cart from "./pages/customer/Order/Cart";
import CustomerOrders from "./pages/customer/Order/Orders";
import CustomerOrderDetails from "./pages/customer/Order/Order";
import { ToastContainer } from 'react-toastify';
import AdminNotifications from "./pages/admin/Notifications";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Settings from "./pages/admin/Settings";
import Admins from "./pages/admin/Admins";
import AdminProductReviews from "./pages/admin/Product/Reviews";
import MyActivity from "./pages/admin/MyActivity";
import CustomerSignupPage from "./pages/auth/CustomerSignup";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import { fetchUser } from "./redux/user-reducer";
import RefundsPage from "./pages/admin/Refunds";
import LowStockAlerts from "./pages/admin/LowStockAlerts";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
  useEffect(() => {

  }, [dispatch])

  return (
    <DarkmodeContextProvider>
      <ToastContainer />
      <SocketContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<CustomerLogin />} />
            <Route path="signup" element={<CustomerSignupPage />} />
            <Route index element={<Home />} />
            <Route element={<CustomerLayout />}>
              <Route path="products" element={<CustomerProducts />} />
              <Route path="product/:id" element={<CustomerProduct />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<CustomerOrders />} />
              <Route path="order/:id" element={<CustomerOrderDetails />} />
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
                <Route path="myactivity" element={<MyActivity />}/>
                <Route path="settings" element={<Settings />} />
                <Route path="admins" element={<Admins />} />
                <Route path="reviews/:id" element={<AdminProductReviews />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="low-stock-alerts" element={<LowStockAlerts />} />
                <Route path="orders">
                  <Route index element={<Orders />} />
                  <Route path="create" element={<CreateOrderPage />} />
                  <Route path=":id" element={<OrderDetails />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />}/>
          </Routes>
        </BrowserRouter>
      </SocketContextProvider>
    </DarkmodeContextProvider>
  )
}