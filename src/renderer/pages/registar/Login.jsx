import { useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState({
        userId: '',
        password: ''
    });
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();

    // লগইনের পর কোন রুটে যাবে, সেটার জন্য location.state ব্যবহার করা হবে
    const from = location.state?.from?.pathname || "/dashboard";

    const handleChange = (e) => {
        const { id, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            const { data } = await axiosSecure.post('/users/login', credentials);

            if (data.success) {
                toast.success('Welcome. have a Good luck!');
                localStorage.setItem("authToken", data.token);   // ✅ token save
                localStorage.setItem("user", JSON.stringify(data.data)); // optional user data
                // success হলে redirect
                navigate(from, { replace: true });
            } else if (data.success === false) {
                toast.error(`${data.message}`);
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-800 p-12 flex-col justify-between">
                <div className="max-w-md">
                    <div className="flex items-center mb-10">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">PharmaSys</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6">Streamline Your Pharmacy Management</h2>
                    <p className="text-indigo-200 text-lg">Access your dashboard to manage inventory, prescriptions, and customer data efficiently.</p>
                </div>

                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="w-2 h-2 rounded-full bg-white/30"></div>
                    ))}
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10 lg:hidden">
                        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Sign in to your account</p>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h1>
                        <p className="text-gray-500">Enter your credentials to access your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-0">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="userId">
                                    User ID
                                </label>
                                <div className="relative">
                                    <input
                                        id="userId"
                                        type="text"
                                        value={credentials.userId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition duration-200"
                                        placeholder="Enter your user ID"
                                        required
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition duration-200"
                                        placeholder="Enter your password"
                                        required
                                        disabled={isLoading}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
                                Forgot Password?
                            </a>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-white font-medium rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden group"
                            >
                                <span className="relative z-10">
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Logging in...
                                        </span>
                                    ) : 'Login to Dashboard'}
                                </span>
                                <span className="absolute inset-0 bg-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h3 className="text-sm font-medium text-indigo-800 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                            </svg>
                            Demo Credentials
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-white p-3 rounded-lg">
                                <div className="text-indigo-600 font-medium">User ID</div>
                                <div className="text-gray-700">admin</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg">
                                <div className="text-indigo-600 font-medium">Password</div>
                                <div className="text-gray-700">admin123</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>© 2023 PharmaSys • Pharmacy Management System</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;