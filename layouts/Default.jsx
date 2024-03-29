import {useContext} from "react";
import {MantineProvider, AppShell} from "@mantine/core";
import {HeaderBar, HeaderItem, HeaderLink} from "@components/Header";
import {Footer} from "@components/Footer";
import {UserContext} from "@components/context/UserContext";
import {ThemeContext} from "@components/context/ThemeContext";
import {UserDetails} from "@components/UserDetails";
import {Loader} from "@components/Loader";
import {useRouter} from "next/router";

const {NEXT_PUBLIC_URL} = process.env;

export default function DefaultLayout({children}) {
  const [userContext] = useContext(UserContext);
  const [theme] = useContext(ThemeContext);
  const Router = useRouter();
  return (
    <MantineProvider theme={{colorScheme: theme}}>
      <AppShell
        header={
          <HeaderBar>
            <HeaderLink label="Home" link="/" />
            {userContext.details === null ? (
              <HeaderLink
                label="Login"
                link={`${NEXT_PUBLIC_URL}${Router.basePath}/api/users/auth/discord`}
                style={{marginLeft: "auto"}}
                external
              />
            ) : !userContext.details ? (
              <HeaderItem style={{marginLeft: "auto"}}>
                <div className="loader-wrapper">
                  <Loader />
                </div>
              </HeaderItem>
            ) : (
              <HeaderItem style={{marginLeft: "auto"}}>
                <UserDetails />
              </HeaderItem>
            )}
          </HeaderBar>
        }
        footer={<Footer />}
        styles={(theme) => ({
          main: {minHeight: "calc(100vh - 16.75rem)", padding: "0"},
        })}
      >
        {children}
      </AppShell>
    </MantineProvider>
  );
}
