import React from "react";
import "./Navbar.scss";

const Navbar = (props) => {
  return (
    <nav className="navbar" style={props.style}>
      {props.children}
    </nav>
  );
};

export default Navbar;
