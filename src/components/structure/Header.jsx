import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

import "./Header.scss";

import Button from "../generic/Button";
import Navbar from "../generic/Navbar";
import NavbarItem from "../generic/NavbarItem";

import Userdetails from "./Userdetails";

const Header = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  return (
    <header className="header">
      <Navbar>
        <NavbarItem>
          <Button link={`/`}>Home</Button>
        </NavbarItem>
        <NavbarItem style={{ marginLeft: "auto" }}>
          {userContext.details === null || !userContext.details ? (
            <Button
              link={`${process.env.REACT_APP_BACKEND_URL}users/auth/discord`}
              external={true}
            >
              Login
            </Button>
          ) : (
            <Userdetails />
          )}
        </NavbarItem>
      </Navbar>
    </header>
  );
};

export default Header;
