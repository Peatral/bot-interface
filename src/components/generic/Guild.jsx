import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faImage } from "@fortawesome/free-solid-svg-icons";

import Tooltip from "./Tooltip";

import "./Guild.scss";

const Guild = (props) => {
  const guild = props.guild;
  return guild ? (
    <div className="guild">
      {guild.icon !== null && guild.icon ? (
        <img
          className="icon"
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
          alt="Server Icon"
        />
      ) : (
        <Tooltip tooltiptext="No Server Icon">
          <FontAwesomeIcon icon={faImage} size="2x" className="noicon" />
        </Tooltip>
      )}
      <p className="name">{guild.name}</p>
      {guild.owner && (
        <Tooltip tooltiptext="Server Owner">
          <FontAwesomeIcon icon={faCrown} className="crown" />
        </Tooltip>
      )}
    </div>
  ) : (
    <div>Invalid Guild</div>
  );
};

export default Guild;
