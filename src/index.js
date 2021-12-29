import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";

import Header from "./components/structure/Header";
import Footer from "./components/structure/Footer";
import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import LoginCallback from "./pages/LoginCallback";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/UserContext";
import { HashRouter, Routes, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <HashRouter basename={process.env.REACT_APP_BASENAME}>
        <Header />
        <main>
          <Routes>
            <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
            <Route
              path={`${process.env.PUBLIC_URL}/logincallback`}
              element={<LoginCallback />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/dashboard`}
              element={<ProtectedRoute />}
            >
              <Route
                path={`${process.env.PUBLIC_URL}/dashboard`}
                element={<Dashboard />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </HashRouter>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
