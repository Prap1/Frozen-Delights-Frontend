import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/ui/Spinner';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1 = email, 2 = otp + password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const { forgotPassword, resetPassword, loading } = useAuth();
    const navigate = useNavigate();

    // =====================
    // SEND OTP
    // =====================
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await forgotPassword({ email: email.trim() });
            setStep(2);
            setMessage('OTP sent to your email.');
            toast.success('OTP sent to your email.');
        } catch (err) {
            const errorMsg = err?.message || 'Failed to send OTP';
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    // =====================
    // RESET PASSWORD
    // =====================
    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await resetPassword({
                email: email.trim(),
                otp: otp.trim(),
                newPassword
            });

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
            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">

                    {loading && (
                        <div className="flex justify-center mb-4">
                            <Loader />
                        </div>
                    )}

                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {step === 1
                                ? "Enter your email and we'll send you an OTP."
                                : "Enter OTP and your new password."}
                        </p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg">
                            {message}
                        </div>
                    )}

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-[#E65555]"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#E65555] text-white font-bold rounded-lg"
                            >
                                {loading ? <Spinner /> : 'Send OTP'}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-gray-500 hover:text-[#E65555]">
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form className="space-y-6" onSubmit={handleReset}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="w-full px-4 py-3 border rounded-lg text-center tracking-widest font-bold"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(e.target.value.replace(/\s/g, ''))
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 border rounded-lg"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-[#E65555] text-white font-bold rounded-lg"
                            >
                                {loading ? <Spinner /> : 'Reset Password'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-500 hover:text-[#E65555]"
                                >
                                    Resend OTP / Change Email
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="hidden lg:block w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1557142046-c704a3adf364"
                    alt="Dessert"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
        </div>
    );
};

export default ForgotPassword;
