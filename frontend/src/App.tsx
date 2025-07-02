import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/admin/Login";
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

function App() {
  return <BrowserRouter>
  <Routes>
    <Route element={<CustomerLayout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<CustomerProducts />} />
      <Route path="product/:id" element={<CustomerProduct />} />
    </Route>
    <Route path="login" element={<Login />} />
    <Route path="admin" element={<AdminLayout />} >
      <Route index element={<Navigate to="/admin/dashboard" />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products">
        <Route index element={<Products />} />
        <Route path="product" element={<ProductPage />} />
      </Route>
      <Route path="orders">
        <Route index element={<Orders />} />
        <Route path="create" element={<CreateOrderPage />} />
        <Route path=":id" element={<OrderDetails />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" />}/>
  </Routes>
  </BrowserRouter>
}

export default App