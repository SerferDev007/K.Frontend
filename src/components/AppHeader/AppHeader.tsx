import { useContext } from "react";
import route from "../../routes/routes.json";
import { FloatingNav } from "../UI/FloatingNavbar";
import { ThemeContext } from "@/context/ThemeContext";

const AppHeader = () => {
  const { lightToDarkHandler, isDark, darkToLightHandler } =
    useContext(ThemeContext);

  const isLogin = true;
  const handleLogout = () => {};

  const handleThemeToggle = () => {
    if (isDark) darkToLightHandler();
    else lightToDarkHandler();
  };

  return (
    <FloatingNav
      navItems={[
        { name: "Dashboard", link: route.DASHBOARD },
        { name: "Donations", link: route.DONATIONS },
        { name: "Expenses", link: route.EXPENSES },
        { name: "Rents ", link: route.RENTS },
        { name: "Reports ", link: route.REPORTS },
      ]}
      isLogin={isLogin}
      loginPath={route.LOGIN}
      onLogout={handleLogout}
      isDark={isDark}
      onThemeToggle={handleThemeToggle}
    />
  );
};

export default AppHeader;
