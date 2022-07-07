import Link from "next/link";
import styles from "./Header.module.scss";

export function HeaderBar(props) {
  return (
    <header className={`${styles.header} keep-color inverted`}>
      <nav className={styles.navbar}>{props.children}</nav>
    </header>
  );
}

export function HeaderItem({style, children}) {
  return (
    <div className={styles.navbaritem} style={style}>
      {children}
    </div>
  );
}

export function HeaderLink({label, link, style, external}) {
  return (
    <HeaderItem style={style}>
      {external ? (
        <a href={link} className="button">
          {label}
        </a>
      ) : (
        <Link href={link}>
          <a className="button">{label}</a>
        </Link>
      )}
    </HeaderItem>
  );
}

export default {HeaderBar, HeaderItem, HeaderLink};
