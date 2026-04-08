import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaChartBar, FaClipboardList, FaWarehouse } from "react-icons/fa";

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
        { path: "/stock", label: "Stock", icon: <FaWarehouse /> },
        { path: "/issue", label: "Issue", icon: <FaClipboardList /> },
        { path: "/items", label: "Items", icon: <FaBox /> },
        { path: "/reports", label: "Reports", icon: <FaChartBar /> },
        
        
    ];

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden md:flex bg-gray-900 text-white p-4 justify-between items-center shadow-lg">
                <h1 className="text-xl font-bold">Admin Panel</h1>

                <div className="flex gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 hover:text-blue-400 transition ${location.pathname === item.path ? "text-blue-400 font-semibold" : ""
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Bottom Navbar */}
            <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center p-2 md:hidden shadow-lg">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center text-xs ${location.pathname === item.path ? "text-blue-400" : ""
                            }`}
                    >
                        <div className="text-lg">{item.icon}</div>
                        {item.label}
                    </Link>
                ))}
            </div>
        </>
    );
}