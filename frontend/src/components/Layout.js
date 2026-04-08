import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />

            {/* Content Area */}
            <main className="flex-1 p-4 md:p-6 pb-24">
                {children}
            </main>
        </div>
    );
}