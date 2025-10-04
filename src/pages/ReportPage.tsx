import FinanceReports from "@/components/Reports/FinanceReports";
import TenantsReports from "@/components/Reports/TenantsReports";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReportPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    isAuthenticated && (
      <div className="flex flex-col items-center justify-center min-h-screen max-w-full sm:max-w-8xl bg-black/30 backdrop-blur-md rounded-xl shadow-lg">
        <div className="w-full h-px bg-white" />
        <TenantsReports />
        <div className="w-full h-px bg-white mt-4" />
        <FinanceReports />
        <div className="w-full h-px bg-white mt-4" />
      </div>
    )
  );
};

export default ReportPage;
