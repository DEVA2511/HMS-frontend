import SideBar from "../Components/Admin/Sidebar/SideBar";
import Header from "../Components/Header/Header";
import { Outlet } from "react-router-dom";

const AdminDashBoard = () => {
  return (
    <div className="flex">
      <SideBar />
      <div className="w-full overflow-hidden flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashBoard;
