import React, {useEffect, useContext, useState} from "react";
import {UserContext} from "../components/user_context";
import {useRouter} from "next/router";

const LoginCallback = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const Router = useRouter();

  useEffect(() => {
    console.log(Router.query.token);
    if (Router.query.token) {
      setUserContext((oldValues) => {
        return {...oldValues, token: Router.query.token};
      });
    }

    if (userContext.token) {
      Router.push({pathname: "/dashboard"});
    } else {
      Router.push({pathname: "/"});
    }
  }, [setUserContext, Router, userContext]);

  return (
    <div className="main">
      <h1 className="page-display-middle">Loading...</h1>
    </div>
  );
};

export default LoginCallback;
