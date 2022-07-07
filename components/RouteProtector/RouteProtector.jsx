import React, {useContext} from "react";

import UnauthorizedPage from "./Unauthorized";
import {UserContext} from "@components/context/UserContext";
import {Loader} from "@components/Loader";
import DefaultLayout from "@layouts/Default";

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
      <>{children}</>
    );
  }

  return <>{children}</>;
}
