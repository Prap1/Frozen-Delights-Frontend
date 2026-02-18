import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/auth/authSlice';
import Spinner from '../../components/ui/Spinner';
import Loader from '../../components/ui/Loader';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const [submitted, setSubmitted] = useState(false);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (isAuthenticated && user) {
            if (submitted) {
                toast.success('Login Successful');
            }
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate(redirect === '/' ? '/' : `/${redirect}`);
            }
        }
    }, [isAuthenticated, user, navigate, redirect, submitted]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        dispatch(login({ email, password }));
    };

    // Clear error on unmount or input change could be handled, but for now simple
    useEffect(() => {
        if (error) {
            toast.error(typeof error === 'string' ? error : error.message);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    return (
        <div className="min-h-screen flex bg-white font-['Poppins']">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {loading && <div className="flex justify-center mb-4"><Loader /></div>}

                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter your email and password to access your account!
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-[#E65555] focus:border-[#E65555] sm:text-sm transition-colors"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#E65555] focus:ring-[#E65555] border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-[#E65555] hover:text-[#d14040]">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                                {typeof error === 'string' ? error : error.message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#E65555] hover:bg-[#d14040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E65555] disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {loading ? <Spinner /> : 'Sign In'}
                            </button>
                        </div>


                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-[#E65555] hover:text-[#d14040]">
                                Register
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative w-1/2 bg-gray-900">
                <img
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=2727&auto=format&fit=crop"
                    alt="Ice Cream background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
                <div className="absolute bottom-0 left-0 p-16 text-white max-w-xl">
                    <h3 className="text-4xl font-bold mb-4">Try Our New Chocolate Almond Croissant!</h3>
                    <p className="text-lg text-gray-200">
                        Indulge in the perfect harmony of rich chocolate and toasted almonds. A treat you won't forget!
                    </p>
                    <Link to="/" className="mt-8 inline-flex items-center text-white font-medium hover:underline group">
                        Back to Home <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                </div>
                {/* Decorative Top Title similar to image */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full">
                    <span className="text-gray-900 font-bold tracking-widest uppercase text-sm">Morning Rise</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
