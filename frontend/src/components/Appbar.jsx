import { SignOut } from "./SignOut";

export const Appbar = () => {
  const username = localStorage.getItem("username") || "";
  const firstLetter = username.charAt(0).toUpperCase() || "?";

  return (
    <div className="shadow-md h-16 flex justify-between items-center px-6 bg-white">
      <div className="text-xl font-semibold text-gray-800">
        Transactify 💸
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-lg font-medium text-gray-700">
          Hello, <span className="text-blue-600">{username || "Guest"}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-semibold">
          {firstLetter}
        </div>
        <SignOut />
      </div>
    </div>
  );
};
