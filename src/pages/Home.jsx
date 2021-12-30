import React from "react";
import "./Page.scss";
import "./Home.scss";

const Home = () => {
  return (
    <div className="main">
      <h1 className="display-middle">
        You just woke GPD-Bot up if he was asleep...
      </h1>
      <div className="eye-holder">
        <img
          className="bot-eye"
          alt="Bot-Eye"
          src="https://cdn.discordapp.com/app-icons/521448354195177494/f47f5fce4caef35b05b5e60a561ab442.png"
        ></img>
      </div>
    </div>
  );
};

export default Home;
