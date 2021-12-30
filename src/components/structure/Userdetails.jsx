import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";

import "./Userdetails.scss";

const Userdetails = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [menu, setMenu] = useState(false);

  const logoutHandler = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}users/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });
      window.localStorage.setItem("logout", Date.now());
    });
  };

  return (
    <div className="action">
      <div className="profile" onClick={() => setMenu(!menu)}>
        <img
          className="avatar"
          src={`https://cdn.discordapp.com/avatars/${userContext.details.id}/${userContext.details.avatar}`}
          alt="Avatar"
        />
      </div>
      <div className={`menu${menu ? " active" : ""}`}>
        <h3>
          {userContext.details.username}#{userContext.details.discriminator}
        </h3>
        <ul>
          <li>
            <i className="fas fa-columns icon"></i>
            <Link to={`/dashboard`}>Dashboard</Link>
          </li>
          <li>
            <i className="fas fa-pen icon"></i>
            <Link to={`/proposals`}>Proposals</Link>
          </li>
          <li>
            <i className="fas fa-sign-out-alt icon"></i>
            <a onClick={logoutHandler}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Userdetails;
