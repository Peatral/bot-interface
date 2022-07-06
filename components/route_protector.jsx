import React, { useContext } from "react";

import UnauthorizedPage from "./unauthorized";
import {UserContext} from "../components/user_context";
import Loader from "../components/loader";
import DefaultLayout from "./layouts/default";

export default function RouteProtector({children, pageProps}) {
  const [userContext] = useContext(UserContext);

  if (pageProps.protected) {
    return userContext.token === null ? (
      <DefaultLayout>
        <UnauthorizedPage />
      </DefaultLayout>
    ) : !userContext.token ? (
      <DefaultLayout>
        <div className="main">
          <div className="page-display-middle">
            <Loader />
          </div>
        </div>
      </DefaultLayout>
    ) : (
      <>
        { children }
      </>
    );
  }

  return(
    <>
      { children }
    </>
  )
}