import { useEffect, useState } from "react";
import axios from "axios";

export const useBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/account/balance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (isMounted) {
          console.log("Backend Response:", response.data);
          setBalance(response.data.balance);
        }
      } catch (err) {
        console.error("Error fetching balance:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else if (isMounted) {
          setError("Failed to fetch balance. Please try again later.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchBalance, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return { balance, loading, error };
};
