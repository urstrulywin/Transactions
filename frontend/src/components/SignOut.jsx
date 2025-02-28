import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignOut = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const logout = async () => {
        setLoading(true);
        setError("");

        try {// Remove token from localStorage
            localStorage.removeItem("token");
            // Redirect to sign-in page
            navigate(`/signin` || "/signin");
        } catch (error) {
            console.error("Logout error:", error);
            setError("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={logout}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-400"
            >
                {loading ? "Signing Out..." : "Sign Out"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
};