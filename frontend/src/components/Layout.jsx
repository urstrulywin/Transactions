import { Outlet } from "react-router-dom";
import { Appbar } from "../components/Appbar";

export const Layout = () => {
  return (
    <div>
      <Appbar />
      <Outlet /> {/* This renders the matched child route */}
    </div>
  );
};
