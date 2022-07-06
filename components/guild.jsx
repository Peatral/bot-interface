import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faImage} from "@fortawesome/free-solid-svg-icons";

import {Tooltip} from "@mantine/core";

import styles from "../styles/Guild.module.scss";

const Guild = (props) => {
  const guild = props.guild;
  return guild ? (
    <div className={styles.guild}>
      {guild.icon !== null && guild.icon ? (
        <img
          className={styles.icon}
          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`}
          alt="Server Icon"
        />
      ) : (
        <Tooltip label="No Server Icon" withArrow>
          <FontAwesomeIcon icon={faImage} size="2x" className={styles.noicon} />
        </Tooltip>
      )}
      <p className={styles.name}>{guild.name}</p>
      {guild.owner && (
        <Tooltip label="Server Owner" withArrow>
          <FontAwesomeIcon icon={faCrown} className={styles.crown} />
        </Tooltip>
      )}
    </div>
  ) : (
    <div>Invalid Guild</div>
  );
};

export default Guild;
