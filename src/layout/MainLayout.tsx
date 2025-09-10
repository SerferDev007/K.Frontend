import AppHeader from "@/components/AppHeader/AppHeader";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <AppHeader />
      <main>
        <ScrollToTop />
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
