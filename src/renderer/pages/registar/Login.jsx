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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-md">
                <section className="p-8 bg-white rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Please Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="userId">
                                    User ID
                                </label>
                                <input
                                    id="userId"
                                    type="text"
                                    value={credentials.userId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
                                    placeholder="Enter your user ID"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition duration-200"
                                    placeholder="Enter your password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                                Forgot Password?
                            </a>
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white font-semibold rounded-md transition duration-200"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>Demo Credentials:</p>
                        <p>User ID: admin | Password: admin123</p>
                    </div>
                </section>

                <div className="mt-6 text-center text-gray-600">
                    <p>© 2023 Pharmacy Management System. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
