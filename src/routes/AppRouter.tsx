import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import WishlistPage from "../pages/WishlistPage";
import PaymentPage from "../pages/PaymentPage";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserListPage from "../pages/admin/UserListPage";
import ProductListPage from "../pages/admin/ProductListPage";
import ManageOrders from "../pages/admin/ManageOrders";
import ProductsPage from "../pages/ProductsPage";
import BrandsPage from "../pages/BrandsPage";
import ManageCategories from "../pages/admin/ManageCategories";
import OrderSuccessPage from "../pages/OrderSuccessPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserListPage />} />
        <Route path="/admin/products" element={<ProductListPage />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/categories" element={<ManageCategories />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
