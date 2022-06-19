import React from "react";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button = (props) => {
  return props.external ? (
    <a className="button" style={props.style} href={props.link}>
      {props.children}
    </a>
  ) : (
    <Link className="button" style={props.style} to={props.link}>
      {props.children}
    </Link>
  );
};

export default Button;
