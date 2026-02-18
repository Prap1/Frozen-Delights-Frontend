import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    registerInitiate,
    registerVerify,
    clearError
} from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';
import image from "../../assets/image.png"

const Register = () => {
    const [step, setStep] = useState(1); // 1 = form, 2 = OTP

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
            toast.success('Login Successful');
            navigate('/'); // dashboard or home
        }
    }, [isAuthenticated, navigate]);

    /* ===================== AUTO CLEAR ERROR ===================== */
    useEffect(() => {
        if (error) {
            toast.error(error);
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

        const result = await dispatch(
            registerInitiate({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        );

        if (registerInitiate.fulfilled.match(result)) {
            console.log("Dispatch success:", result);
            setStep(2);
            toast.success('OTP sent to your email');
        } else {
            console.error("Dispatch failed:", result);
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

        if (registerVerify.fulfilled.match(result)) {
            // redirect handled by useEffect when isAuthenticated becomes true
            // toast.success('Registration and Login Successful'); // handled in useEffect
        } else {
            // toast.error(...) handled by useEffect
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-['Poppins']">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {loading && <div className="flex justify-center mb-4"><Loader /></div>}

                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {step === 1 ? 'Create Account' : 'Verify Your Email'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 1
                                ? "Join us today and enjoy exclusive frozen delights!"
                                : "We've sent a verification code to your email."}
                        </p>
                    </div>

                    {/* ===================== STEP 1 ===================== */}
                    {step === 1 && (
                        <form className="mt-8 space-y-6" onSubmit={handleInitiate}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? <Spinner /> : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ===================== STEP 2 ===================== */}
                    {step === 2 && (
                        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                        Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors text-center tracking-[0.5em] text-lg font-bold"
                                        placeholder="Enter OTP"
                                        value={formData.otp}
                                        onChange={handleChange}
                                    />
                                    <p className="mt-2 text-xs text-gray-500 text-center">
                                        Please check your email inbox and spam folder.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? <Spinner /> : 'Verify & Complete'}
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-500 hover:text-[#E65555] font-medium"
                                >
                                    Change Email / Back
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[#E65555] hover:text-[#d14040]">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-1/2 bg-gray-900">
                <img
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    src={image}
                    alt="Ice Cream background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                <div className="absolute bottom-0 left-0 p-16 text-white max-w-xl">
                    <h3 className="text-4xl font-bold mb-4">Join the Sweetest Community!</h3>
                    <p className="text-lg text-gray-200">
                        Sign up today and get exclusive access to our newest flavors, special offers, and more.
                    </p>
                    <Link to="/" className="mt-8 inline-flex items-center text-white font-medium hover:underline group">
                        Back to Home <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>
                {/* Decorative Top Title */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full">
                    <span className="text-gray-900 font-bold tracking-widest uppercase text-sm">Join Us</span>
                </div>
            </div>
        </div>
    );
};

export default Register;

