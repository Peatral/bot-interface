import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Guild from "../components/generic/Guild";
import Loader from "../components/generic/Loader";
import { Link } from "react-router-dom";
import "./Page.scss";
import "./Guilds.scss";

const Guilds = () => {
  const [userContext] = useContext(UserContext);

  return (
    <div className="main">
      {userContext.guilds && Array.isArray(userContext.guilds) ? (
        <div className="guilds">
          <p className="toptext">You are in the following guilds:</p>
          <ul className="guildholder">
            {userContext.guilds.map((guild, index) => {
              return (
                <li className="guildentry" key={guild.id}>
                  <Link to={`/guilds/${guild.id}`}>
                    <Guild guild={guild} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="display-middle">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Guilds;
