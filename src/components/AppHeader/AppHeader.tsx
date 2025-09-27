import { useAuth } from "@/hooks/useAuth";
import route from "../../routes/routes.json";
import { FloatingNav } from "../UI/FloatingNavbar";
import { FloatingTextBar } from "../UI/FloatingTextBar";

const AppHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="fixed top-3 inset-x-0 mx-auto flex justify-between max-w-8xl z-[5000]">
      <FloatingTextBar text="येळकोट येळकोट जय मल्हार 🚩" />
      <FloatingNav
        navItems={[
          { name: "Dashboard", link: route.DASHBOARD },
          { name: "Donations", link: route.DONATIONS },
          { name: "Expenses", link: route.EXPENSES },
          { name: "Tenants", link: route.TENANTS },
          { name: "Loans", link: route.LOANS },
          { name: "Reports", link: route.REPORTS },
        ]}
        isLogin={isAuthenticated}
        loginPath={route.LOGIN}
        onLogout={logout}
        userName={user?.name}
      />
    </div>
  );
};

export default AppHeader;
