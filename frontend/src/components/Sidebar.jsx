import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const { user, isAuthenticated } = useAuth();

    return (
        <aside className="w-64 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">
                Navigation
            </h2>

            <nav className="flex flex-col gap-2">
                <Link
                    to="/"
                    className="rounded-lg px-3 py-2 hover:bg-gray-100"
                >
                    🏠 Home
                </Link>

                <Link
                    to="/search"
                    className="rounded-lg px-3 py-2 hover:bg-gray-100"
                >
                    🔍 Search
                </Link>

                {isAuthenticated && (
                    <>
                        <Link
                            to="/create-post"
                            className="rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                            ➕ Create Post
                        </Link>

                        <Link
                            to="/create-community"
                            className="rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                            👥 Create Community
                        </Link>

                        <Link
                            to={`/users/${user?.username}`}
                            className="rounded-lg px-3 py-2 hover:bg-gray-100"
                        >
                            👤 Profile
                        </Link>
                    </>
                )}
            </nav>
        </aside>
    );
}