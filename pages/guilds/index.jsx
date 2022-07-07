import React, {useContext} from "react";
import Link from "next/link";
import {UserContext} from "@components/context/UserContext";
import {Guild} from "@components/Guild";
import {Loader} from "@components/Loader";
import styles from "@styles/pages/Guilds.module.scss";

const Guilds = () => {
  const [userContext] = useContext(UserContext);

  return (
    <div className="main">
      {userContext.guilds && Array.isArray(userContext.guilds) ? (
        <div className={styles.guilds}>
          <p className={styles.toptext}>You are in the following guilds:</p>
          <ul className={styles.guildholder}>
            {userContext.guilds.map((guild, index) => {
              return (
                <li className={styles.guildentry} key={guild.id}>
                  <Link href={`/guilds/${guild.id}`}>
                    <a>
                      <Guild guild={guild} />
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="page-display-middle">
          <Loader />
        </div>
      )}
    </div>
  );
};

export async function getStaticProps(context) {
  return {
    props: {
      protected: true,
    },
  };
}

export default Guilds;
