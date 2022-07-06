import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Tooltip} from "@mantine/core";
import {useState, useEffect, useContext} from "react";
import {ThemeContext} from "./theme_context";

export default function Footer() {
  const [theme, setTheme] = useContext(ThemeContext);

  const toggleTheme = function () {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";

    if (currentTheme === "light") {
      targetTheme = "dark";
    }

    setTheme(targetTheme);
  };

  return (
    <footer className="keep-color inverted">
      <div className="link-wrapper">
        <button
          id="theme-toggle"
          className="center tooltip"
          style={{cursor: "pointer"}}
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Tooltip withArrow label="Light Mode" className="block-dark">
              <FontAwesomeIcon
                icon={["fas", "sun"]}
                className="hover-opacity block-dark"
              />
            </Tooltip>
          ) : (
            <Tooltip withArrow label="Dark Mode" className="block-light">
              <FontAwesomeIcon
                icon={["fas", "moon"]}
                className="hover-opacity block-light"
              />
            </Tooltip>
          )}
        </button>
      </div>
      <div className="link-wrapper">
        <a
          title="YouTube"
          href="http://www.youtube.com/channel/UCbvyOKq8tS9_GaI9GDEkaZA"
        >
          <FontAwesomeIcon icon={["fab", "youtube"]} />
        </a>
        <a title="Steam" href="http://steamcommunity.com/id/peatral">
          <FontAwesomeIcon icon={["fab", "steam"]} />
        </a>
        <a title="Reddit" href="http://reddit.com/u/Peatral">
          <FontAwesomeIcon icon={["fab", "reddit"]} />
        </a>
        <a title="Twitter" href="https://twitter.com/TheRealPeatral">
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </a>
        <a title="Twitch" href="https://twitch.tv/Peatral">
          <FontAwesomeIcon icon={["fab", "twitch"]} />
        </a>
        <a title="Github" href="https://github.com/Peatral">
          <FontAwesomeIcon icon={["fab", "github"]} />
        </a>
      </div>

      <p style={{textAlign: "center"}}>©2020-2022 Christof Reimers</p>
    </footer>
  );
}
