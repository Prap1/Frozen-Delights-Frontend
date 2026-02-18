import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { loading } = useAuth();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await forgotPassword(email);
            setStep(2);
            setMessage('OTP sent to your email.');
            toast.success('OTP sent to your email.');
        } catch (err) {
            const errorMsg = err?.message || 'Failed to send OTP';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await resetPassword(email, otp, newPassword);
            toast.success('Password reset successful. Please login.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err?.message || 'Password reset failed';
            setError(errorMsg);
            toast.error(errorMsg);
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
                            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 1
                                ? "Enter your email and we'll send you a code to reset your password."
                                : "Enter the verification code and your new password."}
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="text-green-500 text-sm text-center bg-green-50 p-2 rounded-lg border border-green-100">
                            {message}
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                            <div className="space-y-5">
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? <Spinner /> : 'Send OTP'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <Link to="/login" className="font-medium text-sm text-gray-500 hover:text-[#E65555] flex items-center justify-center gap-2">
                                    <span>&larr;</span> Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form className="mt-8 space-y-6" onSubmit={handleReset}>
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
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? <Spinner /> : 'Reset Password'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="font-medium text-sm text-gray-500 hover:text-[#E65555]"
                                >
                                    Resend OTP / Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-1/2 bg-gray-900">
                <img
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    src="https://images.unsplash.com/photo-1557142046-c704a3adf364?q=80&w=2574&auto=format&fit=crop"
                    alt="Dessert background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                <div className="absolute bottom-0 left-0 p-16 text-white max-w-xl">
                    <h3 className="text-4xl font-bold mb-4">Don't Worry, We've Got You!</h3>
                    <p className="text-lg text-gray-200">
                        It happens to the best of us. We'll get you back to your delicious treats in no time.
                    </p>
                    <Link to="/" className="mt-8 inline-flex items-center text-white font-medium hover:underline group">
                        Back to Home <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>
                {/* Decorative Top Title */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full">
                    <span className="text-gray-900 font-bold tracking-widest uppercase text-sm">Recovery</span>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
