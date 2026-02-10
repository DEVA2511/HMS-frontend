import { Avatar, Text } from "@mantine/core";
import {
  IconCalendarCheck,
  IconHeartbeat,
  IconLayoutGrid,
  IconMoodHeart,
  IconStethoscope,
  IconUser,
  IconVaccine,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";

import { NavLink } from "react-router-dom";
import { getMediaUrl } from "../../../Service/MediaService";
const links = [
  {
    name: "Dashboard",
    url: "/doctor/dashboard",
    icon: <IconLayoutGrid stroke={1.3} />,
  },
  {
    name: "Profile",
    url: "/doctor/profile",
    icon: <IconUser stroke={1.3} />,
  },
  {
    name: "Patients",
    url: "/doctor/patient",
    icon: <IconMoodHeart stroke={1.3} />,
  },
  {
    name: "Appointments",
    url: "/doctor/appointments",
    icon: <IconCalendarCheck stroke={1.3} />,
  },
  {
    name: "Pharmacy",
    url: "/doctor/pharmacy",
    icon: <IconVaccine stroke={1.3} />,
  },
  {
    name: "Departments",
    url: "/doctor/department",
    icon: <IconLayoutGrid stroke={1.3} />,
  },
];

const SideBar = () => {
  const user = useSelector((state: any) => state.user);
  return (
    <div className="flex">
      <div className="w-64"></div>

      <div className="bg-dark fixed w-64 flex flex-col hide-scrollbar items-center h-screen gap-7  items-center overflow-y-auto">
        <div className="text-primary-400 bg-dark flex gap-1 items-center fixed z-[500] py-3">
          <IconHeartbeat size={40} stroke={2.5} />
          <span className="font-heading font-semibold text-3xl">Pulse</span>
        </div>
        <div className="flex flex-col gap-5 mt-20 items-center ">
          <div className="flex flex-col gap-2 items-center">
            <div className="p-1 bg-white rounded-full shadow-xl">
              <Avatar
                variant="filled"
                size="xl"
                src={getMediaUrl(user.profilePictureId)}
                alt="User profile"
              >
                {user.name?.[0]}
              </Avatar>
            </div>

            <span className="font-medium text-light">{user.name}</span>
            <Text size="sm" c="dimmed" className="text-light">
              {user.role}
            </Text>
          </div>
          <div className="flex flex-col gap-4 ">
            {links.map((link) => {
              return (
                <NavLink
                  to={link.url}
                  key={link.name}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-primary-400  w-full flex  items-center gap-3 px-4 py-2 rounded-lg shadow-md"
                      : "text-light  hover:bg-primary-400 w-full  flex items-center gap-3 px-4 py-2 rounded-lg"
                  }
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
