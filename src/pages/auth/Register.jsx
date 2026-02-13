import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    registerInitiate,
    registerVerify,
    clearError
} from '../../features/auth/authSlice';

const Register = () => {
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        otp: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    /* ===================== AUTO REDIRECT AFTER LOGIN ===================== */
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/'); // dashboard or home
        }
    }, [isAuthenticated, navigate]);

    /* ===================== AUTO CLEAR ERROR ===================== */
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    /* ===================== HANDLE CHANGE ===================== */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /* ===================== SEND OTP ===================== */
    const handleInitiate = async (e) => {
        e.preventDefault();
        dispatch(clearError());
        setMessage('');

        const result = await dispatch(
            registerInitiate({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        );

        if (registerInitiate.fulfilled.match(result)) {
            setStep(2);
            setMessage('OTP sent to your email');
        }
    };

    /* ===================== VERIFY OTP & AUTO LOGIN ===================== */
    const handleVerify = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(
            registerVerify({
                username: formData.username,
                email: formData.email,
                otp: formData.otp
            })
        );

        // redirect handled by useEffect
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? 'Create your account' : 'Verify Email'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="text-green-500 text-sm text-center">
                        {message}
                    </div>
                )}

                {/* ===================== STEP 1 ===================== */}
                {step === 1 && (
                    <form className="space-y-6" onSubmit={handleInitiate}>
                        <input
                            name="username"
                            required
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />

                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />

                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {/* ===================== STEP 2 ===================== */}
                {step === 2 && (
                    <form className="space-y-6" onSubmit={handleVerify}>
                        <input
                            name="otp"
                            required
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Register'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
