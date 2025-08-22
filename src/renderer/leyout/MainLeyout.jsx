import { Outlet, useNavigate } from "react-router";
import Navbar from "../pages/share/navbar/Navbar";
import { useEffect } from "react";
import useUsers from "../hooks/useUsers";

const MainLayout = () => {
    const navigate = useNavigate();
    const { users, isLoading } = useUsers();


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
        <div>
            <div className="fixed w-full mx-auto">
                <Navbar />
            </div>
            <div className="pt-4">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
