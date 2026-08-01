import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(null);

    function login(jwt) {
        localStorage.setItem("token", jwt);
        setToken(jwt);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        async function loadUser() {
            if (!token) return;

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error(error);
                logout();
            }
        }

        loadUser();
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}