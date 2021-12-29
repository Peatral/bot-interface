import React from "react";
import "./NavbarItem.scss";

const NavbarItem = (props) => {
  return (
    <div className="navbar-item" style={props.style}>
      {props.children}
    </div>
  );
};

export default NavbarItem;
