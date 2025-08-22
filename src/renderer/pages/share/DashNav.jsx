import { useEffect, useState } from "react";
import { IoMdList } from "react-icons/io";
import ConfigEditor from "../dashboard/configEditor/ConfigEditor ";
import { FaBackward, FaForward } from "react-icons/fa";
import { useNavigate } from "react-router";

const DashNav = () => {
    const [config, setConfig] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/config');
                const data = await res.json();
                setConfig(data);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        loadConfig();
    }, []);
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <label htmlFor="my-drawer" className="btn btn-primary drawer-button"><IoMdList /></label>
            </div>
            <div className="flex-1 space-x-2">

                <button onClick={() => navigate(-1)} className="btn btn-outline"><FaBackward /></button>
                <button onClick={() => navigate(+1)} className="btn btn-outline">< FaForward /></button>
            </div >
            <div>
                <div className=" flex gap-2 breadcrumbs text-sm">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                    </svg>
                    {
                        config?.success
                            ? <p>{config.data.dataDirectory}</p>
                            : <p>Backend Offline</p>
                    }

                </div>
            </div>

            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> </svg>
                            <span className="badge badge-sm indicator-item">8</span>
                        </div>
                    </div>
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                        <div className="card-body">
                            <span className="text-lg font-bold">8 Items</span>
                            <span className="text-info">Subtotal: $999</span>
                            <div className="card-actions">
                                <button className="btn btn-primary btn-block">View cart</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <ConfigEditor />
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashNav;