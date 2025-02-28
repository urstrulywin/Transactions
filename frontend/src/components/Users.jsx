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

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError("");
            try {
                const token = localStorage.getItem("token"); // Retrieve the token from localStorage
                if (!token) {
                    throw new Error("No token found");
                }
        
                const response = await axios.get(
                    `http://localhost:3000/api/user/bulk?filter=${filter}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Include the token in the request headers
                        },
                    }
                );
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // Debounce the API call
        const debounceTimer = setTimeout(() => {
            fetchUsers();
        }, 300); // 300ms delay

        return () => clearTimeout(debounceTimer); // Cleanup on unmount or filter change
    }, [filter]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">Users</div>
            <div className="my-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                users.map((user) => <User key={user._id} user={user} />)
            )}
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstname ? user.firstname[0].toUpperCase() : ""}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-full">
                    <div>
                        {user.firstname} {user.lastname}
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <Button
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${user.firstname}`);
                    }}
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}