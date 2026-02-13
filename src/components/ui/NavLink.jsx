import { Link } from 'react-router-dom';

export const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="relative group text-gray-700 font-medium hover:text-blue-600 transition"
  >
    {children}
    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

export const MobileLink = ({ to, children, setIsOpen }) => (
  <Link
    to={to}
    onClick={() => setIsOpen(false)}
    className="block px-6 py-4 border-b hover:bg-gray-50 transition"
  >
    {children}
  </Link>
);
