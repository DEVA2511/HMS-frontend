import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouterProps {
  children: React.ReactNode;
}

const ProtectedRouter: React.FC<ProtectedRouterProps> = ({ children }) => {
  const token = useSelector((state: any) => state.jwt);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRouter;
