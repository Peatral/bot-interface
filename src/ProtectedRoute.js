import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const ProtectedRoute = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  return userContext.token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
