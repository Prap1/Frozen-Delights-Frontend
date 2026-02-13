import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { updateVendorStatus } from '../../features/auth/authSlice'; // functionality to be added

const BecomeVendor = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        brandName: '',
        contactNumber: '',
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const { brandName, contactNumber, address } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                    // Authorization header removed
                },
                withCredentials: true
            };

            const res = await axios.post('http://localhost:5000/api/users/become-vendor', formData, config);

            if (res.data.success) {
                toast.success('Vendor request submitted successfully! Please wait for admin approval.');
                // Update local user state if necessary
                // dispatch(updateVendorStatus('pending')); 
                navigate('/profile');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (user?.role === 'vendor') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">You are already a Vendor!</h2>
                    <button onClick={() => navigate('/vendor/dashboard')} className="text-blue-600 hover:underline">
                        Go to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    if (user?.vendorStatus === 'pending') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-blue-600">Application Pending</h2>
                    <p className="mt-2 text-gray-600">Your application to become a vendor is currently under review.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Become a Vendor
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start selling your frozen delights with us!
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="brandName" className="sr-only">Brand Name</label>
                            <input
                                id="brandName"
                                name="brandName"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Brand / Business Name"
                                value={brandName}
                                onChange={onChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="contactNumber" className="sr-only">Contact Number</label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contact Number"
                                value={contactNumber}
                                onChange={onChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="sr-only">Business Address</label>
                            <textarea
                                id="address"
                                name="address"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Business Address"
                                value={address}
                                onChange={onChange}
                                rows="3"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BecomeVendor;
