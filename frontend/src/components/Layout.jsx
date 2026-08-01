import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
                <Sidebar />

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}