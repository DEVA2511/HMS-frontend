import ProfileMenu from "./ProfileMenu";
import { ActionIcon, Button } from "@mantine/core";
import {
  IconBellRinging,
  IconLayoutSidebarLeftCollapseFilled,
} from "@tabler/icons-react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeJwt } from "../../Slice/JwtSlice";
import { removeUser } from "../../Slice/UserSlice";

const Header = () => {
  const dispatch = useDispatch();
  const jwt = useSelector((state: any) => state.jwt);
  // useEffect(() => {
  //   console.log(user);
  // }, []);
  const handleLogoutButton = () => {
    console.log("Logout");
    dispatch(removeJwt());
    dispatch(removeUser());
  };
  return (
    <div className="bg-light shadow-lg  w-full h-16 flex justify-between items-center px-5 cursor-pointer">
      <ActionIcon aria-label="Settings" variant="transparent" size="lg">
        <IconLayoutSidebarLeftCollapseFilled
          style={{ width: "90%", height: "90%" }}
          stroke={1.5}
        />
      </ActionIcon>
      <div className="flex gap-5 items-center">
        {jwt ? (
          <Button onClick={handleLogoutButton} color="red">
            Logout
          </Button>
        ) : (
          <Link to="/login">
            {" "}
            <Button>Login</Button>
          </Link>
        )}
        {jwt && (
          <>
            <ActionIcon aria-label="Settings" variant="transparent" size="md">
              <IconBellRinging
                style={{ width: "90%", height: "90%" }}
                stroke={1.5}
              />
            </ActionIcon>
            <ProfileMenu />
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
