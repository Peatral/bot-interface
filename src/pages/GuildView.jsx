import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import Guild from "../components/generic/Guild";
import Button from "../components/generic/Button";
import Navbar from "../components/generic/Navbar";
import NavbarItem from "../components/generic/NavbarItem";
import Loader from "../components/generic/Loader";

import "./Page.scss";
import "./GuildView.scss";

const GuildView = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  let { guildId } = useParams();
  return (
    <>
      <Navbar>
        <NavbarItem>
          <Button link="/guilds">Go back</Button>
        </NavbarItem>
      </Navbar>
      <div className="main">
        <div className="display-middle">
          {userContext.guilds && Array.isArray(userContext.guilds) ? (
            <Guild
              guild={userContext.guilds.find((guild) => guild.id === guildId)}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};

export default GuildView;
