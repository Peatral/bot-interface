import {createContext, useEffect, useState} from "react";

const ThemeContext = createContext("dark");

let initialTheme = "dark";

const ThemeProvider = (props) => {
  const [theme, setTheme] = useState(initialTheme);

  const loadTheme = () => {
    var storedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    if (storedTheme) {
      document.documentElement.setAttribute("data-theme", storedTheme);
      setTheme(storedTheme);
    }
  };

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export {ThemeContext, ThemeProvider};
