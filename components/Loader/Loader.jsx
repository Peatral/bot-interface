import React from "react";
import styles from "./Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderdiv}></div>
      <div className={styles.loaderdiv}></div>
      <div className={styles.loaderdiv}></div>
    </div>
  );
};

export default Loader;
