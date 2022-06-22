import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Header from "./components/structure/Header";
import Footer from "./components/structure/Footer";

import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import LoginCallback from "./pages/LoginCallback";
import Dashboard from "./pages/Dashboard";
import Guilds from "./pages/Guilds";
import GuildView from "./pages/GuildView";
import PollEditor from "./pages/PollEditor";
import Polls from "./pages/Polls";
import NotFound from "./pages/NotFound";

import { UserProvider } from "./context/UserContext";

import { MantineProvider, AppShell, Container } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';

import { HashRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <MantineProvider theme={{ colorScheme: 'dark' }}>
        <NotificationsProvider>
          <UserProvider>
            <AppShell
              header={<Header />}
              footer={<Footer />}
              styles={(theme) => ({
                main: { minHeight: "calc(100vh - 6.5rem)" }
              })}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logincallback" element={<LoginCallback />} />
                <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/guilds" element={<ProtectedRoute />}>
                  <Route path="/guilds" element={<Guilds />} />
                </Route>
                <Route path="/guilds/:guildId" element={<ProtectedRoute />}>
                  <Route path="/guilds/:guildId" element={<GuildView />} />
                </Route>
                <Route path="/polls" element={<ProtectedRoute />}>
                  <Route path="/polls" element={<Polls />} />
                </Route>
                <Route path="/polls/:pollId" element={<ProtectedRoute />}>
                  <Route path="/polls/:pollId" element={<PollEditor />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
          </UserProvider>
        </NotificationsProvider>
      </MantineProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
