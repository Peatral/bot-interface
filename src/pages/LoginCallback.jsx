import React, { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useSearchParams } from "react-router-dom";

import "./Page.scss";

const LoginCallback = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (searchParams.get("token")) {
      setUserContext((oldValues) => {
        return { ...oldValues, token: searchParams.get("token") };
      });
    }

    setRedirect(true);
  }, [setUserContext, searchParams]);

  return redirect ? (
    userContext.token ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <div className="main">
      <h1 className="display-middle">Loading...</h1>
    </div>
  );
};

export default LoginCallback;
