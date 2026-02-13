import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';

const Shipping = () => {
    const { shippingInfo, saveShippingInfo } = useContext(CartContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingInfo.address || '');
    const [city, setCity] = useState(shippingInfo.city || '');
    const [state, setState] = useState(shippingInfo.state || '');
    const [country, setCountry] = useState(shippingInfo.country || '');
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode || '');
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo || '');

    const submitHandler = (e) => {
        e.preventDefault();
        saveShippingInfo({ address, city, state, country, pinCode, phoneNo });
        navigate('/order/confirm');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Shipping Name & Address</h2>
            <form onSubmit={submitHandler} className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="number"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <select
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        {/* Add more countries if needed */}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Continue
                </button>
            </form>
        </div>
    );
};

export default Shipping;
