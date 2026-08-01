import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await registerUser({
                username,
                email,
                password,
            });

            alert("Registration successful!");

            navigate("/login");
        } catch (error) {
            console.error(error);

            if (error.response?.data?.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Registration failed.");
            }
        }
    }

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <br />

                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}