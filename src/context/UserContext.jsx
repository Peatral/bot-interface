import React, { useState, useEffect, useCallback } from "react";

import { showNotification } from '@mantine/notifications';

const UserContext = React.createContext([{}, () => {}]);

let initialState = {
  token: undefined,
  details: undefined,
  guilds: undefined,
};

const UserProvider = (props) => {
  const [state, setState] = useState(initialState);

  const fetchDetailsFail = () => {
    showNotification({
      id: "details-fail",
      color: "red",
      title: "Could not load user details...",
      message: "This happens sometimes, try refreshing the page",
      autoClose: 3000,
    });
    // TODO: catch no user details loading
    setState((oldValues) => {
      return { ...oldValues, details: null };
    });
  }

  const fetchGuildsFail = () => {
    showNotification({
      id: "guilds-fail",
      color: "red",
      title: "Could not load guilds...",
      message: "This happens sometimes, try refreshing the page",
      autoClose: 3000,
    });
    // TODO: catch no guilds loading
    setState((oldValues) => {
      return { ...oldValues, guilds: null };
    });
  }

  /**
   * Silent Refresh
   */
  const silentRefresh = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/refreshToken`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        setState((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setState((oldValues) => {
          return { ...oldValues, token: null, details: null, guilds: null };
        });
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(silentRefresh, 5 * 60 * 1000);
    }).catch(err => {
      setState((oldValues) => {
        return { ...oldValues, token: null, details: null, guilds: null };
      });
    });
  }, [setState]);

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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me`, {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    }).then(async (response) => {
      let data = null
      
      if (response.ok) {
        data = await response.json();
      } else {
        return fetchDetailsFail();
      }

      // for some reason it may be that the data is NOT the user details
      if (!data.id) {
        return fetchDetailsFail();
      }

      setState((oldValues) => {
        return { ...oldValues, details: data };
      });
    }).catch(err => {
      fetchDetailsFail();
    });
  }, [setState, state.token]);

  useEffect(() => {
    // fetch only when user details are not present
    if (!state.details && state.token) {
      fetchUserDetails();
    }
  }, [state.details, fetchUserDetails, state.token]);

  /**
   * Fetch guilds once token is ready
   */
  const fetchGuilds = useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/me/guilds`, {
      method: "GET",
      credentials: "include",
      // Pass authentication token as bearer token in header
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();

        // TODO: rate limiting why the f i dunno
        if (!Array.isArray(data)) {
          return fetchGuildsFail();
        }

        setState((oldValues) => {
          return { ...oldValues, guilds: data };
        });
      } else {
        fetchGuildsFail();
      }
    }).catch(err => {
      fetchGuildsFail();
    });
  }, [setState, state.token]);

  
  useEffect(() => {
    // fetch only when guilds are not present
    if (!state.guilds && state.token) {
      fetchGuilds();
    }
  }, [state.guilds, fetchGuilds, state.token]);
  
  return (
    <UserContext.Provider value={[state, setState]}>
      {props.children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
