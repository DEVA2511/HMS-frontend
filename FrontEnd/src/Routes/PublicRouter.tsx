import { jwtDecode } from "jwt-decode";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { HMSJwtPayload } from "../Types/JwtPayload";

interface PublicRouterProps {
  children: React.ReactNode;
}

const PublicRouter: React.FC<PublicRouterProps> = ({ children }) => {
  const token = useSelector((state: any) => state.jwt);

  if (token) {
    const user = jwtDecode<HMSJwtPayload>(token);

    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default PublicRouter;
