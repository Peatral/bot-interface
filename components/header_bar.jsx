import styles from "../styles/Header.module.scss";

export default function HeaderBar(props) {
  return (
    <header className={`${styles.header} keep-color inverted`}>
      <nav className={styles.navbar}>{props.children}</nav>
    </header>
  );
}
