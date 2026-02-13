import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ isAdmin = false, isVendor = false }) => {
    const { loading, isAuthenticated, user } = useAuth();

    // While checking auth (checkAuth API)
    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Safety check (user still null)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin only
    if (isAdmin && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // Vendor only
    if (isVendor && user.role !== 'vendor') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
