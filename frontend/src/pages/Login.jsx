import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../api/auth";
import { getCurrentUser } from "../api/users";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { login, setUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const data = await loginUser(
                username,
                password
            );

            login(data.access_token);

            const user = await getCurrentUser();
            setUser(user);

            navigate("/");
        } catch (error) {
            console.error(error);
            toast.error("Invalid username or password.");
        }
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mb-8 text-center text-gray-500">
                    Sign in to your Nexus account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}