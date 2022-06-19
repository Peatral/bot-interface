import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import "./Page.scss";

import Loader from "../components/generic/Loader";

const ProtectedRoute = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  return userContext.token === null ? (
    <Navigate to="/" />
  ) : !userContext.token ? (
    <div className="main">
      <div className="display-middle">
        <Loader />
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

export default ProtectedRoute;
