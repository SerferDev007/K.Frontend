import { Route, Routes } from "react-router-dom";
import route from "./routes.json";
import MainLayout from "@/layout/MainLayout";

import LoginPage from "@/pages/LoginPage";
import AboutPage from "@/pages/AboutPage";

import DashboardPage from "../pages/DashboardPage";
import DonationPage from "../pages/DonationPage";
import ExpensePage from "../pages/ExpensePage";
import ReportPage from "../pages/ReportPage";
import RentPage from "../pages/RentPage";
import LoanPage from "../pages/LoanPage";

const PageRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={route.DASHBOARD} element={<DashboardPage />} />
        <Route path={route.DONATIONS} element={<DonationPage />} />
        <Route path={route.EXPENSES} element={<ExpensePage />} />
        <Route path={route.RENTS} element={<RentPage />} />
        <Route path={route.LOANS} element={<LoanPage />} />
        <Route path={route.REPORTS} element={<ReportPage />} />
        <Route path={route.LOGIN} element={<LoginPage />} />
        <Route path={route.ABOUT} element={<AboutPage />} />
      </Route>
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default PageRoutes;
