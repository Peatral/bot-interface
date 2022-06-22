import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { useClickOutside } from '@mantine/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faColumns,
  faPen,
  faSignOutAlt,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

import "./Userdetails.scss";

const Userdetails = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [menu, setMenu] = useState(false);
  const ref = useClickOutside(() => setMenu(false));

  const logoutHandler = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: null, token: null, guilds: null };
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
      <div className={`menu${menu ? " active" : ""}`} ref={ref}>
        <h3>
          {userContext.details.username}#{userContext.details.discriminator}
        </h3>
        <ul>
          <li>
            <FontAwesomeIcon icon={faColumns} className="icon" />
            <Link to={`/dashboard`}>Dashboard</Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faServer} className="icon" />
            <Link to={`/guilds`}>Guilds</Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faPen} className="icon" />
            <Link to={`/polls`}>Polls</Link>
          </li>
          <li>
            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
            <a onClick={logoutHandler} href="/">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Userdetails;
