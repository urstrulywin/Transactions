import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import { useBalance } from "../hooks/useBalance"; // Adjust path as needed


export const Dashboard = () => {
  const { balance, loading, error } = useBalance();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="m-8">
                <div className="m-8">
                    <Balance value={balance} />
                    <Users />
                </div>
            </div>
        </div>
    );
};