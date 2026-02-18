import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProductList from './pages/products/ProductList';
import ProductDetails from './pages/products/ProductDetails';
import Cart from './pages/cart/Cart';
import CompareProducts from './pages/products/CompareProducts';
import Shipping from './pages/order/Shipping';
import ConfirmOrder from './pages/order/ConfirmOrder';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import Profile from './pages/user/Profile';
import MyOrders from './pages/order/MyOrders';
import OrderDetails from './pages/order/OrderDetails';
import ProtectedRoute from './components/route/ProtectedRoute';
import PaymentWrapper from './pages/order/PaymentWrapper';
import OrderSuccess from './pages/order/OrderSuccess';
// import { CartProvider } from './context/CartContext';
import ProductForm from './pages/admin/ProductForm';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminDiscounts from './pages/admin/AdminDiscounts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminContent from './pages/admin/AdminContent';
import AdminContentForm from './pages/admin/AdminContentForm';
import BecomeVendor from './pages/vendor/BecomeVendor';
import AdminVendorRequests from './pages/admin/AdminVendorRequests';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorProductList from './pages/vendor/VendorProductList';
import VendorDiscounts from './pages/vendor/VendorDiscounts';
import VendorReviews from './pages/vendor/VendorReviews';
import VendorDelivery from './pages/vendor/VendorDelivery';
import AdminOrders from './pages/admin/AdminOrders';

import Bestsellers from './pages/promotional/Bestsellers';
import NewArrivals from './pages/promotional/NewArrivals';
// import GiftCards from './pages/promotional/GiftCards';
import Support from './pages/static/Support';
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import FAQ from './pages/static/FAQ';
import ShippingInfo from './pages/static/ShippingInfo';
import Returns from './pages/static/Returns';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import TermsOfService from './pages/static/TermsOfService';

// Main App Component
function App() {
  const dispatch = useDispatch();
  const { loading, user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const isVendor = user?.role === 'vendor';

  // 🔥 Restore auth on refresh
  useEffect(() => {
  dispatch(checkAuth());
}, [dispatch]);

  // Optional loader while checking auth
  // if (loading) {
  //   return <div className="text-center mt-20">Loading...</div>;
  // }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex min-h-screen bg-gray-50">
        {(isAdmin || isVendor) && <Sidebar />}
        <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                isVendor ? <Navigate to="/vendor/dashboard" replace /> : <Home />
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/compare" element={<CompareProducts />} />


              {/* STATICS & PROMOTIONAL */}
              <Route path="/bestsellers" element={<Bestsellers />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/helpcentre" element={<FAQ />} />
              <Route path="/shipping-policy" element={<ShippingInfo />} />
              <Route path="/return-policy" element={<Returns />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />


              {/* USER PROTECTED */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/order/confirm" element={<ConfirmOrder />} />
                <Route path="/process/payment" element={<PaymentWrapper />} />
                <Route path="/success" element={<OrderSuccess />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/order/:id" element={<OrderDetails />} />
                <Route path="/become-vendor" element={<BecomeVendor />} />
              </Route>

              {/* ADMIN */}
              <Route element={<ProtectedRoute isAdmin />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/product/new" element={<ProductForm />} />
                <Route path="/admin/product/edit/:id" element={<ProductForm />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/discounts" element={<AdminDiscounts />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/content/new" element={<AdminContentForm />} />
                <Route path="/admin/content/edit/:id" element={<AdminContentForm />} />
                <Route path="/admin/vendor-requests" element={<AdminVendorRequests />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>

              {/* VENDOR */}
              <Route element={<ProtectedRoute isVendor />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/products" element={<VendorProductList />} />
                <Route path="/vendor/product/new" element={<ProductForm />} />
                <Route path="/vendor/product/edit/:id" element={<ProductForm />} />
                <Route path="/vendor/orders" element={<VendorOrders />} />
                <Route path="/vendor/discounts" element={<VendorDiscounts />} />
                <Route path="/vendor/reviews" element={<VendorReviews />} />
                <Route path="/vendor/delivery" element={<VendorDelivery />} />
              </Route>
            </Routes>
          </main>

          {!isAdmin && !isVendor && <Footer />}
        </div>
      </div>
    </>
  );
}

export default App;
