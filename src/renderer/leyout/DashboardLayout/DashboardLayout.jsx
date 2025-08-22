import useUsers from '../../hooks/useUsers';


import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiPieChart,
    FiUsers,
    FiSettings,
    FiBell,
    FiSearch,
    FiMenu,
    FiChevronLeft,
    FiMessageSquare,
    FiShoppingCart
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Navbar from '../../pages/share/navbar/Navbar';

import ConfigEditor from '../../pages/share/ConfigEditor';
import { FaFolderOpen } from 'react-icons/fa';
import { MdCloudDone } from 'react-icons/md';
import { IoCloudOffline } from 'react-icons/io5';

const DashboardLayout = () => {
    const { users, isLoading } = useUsers();
    const navigate = useNavigate();
    // console.log('users', users, 'isLoading', isLoading);



    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const [config, setConfig] = useState([]);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/v1/config');
                const data = await res.json();
                setConfig(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        loadConfig();
    }, []);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    useEffect(() => {
        if (!isLoading && !users?.data) {
            navigate('/login', { replace: true });
        }
    }, [users, isLoading, navigate]);

    if (isLoading) {
        // লোডিং স্ক্রিন
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-gray-900 transition-all duration-300 lg:static ${sidebarCollapsed ? 'w-20' : 'w-64'
                }`}>
                <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
                    {!sidebarCollapsed && (
                        <h1 className="text-white text-xl font-bold">Luanara_bms</h1>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700"
                    >
                        {sidebarCollapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="mt-8">
                    <div className="px-4 space-y-2">
                        <NavItem
                            icon={<FiHome />}
                            text="Dashboard"
                            collapsed={sidebarCollapsed}
                            navigateLink='/dashboard'
                        />
                        <NavItem
                            icon={<FiPieChart />}
                            text="Analytics"
                            navigateLink='/dashboard/analytics'
                            collapsed={sidebarCollapsed}
                        />
                        <NavItem
                            icon={<FiUsers />}
                            text="Customer Due"
                            collapsed={sidebarCollapsed}
                            navigateLink='/dashboard/customer-due'
                        />
                        <NavItem
                            icon={<FiMessageSquare />}
                            text="Messages"
                            collapsed={sidebarCollapsed}
                            navigateLink='/dashboard/messages'
                        />
                        <NavItem
                            icon={<FiShoppingCart />}
                            text="Gatepass"
                            collapsed={sidebarCollapsed}
                            navigateLink='/dashboard/gate-pass'
                        />
                        <NavItem
                            icon={<FiSettings />}
                            text="Settings"
                            collapsed={sidebarCollapsed}
                            navigateLink='/dashboard/settings'
                        />
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="relative">

                            <Navbar />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    {
                                        config?.success
                                            ? <MdCloudDone size={24} className='text-blue-700 animate-pulse' title='Connect to Backend' />
                                            : <IoCloudOffline size={24} className='text-red-700 animate-pulse' title='Backend is offline' />
                                    }
                                </div>
                            </div>
                            <div
                                tabIndex={0}
                                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                                <div className="card-body">
                                    {
                                        config?.success
                                            ? <p className="text-sm">Location : {config.data.dataDirectory}</p>
                                            : <p className="text-sm">Backend Offline</p>
                                    }
                                    {
                                        config?.success && <ConfigEditor />
                                    }
                                </div>
                            </div>
                        </div>
                        <button className="relative p-2 text-gray-500 hover:text-gray-700">
                            <FiBell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">DS</span>
                                </div>
                                <span className="text-gray-700 uppercase">{users?.data?.role}</span>
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <button className="block w-full text-left px-4 py-2 text-sm font-bold uppercase text-gray-700 hover:bg-gray-100">
                                        {users?.data?.name}
                                    </button>
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Settings
                                    </button>
                                    <div className="flex gap-3">
                                        <div className="dropdown dropdown-left">
                                            <div tabIndex={32} role="button"> <FaFolderOpen title="Datebase location" /></div>
                                            <div
                                                tabIndex={32}
                                                className="dropdown-content card card-sm bg-base-100 z-1 w-64 shadow-md">
                                                <div className="card-body">
                                                    <ConfigEditor />
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem("authToken");
                                            localStorage.removeItem("user");
                                            navigate("/login", { replace: true });
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content with Outlet */}
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div >
        </div >
    );
};

const NavItem = ({ icon, text, collapsed = false, navigateLink }) => (
    <NavLink
        to={navigateLink}
        end
        className={({ isActive }) =>
            `flex items-center w-full px-4 py-3 rounded-lg transition-colors 
            ${isActive
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'} 
            ${collapsed ? 'justify-center' : ''}`
        }
    >
        <span className={collapsed ? '' : 'mr-3'}>{icon}</span>
        {!collapsed && <span className="font-medium">{text}</span>}
    </NavLink>
);



export default DashboardLayout;