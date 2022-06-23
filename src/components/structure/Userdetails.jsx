import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faColumns,
  faPen,
  faSignOutAlt,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

import { Menu, Divider } from '@mantine/core';

import "./Userdetails.scss";

const Userdetails = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const navigate = useNavigate();

  const [opened, handlers] = useDisclosure(false);

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
      <div className="profile" onClick={() => handlers.toggle()}>
        
        <Menu withArrow placement="end" position="bottom" gutter={10} control={<img
          className="avatar"
          src={`https://cdn.discordapp.com/avatars/${userContext.details.id}/${userContext.details.avatar}`}
          alt="Avatar"
        />} opened={opened} onOpen={handlers.open} onClose={handlers.close}>
          <Menu.Label>{`${userContext.details.username}#${userContext.details.discriminator}`}</Menu.Label>
          <Menu.Item onClick={() => navigate(`/dashboard`)} icon={<FontAwesomeIcon icon={faColumns}/>}>Dashboard</Menu.Item>
          <Menu.Item onClick={() => navigate(`/guilds`)} icon={<FontAwesomeIcon icon={faServer}/>}>Guilds</Menu.Item>
          <Menu.Item onClick={() => navigate(`/polls`)} icon={<FontAwesomeIcon icon={faPen}/>}>Polls</Menu.Item>
          <Divider />
          <Menu.Item onClick={logoutHandler} icon={<FontAwesomeIcon icon={faSignOutAlt}/>} color="red">Logout</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Userdetails;
