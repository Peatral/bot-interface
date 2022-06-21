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
import NotFound from "./pages/NotFound";

import { UserProvider } from "./context/UserContext";

import { HashRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <UserProvider>
        <Header />
        <main>
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
            <Route path="/guilds/:guildId/polls/:pollId" element={<ProtectedRoute />}>
              <Route path="/guilds/:guildId/polls/:pollId" element={<PollEditor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </UserProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
