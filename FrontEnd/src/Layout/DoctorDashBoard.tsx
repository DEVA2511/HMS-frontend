import SideBar from "../Components/Doctor/Sidebar/SideBar";
import Header from "../Components/Header/Header";
import { Outlet } from "react-router-dom";

const DoctorDashBoard = () => {
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

export default DoctorDashBoard;
