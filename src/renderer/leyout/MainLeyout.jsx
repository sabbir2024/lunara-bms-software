import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "../pages/share/navbar/Navbar";
import { useEffect } from "react";
import useUsers from "../hooks/useUsers";

const MainLayout = () => {
    const navigate = useNavigate();
    const { users, isLoading } = useUsers();
    const Location = useLocation();

    const LocationPath = Location.pathname === '/'


    useEffect(() => {
        if (!isLoading && !users?.data) {
            navigate('/login', { replace: true });
        }
    }, [users, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-purple-800 min-h-screen">

            {
                LocationPath ? <></> : <div className="fixed w-full mx-auto">
                    <Navbar />
                </div>
            }

            <div className="pt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
