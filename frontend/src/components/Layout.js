import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 md:flex">
            {/* Sidebar */}
            <Navbar />

            {/* Content Area */}
            <main className="flex-1 p-4 md:p-6 pb-24 md:ml-64">
                {children}
            </main>
        </div>
    );
}