import React, { useState, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { SignOut } from "../components/SignOut";
import axios from "axios";

export const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await axios.get("/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Backend Response:", response.data); // Debugging line
                setBalance((response.data.balance)); // Convert to number
            } catch (error) {
                console.error("Error fetching balance:", error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("token"); // Clear the invalid token
                    window.location.href = "/login"; // Redirect to login page
                } else {
                    setError("Failed to fetch balance. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        // Fetch balance after a short delay (e.g., 500ms)
        const timer = setTimeout(fetchBalance, 500);

        // Cleanup function to clear the timeout
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div>
            <Appbar />
            <div className="m-8">
                <div className="m-8">
                    <Balance value={balance} />
                    <Users />
                </div>
                <div className="m-8">
                    <SignOut />
                </div>
            </div>
        </div>
    );
};