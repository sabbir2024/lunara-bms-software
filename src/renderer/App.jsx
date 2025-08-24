import { useNavigate } from "react-router"

function App() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            {/* Background Elements */}

            {/* Main Content */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20">
                {/* Welcome Text */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in-down">Welcome</h1>
                    <p className="text-white/80">We're glad to have you here</p>
                </div>

                {/* Navigation Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

export default App