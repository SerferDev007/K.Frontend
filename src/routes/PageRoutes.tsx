import { Route, Routes } from "react-router-dom";
import route from "./routes.json";
import MainLayout from "@/layout/MainLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import DonationPage from "../pages/DonationPage";
import ExpensePage from "../pages/ExpensePage";
import ReportPage from "../pages/ReportPage";
import RentPage from "../pages/RentPage";
import LoanPage from "../pages/LoanPage";
import AddTenant from "../pages/AddTenantPage";
import Profile from "../pages/ProfilePage";
import ErrorPage from "../pages/ErrorPage";

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
        <Route path={route["ADD-TENANT"]} element={<AddTenant />} />
        <Route path={route.PROFILE} element={<Profile />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default PageRoutes;
