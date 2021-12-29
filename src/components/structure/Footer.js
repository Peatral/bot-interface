import React from "react";
import "./Footer.scss";

import Tooltip from "../generic/Tooltip";

const Footer = () => {
  return (
    <footer className="footer">
      <Tooltip tooltiptext="Homepage">
        <a className="footer-link" href="https://peatral.xyz">
          ©2020-2021 Christof Reimers
        </a>
      </Tooltip>
    </footer>
  );
};

export default Footer;
