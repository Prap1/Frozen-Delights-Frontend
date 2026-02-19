import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../../services/api";
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
  FaHome,
} from "react-icons/fa";
import { fetchVendorRequests } from "../../features/users/userSlice";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { vendorRequests } = useSelector((state) => state.users);

  const [newOrdersCount, setNewOrdersCount] = useState(0);

  // ✅ Fetch vendor requests for admin
  useEffect(() => {
    if (user?.role === "admin") {
      dispatch(fetchVendorRequests());
    }
  }, [dispatch, user]);

  // ✅ FIX: Refetch order count on route change
  useEffect(() => {
    if (!user) return;

    const fetchOrdersCount = async () => {
      try {
        let url = "";

        if (user.role === "admin") {
          url = "/orders";
        } else if (user.role === "vendor") {
          url = "/orders/vendor/orders"; // ✅ correct
        }

        if (!url) return;

        const { data } = await api.get(url);

        const processingCount = data.orders.filter(
          (order) => order.orderStatus === "Processing"
        ).length;

        setNewOrdersCount(processingCount);
      } catch (error) {
        console.error("Order count error:", error);
      }
    };

    fetchOrdersCount();
  }, [user, location.pathname]); // 🔥 IMPORTANT FIX

  const adminMenuItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "/admin/products", name: "Products", icon: <FaBoxOpen /> },
    { path: "/admin/orders", name: "Orders", icon: <FaClipboardList /> },
    { path: "/admin/categories", name: "Categories", icon: <FaTags /> },
    { path: "/admin/discounts", name: "Discounts", icon: <FaPercent /> },
    { path: "/admin/users", name: "Users", icon: <FaUsers /> },
    { path: "/admin/vendor-requests", name: "Vendor Requests", icon: <FaUsers /> },
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

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white min-h-screen
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-400">
            {user?.role === "vendor" ? "Vendor Panel" : "Admin Panel"}
          </h2>

          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={`flex items-center px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white
                    ${
                      isActive
                        ? "bg-gray-800 text-white border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <span className="mr-auto font-medium">{item.name}</span>

                    {/* Orders Notification */}
                    {item.name === "Orders" && newOrdersCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {newOrdersCount}
                      </span>
                    )}

                    {/* Vendor Requests Notification */}
                    {item.name === "Vendor Requests" &&
                      vendorRequests.length > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {vendorRequests.length}
                        </span>
                      )}
                  </Link>
                </li>
              );
            })}

            {!["admin", "vendor"].includes(user?.role) && (
              <li>
                <Link
                  to="/"
                  className="flex items-center px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white mt-4 border-t border-gray-800"
                >
                  <span className="text-xl mr-3">
                    <FaHome />
                  </span>
                  <span className="mr-auto font-medium">Home</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
