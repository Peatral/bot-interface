import React, { useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../context/UserContext";

const UserHandler = (props) => {
  const [userContext, setUserContext] = useContext(UserContext);

  /**
   * Silent Refresh
   */
  const silentRefresh = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}users/refreshToken`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(silentRefresh, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    silentRefresh();
  }, [silentRefresh]);

  /**
   * Sync logout across tabs
   */
  const syncLogout = useCallback((event) => {
    if (event.key === "logout") {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [syncLogout]);

  /**
   * Fetch user details if possible
   */
  const fetchUserDetails = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}users/me`, {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!userContext.details && userContext.token) {
      fetchUserDetails();
    }
  }, [userContext.details, fetchUserDetails]);

  return props.children;
};

export default UserHandler;
