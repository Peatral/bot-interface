import React from "react";
import "./Footer.scss";

import { Tooltip } from "@mantine/core";

const Footer = () => {
  return (
    <footer className="footer">
      <Tooltip withArrow label="Homepage">
        <a className="footer-link" href="https://peatral.xyz">
          ©2020-2022 Christof Reimers
        </a>
      </Tooltip>
    </footer>
  );
};

export default Footer;
