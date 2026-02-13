import { Link } from 'react-router-dom';

const OrderSuccess = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
                    <Link to="/orders" className="text-blue-600 hover:text-blue-500 font-medium">View Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
