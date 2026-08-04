import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate("/auth/login");
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600"
                >
                    Nexus
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        Home
                    </Link>

                    <Link
                        to="/search"
                        className="text-gray-700 hover:text-blue-600"
                    >
                        Search
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/create-post"
                                className="rounded-lg text-white bg-blue-600 px-4 py-2 transition hover:bg-blue-700"
                            >
                                Create Post
                            </Link>

                            <Link
                                to="/create-community"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Create Community
                            </Link>

                            <Link
                                to={`/users/${user?.username}`}
                                className="font-medium text-gray-700 hover:text-blue-600"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="rounded-lg border border-red-500 px-4 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}