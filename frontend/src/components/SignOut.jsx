import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignOut = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logout = async () => {
    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      setError("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={logout}
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium disabled:bg-gray-400 transition"
      >
        {loading ? "Signing Out..." : "Sign Out"}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-1 max-w-xs">{error}</p>
      )}
    </div>
  );
};
