import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                }}
            />

            <App />
        </AuthProvider>
    </StrictMode>
);