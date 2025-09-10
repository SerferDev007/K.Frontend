import { createContext } from "react";

export interface ThemeContextType {
  isDark: boolean;
  lightToDarkHandler: () => void;
  darkToLightHandler: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  lightToDarkHandler: () => {},
  darkToLightHandler: () => {},
});
