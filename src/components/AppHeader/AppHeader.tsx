import { useContext } from "react";
import route from "../../routes/routes.json";
import { FloatingNav } from "../UI/FloatingNavbar";
import { ThemeContext } from "@/context/ThemeContext";
import { FloatingTextBar } from "../UI/FloatingTextBar";

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
    <div className="fixed top-3 inset-x-0 mx-auto flex justify-between max-w-8xl z-[5000] px-6">
      <FloatingTextBar text="येळकोट येळकोट जय मल्हार 🚩" />
      <FloatingNav
        navItems={[
          { name: "Dashboard", link: route.DASHBOARD },
          { name: "Donations", link: route.DONATIONS },
          { name: "Expenses", link: route.EXPENSES },
          { name: "Rents", link: route.RENTS },
          { name: "Loans", link: route.LOANS },
          { name: "Reports", link: route.REPORTS },
        ]}
        isLogin={isLogin}
        loginPath={route.LOGIN}
        onLogout={handleLogout}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
};

export default AppHeader;
