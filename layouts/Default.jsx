import {useContext} from "react";
import {MantineProvider, AppShell} from "@mantine/core";
import {HeaderBar, HeaderItem, HeaderLink} from "@components/Header";
import {Footer} from "@components/Footer";
import {UserContext} from "@components/context/UserContext";
import {Userdetails} from "@components/Userdetails";
import {Loader} from "@components/Loader";

export default function DefaultLayout({children}) {
  const [userContext] = useContext(UserContext);
  return (
    <MantineProvider theme={{colorScheme: "dark"}}>
      <AppShell
        header={
          <HeaderBar>
            <HeaderLink label="Home" link="/" />
            {userContext.details === null ? (
              <HeaderLink
                label="Login"
                link={`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/auth/discord`}
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
                <Userdetails />
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
