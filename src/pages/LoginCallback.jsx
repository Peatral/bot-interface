import React, { useEffect, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useSearchParams } from "react-router-dom";

import "./Page.scss";

const LoginCallback = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("token")) {
      setUserContext((oldValues) => {
        return { ...oldValues, token: searchParams.get("token") };
      });
    }
  }, []);

  return userContext.token ? <Navigate to="/dashboard" /> : <Navigate to="/" />;
};

export default LoginCallback;
