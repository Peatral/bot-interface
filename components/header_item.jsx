import Link from "next/link";

import styles from "../styles/Header.module.scss";

export default function HeaderItem({style, children}) {
  return (
    <div className={styles.navbaritem} style={style}>
      {children}
    </div>
  );
}
