import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

import "./Header.scss";

import Button from "../generic/Button";
import Navbar from "../generic/Navbar";
import NavbarItem from "../generic/NavbarItem";
import Loader from "../generic/Loader";

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
          {userContext.details === null ? (
            <Button
              link={`${process.env.REACT_APP_BACKEND_URL}users/auth/discord`}
              external={true}
            >
              Login
            </Button>
          ) : !userContext.details ? (
            <div className="loader-wrapper">
              <Loader />
            </div>
          ) : (
            <Userdetails />
          )}
        </NavbarItem>
      </Navbar>
    </header>
  );
};

export default Header;
