import Link from "next/link";

import HeaderItem from "./header_item";

export default function HeaderLink({label, link, style, external}) {
  return (
    <HeaderItem style={style}>
      {
        external 
        ? <a href={link} className="button">
            {label}
          </a>
        : <Link href={link}>
          <a className="button">
            {label}
            </a>
        </Link>
      }
    </HeaderItem>
  );
}
