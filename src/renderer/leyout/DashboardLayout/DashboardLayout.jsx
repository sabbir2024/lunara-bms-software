import useUsers from '../../hooks/useUsers';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
    FiHome, FiPieChart, FiUsers, FiSettings, FiBell, FiMenu, FiChevronLeft, FiMessageSquare, FiShoppingCart
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import Navbar from '../../pages/share/navbar/Navbar';
import { MdCloudDone } from 'react-icons/md';
import { IoCloudOffline } from 'react-icons/io5';

const DashboardLayout = () => {
    const { users, isLoading } = useUsers();
    const navigate = useNavigate();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [config, setConfig] = useState([]);
    const [openCategory, setOpenCategory] = useState(null);

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

    // Add keyboard shortcut for open (Ctrl+o)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
                event.preventDefault();
                // Use browser's default print dialog instead of our custom function
                // window.print();
                // console.log('window', window);

            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
    const toggleCategory = (category) => setOpenCategory(openCategory === category ? null : category);

    useEffect(() => {
        if (!isLoading && !users?.data) navigate('/login', { replace: true });
    }, [users, isLoading, navigate]);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
            <span className="loading loading-infinity loading-xl text-white"></span>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar - Now white */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
                    {!sidebarCollapsed && <h1 className="text-indigo-700 text-xl font-bold">Luanara_bms</h1>}
                    <button onClick={toggleSidebar} className="text-gray-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-gray-100">
                        {sidebarCollapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
                    </button>
                </div>

                {/* Top scrollable categories */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                    {/* Dashboard */}
                    <SidebarCategory
                        icon={<FiHome className="text-gray-600" />}
                        title="Dashboard"
                        collapsed={sidebarCollapsed}
                        openCategory={openCategory}
                        setOpenCategory={toggleCategory}
                        categoryKey="dashboard"
                        links={[
                            { icon: <FiHome className="text-gray-600" />, text: 'Overview', to: '/dashboard' },
                            { icon: <FiPieChart className="text-gray-600" />, text: 'Analytics', to: '/dashboard/analytics' }
                        ]}
                    />
                    {/* Customers */}
                    <SidebarCategory
                        icon={<FiUsers className="text-gray-600" />}
                        title="Customers"
                        collapsed={sidebarCollapsed}
                        openCategory={openCategory}
                        setOpenCategory={toggleCategory}
                        categoryKey="customers"
                        links={[
                            { icon: <FiUsers className="text-gray-600" />, text: 'Customer Due', to: '/dashboard/customer-due' },
                            { icon: <FiMessageSquare className="text-gray-600" />, text: 'Messages', to: '/dashboard/messages' }
                        ]}
                    />
                    {/* Operations */}
                    <SidebarCategory
                        icon={<FiShoppingCart className="text-gray-600" />}
                        title="Operations"
                        collapsed={sidebarCollapsed}
                        openCategory={openCategory}
                        setOpenCategory={toggleCategory}
                        categoryKey="operations"
                        links={[
                            { icon: <FiShoppingCart className="text-gray-600" />, text: 'Gatepass', to: '/dashboard/gate-pass' }
                        ]}
                    />
                </div>

                {/* Settings pinned at bottom */}
                <div className="px-4 py-3 border-t border-gray-200">
                    <NavItem icon={<FiSettings className="text-gray-600" />} text="Settings" navigateLink='/dashboard/settings' collapsed={sidebarCollapsed} />
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-200 shadow-sm">
                    <Navbar />
                    <div className="flex items-center space-x-4">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    {config?.success ? <MdCloudDone size={24} className='text-green-600' title='Connect to Backend' /> : <IoCloudOffline size={24} className='text-red-600' title='Backend is offline' />}
                                </div>
                            </div>
                            <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                                <div className="card-body">
                                    {config?.success ? <p className="text-sm">Location : {config.data.dataDirectory}</p> : <p className="text-sm">Backend Offline</p>}
                                </div>
                            </div>
                        </div>
                        <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                            <FiBell size={24} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        {/* User Menu */}
                    </div>
                </header>

                <main className="flex-1 overflow-auto  bg-gradient-to-br from-indigo-50 to-purple-50">

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// Sidebar Category component
const SidebarCategory = ({ icon, title, collapsed, openCategory, setOpenCategory, categoryKey, links }) => (
    <div className="collapse collapse-arrow text-gray-700">
        <input type="radio" name="sidebar-accordion" checked={openCategory === categoryKey} onChange={() => setOpenCategory(categoryKey)} />
        <div className="collapse-title font-medium flex items-center">
            {icon}
            {!collapsed && <span className="ml-3">{title}</span>}
        </div>
        {!collapsed && (
            <div className="collapse-content pl-4">
                {links.map((link, idx) => <NavItem key={idx} icon={link.icon} text={link.text} navigateLink={link.to} collapsed={collapsed} />)}
            </div>
        )}
    </div>
);

// NavItem
const NavItem = ({ icon, text, collapsed = false, navigateLink }) => (
    <NavLink to={navigateLink} end className={({ isActive }) =>
        `flex items-center w-full px-4 py-3 rounded-lg transition-colors
        ${isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'}
        ${collapsed ? 'justify-center' : ''}`
    }>
        <span className={collapsed ? '' : 'mr-3'}>{icon}</span>
        {!collapsed && <span className="font-medium">{text}</span>}
    </NavLink>
);

export default DashboardLayout;