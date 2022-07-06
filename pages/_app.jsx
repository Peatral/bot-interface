

import "../styles/globals.scss";
import "../styles/peat.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";

import DefaultLayout from "../components/layouts/default";

import * as Brands from "@fortawesome/free-brands-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";
import * as SolidIcons from "@fortawesome/free-solid-svg-icons";

library.add(Brands.faGithub);
library.add(Brands.faYoutube);
library.add(Brands.faSteam);
library.add(Brands.faReddit);
library.add(Brands.faTwitter);
library.add(Brands.faTwitch);
library.add(SolidIcons.faSun);
library.add(SolidIcons.faMoon);

import CustomHead from "../components/head";
import { ThemeProvider } from "../components/theme_context";
import {UserProvider} from "../components/user_context";
import RouteProtector from "../components/route_protector";

export default function MyApp({Component, pageProps}) {
  const defaultPageLayout = function (page) {
    return <DefaultLayout>{page}</DefaultLayout>;
  };

  // Use the specified page layout or fallback to the default one.
  const getLayout = Component.getLayout ?? defaultPageLayout;

  return (
    <>
      <CustomHead />
      <UserProvider>
        <ThemeProvider>
          <RouteProtector pageProps={pageProps}>
            {getLayout(<Component {...pageProps}/>)}
          </RouteProtector>
        </ThemeProvider>
      </UserProvider>
    </>
  );
}