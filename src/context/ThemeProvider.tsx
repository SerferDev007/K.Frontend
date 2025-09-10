import { useState, useEffect, type ReactNode } from "react";
import { ThemeContext } from "./ThemeContext";

const LS_THEME_NAME = "isDark";

// Detect if system prefers dark theme
const systemIsDarkTheme = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

// Determine initial theme: localStorage > system preference
const initialTheme =
  localStorage.getItem(LS_THEME_NAME) !== null
    ? localStorage.getItem(LS_THEME_NAME) === "true"
    : systemIsDarkTheme;

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(initialTheme);

  const lightToDarkHandler = () => setIsDark(true);
  const darkToLightHandler = () => setIsDark(false);

  useEffect(() => {
    localStorage.setItem(LS_THEME_NAME, isDark.toString());
    if (isDark) {
      document.documentElement.classList.add("dark"); // <-- key for Tailwind dark:
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{ isDark, lightToDarkHandler, darkToLightHandler }}
    >
      {children}
      {isDark && (
        <style>
          {`body {
              background-color: black;
              color: white;
          }`}
        </style>
      )}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };
