import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/admin/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductPage from "./pages/admin/Product";
import Home from "./pages/customer/Home";

function App() {
  return <BrowserRouter>
  <Routes>
    <Route index element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="admin" element={<AdminLayout />} >
      <Route index element={<AdminDashboard />} />
      <Route path="products" element={<Products />} />
      <Route path="product" element={<ProductPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" />}/>
  </Routes>
  </BrowserRouter>
}

export default App