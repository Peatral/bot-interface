import React, {useEffect, useContext, useState} from "react";
import {UserContext} from "@components/context/UserContext";
import {useRouter} from "next/router";

const Router = useRouter();

const LoginCallback = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  useEffect(() => {
    if (Router.query.token && userContext.token !== Router.query.token) {
      setUserContext((oldValues) => {
        return {...oldValues, token: Router.query.token};
      });
    }

    if (userContext.token) {
      Router.push({pathname: "/dashboard"});
    } else {
      Router.push({pathname: "/"});
    }
  }, [userContext]);

  return (
    <div className="main">
      <h1 className="page-display-middle">Loading...</h1>
    </div>
  );
};

export default LoginCallback;
