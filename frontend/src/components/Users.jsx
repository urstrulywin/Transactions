import { useEffect, useState } from "react";
import React from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const loggedInUsername = localStorage.getItem("username");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/user/bulk?filter=${filter}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const filteredUsers = response.data.users.filter(
                    (user) => user.username !== loggedInUsername
                );
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounceTimer);
    }, [filter, loggedInUsername]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Send Money</h1>

            <div className="mb-6">
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search users..."
                    className="w-full sm:w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <div className="space-y-4">
                    {users.map((user) => (
                        <User key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition">
            <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-lg font-semibold text-green-700">
                    {user.firstname?.[0]?.toUpperCase()}
                </div>
                <div className="text-sm font-medium">
                    {user.firstname} {user.lastname}
                </div>
            </div>
            <Button
                onClick={() => navigate(`/send?id=${user._id}&name=${user.firstname}`)}
                label="Send Money"
            />
        </div>
    );
}
