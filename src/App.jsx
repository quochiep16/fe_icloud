import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminOrderDetailPage from './pages/AdminOrderDetailPage';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminCreateProductPage from './pages/AdminCreateProductPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRevenuePage from './pages/AdminRevenuePage';

// 👇 THÊM MỚI
import AdminProductsPage from './pages/AdminProductsPage';
import AdminEditProductPage from './pages/AdminEditProductPage';

// 👇 QUAN TRỌNG: import http để set header Authorization
import http from './api/http';

export default function App() {
  // ✅ Khởi tạo user từ localStorage ngay từ lần render đầu
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  // ✅ Gắn accessToken vào http headers (axios) mỗi khi user thay đổi
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      http.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete http.defaults.headers.common.Authorization;
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Navbar user={user} setUser={setUser} />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />

            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/products" element={<ProductsPage user={user} />} />

            <Route
              path="/products/:id"
              element={<ProductDetailPage user={user} />}
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute user={user}>
                  <CartPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute user={user}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders/me"
              element={
                <ProtectedRoute user={user}>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />

            {/* ADMIN - tạo sản phẩm */}
            <Route
              path="/admin/products/new"
              element={
                <ProtectedRoute user={user}>
                  <AdminCreateProductPage user={user} />
                </ProtectedRoute>
              }
            />

            {/* ADMIN - danh sách & xoá sản phẩm */}
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute user={user}>
                  <AdminProductsPage user={user} />
                </ProtectedRoute>
              }
            />

            {/* ADMIN - chỉnh sửa sản phẩm */}
            <Route
              path="/admin/products/:id/edit"
              element={
                <ProtectedRoute user={user}>
                  <AdminEditProductPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute user={user}>
                  <AdminUsersPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute user={user}>
                  <AdminOrdersPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute user={user}>
                  <AdminOrderDetailPage user={user} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/revenue"
              element={
                <ProtectedRoute user={user}>
                  <AdminRevenuePage user={user} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<p>404 - Không tìm thấy trang</p>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
