import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Appbar } from '../components/Appbar';

export const Transfer = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransfer = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/account/transfer`,
        {
          to: id,
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.data.message === "Transfer successful") {
        setSuccess("Transfer successful!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError("Transfer failed. Please try again.");
      }
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err.response?.data?.message || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-6">
          <h2 className="text-3xl font-bold text-center">Send Money</h2>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold">
              {name?.[0]?.toUpperCase() || "?"}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700" htmlFor="amount">
              Amount (in Rs)
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              placeholder="Enter amount"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}

            <button
              onClick={handleTransfer}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 transition"
            >
              {loading ? "Processing..." : "Initiate Transfer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
