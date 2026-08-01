import Navbar from "./Navbar";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-6">
                {children}
            </main>
        </div>
    );
}