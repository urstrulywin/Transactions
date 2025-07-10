import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center w-80">
        <h1 className="text-2xl font-bold mb-4">Welcome to Transactify 💸</h1>
        <p className="text-gray-600 mb-6">Manage your transactions with ease</p>
        <div className="flex flex-col gap-4">
          <Link
            to="/signup"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            className="bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
