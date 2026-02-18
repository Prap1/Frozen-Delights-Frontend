import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaTags,
  FaPercent,
  FaUsers,
  FaComment,
  FaEdit,
  FaClipboardList,
  FaStar,
} from "react-icons/fa";

import { fetchVendorRequests } from "../../features/users/userSlice";
import {
  fetchAdminOrders,
  fetchVendorOrders,
} from "../../features/orders/orderSlice";

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { vendorRequests } = useSelector((state) => state.users);
  const { adminOrders, vendorOrders } = useSelector(
    (state) => state.orders
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      dispatch(fetchVendorRequests());
      dispatch(fetchAdminOrders());
    }

    if (user.role === "vendor") {
      dispatch(fetchVendorOrders());
    }
  }, [dispatch, user]);

  /* ================= NEW ORDERS COUNT ================= */
  const newOrdersCount =
    user?.role === "admin"
      ? adminOrders?.filter(
          (order) => order.orderStatus === "Processing"
        ).length
      : vendorOrders?.filter(
          (order) => order.orderStatus === "Processing"
        ).length;

  /* ================= MENU CONFIG ================= */
  const adminMenuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/products", name: "Products", icon: <FaBoxOpen /> },
    { path: "/admin/orders", name: "Orders", icon: <FaClipboardList /> },
    { path: "/admin/categories", name: "Categories", icon: <FaTags /> },
    { path: "/admin/discounts", name: "Discounts", icon: <FaPercent /> },
    { path: "/admin/users", name: "Users", icon: <FaUsers /> },
    {
      path: "/admin/vendor-requests",
      name: "Vendor Requests",
      icon: <FaUsers />,
    },
    { path: "/admin/reviews", name: "Reviews", icon: <FaComment /> },
    { path: "/admin/content", name: "Content", icon: <FaEdit /> },
  ];

  const vendorMenuItems = [
    { path: "/vendor/dashboard", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/vendor/products", name: "My Products", icon: <FaBoxOpen /> },
    { path: "/vendor/orders", name: "Orders", icon: <FaClipboardList /> },
    { path: "/vendor/discounts", name: "Pricing & Offers", icon: <FaTags /> },
    { path: "/vendor/reviews", name: "Feedback", icon: <FaStar /> },
  ];

  const menuItems =
    user?.role === "admin"
      ? adminMenuItems
      : user?.role === "vendor"
      ? vendorMenuItems
      : [];

  /* ================= UI ================= */
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen hidden md:block flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-blue-400">
          {user?.role === "vendor" ? "Vendor Panel" : "Admin Panel"}
        </h2>
      </div>

      {/* Menu */}
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200
                  ${
                    isActive
                      ? "bg-gray-800 text-white border-l-4 border-blue-500"
                      : ""
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>

                  <span className="font-medium mr-auto">{item.name}</span>

                  {/* 🔴 ORDERS BADGE */}
                  {item.name === "Orders" && newOrdersCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {newOrdersCount}
                    </span>
                  )}

                  {/* 🔴 VENDOR REQUESTS BADGE */}
                  {item.name === "Vendor Requests" &&
                    vendorRequests?.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {vendorRequests.length}
                      </span>
                    )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
