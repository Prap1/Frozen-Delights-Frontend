import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminVendorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const config = {
                headers: {
                    // Authorization header removed as we rely on HttpOnly cookies
                },
                withCredentials: true
            };
            const { data } = await axios.get('http://localhost:5000/api/users/admin/vendor-requests', config);
            setRequests(data.users);
            setLoading(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching requests');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                    // Authorization header removed
                },
                withCredentials: true
            };
            const { data } = await axios.put(`http://localhost:5000/api/users/admin/vendor-status/${id}`, { status }, config);

            if (data.success) {
                toast.success(data.message);
                fetchRequests(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Vendor Requests</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No pending vendor requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{req.username}</div>
                                            <div className="text-sm text-gray-500">{req.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium">{req.brandName}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{req.address}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {req.contactNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                {req.vendorStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                            <button
                                                onClick={() => handleStatusUpdate(req._id, 'approved')}
                                                className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md border border-green-200 transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                                className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md border border-red-200 transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminVendorRequests;
