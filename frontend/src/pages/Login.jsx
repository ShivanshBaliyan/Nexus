import { useState } from "react";
import { useNavigate } from "react-router-dom";

import client from "../api/client";
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
            const formData = new URLSearchParams();

            formData.append("username", username);
            formData.append("password", password);

            const response = await client.post(
                "/auth/login",
                formData
            );

            // Save the JWT
            login(response.data.access_token);

            // Fetch the logged-in user's details
            const user = await getCurrentUser();
            setUser(user);

            // Redirect to the home page
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Invalid username or password.");
        }
    }

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}