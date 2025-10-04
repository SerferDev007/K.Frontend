import { useAuth } from "@/hooks/useAuth";
import route from "../../routes/routes.json";
import { FloatingNav } from "../UI/FloatingNavbar";

const AppHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="flex justify-between max-w-8xl z-[5000]">
      <FloatingNav
        navItems={[
          { name: "dashboard", link: route.DASHBOARD },
          { name: "donations", link: route.DONATIONS },
          { name: "expenses", link: route.EXPENSES },
          { name: "tenants", link: route.TENANTS },
          { name: "reports", link: route.REPORTS },
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
