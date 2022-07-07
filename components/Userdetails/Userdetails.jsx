import React, {useContext} from "react";
import {useRouter} from "next/router";
import {useDisclosure} from "@mantine/hooks";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {UserContext} from "@components/context/UserContext";
import {
  faColumns,
  faPen,
  faSignOutAlt,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

import {Menu, Divider} from "@mantine/core";

import styles from "./UserDetails.module.scss";

const UserDetails = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const Router = useRouter();

  const [opened, handlers] = useDisclosure(false);

  const logoutHandler = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return {...oldValues, details: null, token: null, guilds: null};
      });
      window.localStorage.setItem("logout", Date.now());
      Router.push("/");
    });
  };

  return (
    <div className={styles.action}>
      <div className={styles.profile} onClick={() => handlers.toggle()}>
        <Menu
          withArrow
          placement="end"
          position="bottom"
          gutter={10}
          control={
            <img
              className={styles.avatar}
              src={`https://cdn.discordapp.com/avatars/${userContext.details.id}/${userContext.details.avatar}`}
              alt="Avatar"
            />
          }
          opened={opened}
          onOpen={handlers.open}
          onClose={handlers.close}
        >
          <Menu.Label>{`${userContext.details.username}#${userContext.details.discriminator}`}</Menu.Label>
          <Menu.Item
            onClick={() => Router.push(`/dashboard`)}
            icon={<FontAwesomeIcon icon={faColumns} />}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            onClick={() => Router.push(`/guilds`)}
            icon={<FontAwesomeIcon icon={faServer} />}
          >
            Guilds
          </Menu.Item>
          <Menu.Item
            onClick={() => Router.push(`/polls`)}
            icon={<FontAwesomeIcon icon={faPen} />}
          >
            Polls
          </Menu.Item>
          <Divider />
          <Menu.Item
            onClick={logoutHandler}
            icon={<FontAwesomeIcon icon={faSignOutAlt} />}
            color="red"
          >
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default UserDetails;
