import React from "react";
import styles from "@styles/pages/Home.module.scss";

const Home = () => {
  return (
    <div className="main">
      <div className="page-display-middle">
        <h1>You just woke GPD-Bot up if he was asleep...</h1>
        <p>Actually not, he will never be sleepy again</p>
      </div>
      <div className={styles.eyeholder}>
        <img
          className={styles.boteye}
          alt="Bot-Eye"
          src="https://cdn.discordapp.com/app-icons/521448354195177494/f47f5fce4caef35b05b5e60a561ab442.png"
        ></img>
      </div>
    </div>
  );
};

export default Home;
