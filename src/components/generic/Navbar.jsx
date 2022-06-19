import React from "react";
import "./Navbar.scss";

const Navbar = (props) => {
  return (
    <nav
      className={`navbar${props.className ? ` ${props.className}` : ""}`}
      style={props.style}
    >
      {props.children}
    </nav>
  );
};

export default Navbar;
