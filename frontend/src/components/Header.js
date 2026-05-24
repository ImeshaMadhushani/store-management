import { Building2, UserCircle } from "lucide-react";

export default function Header() {
    const today = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="w-full bg-white border-b shadow-sm px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">

            {/* Left Section */}
            <div className="flex items-center gap-3">

                {/* Icon / Logo */}
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                    <Building2 size={22} />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-lg md:text-xl font-semibold text-gray-800 leading-tight">
                        Divisional Secretariat
                    </h1>
                    <p className="text-sm text-gray-500">
                        Stores Management System
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

                {/* Date */}
                <div className="text-sm text-gray-600 text-right">
                    <p className="font-medium">{today}</p>
                    <p className="text-xs text-gray-400">System Date</p>
                </div>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                {/* User */}
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <UserCircle size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-700">
                        Admin Officer
                    </span>
                </div>
            </div>
        </div>
    );
}