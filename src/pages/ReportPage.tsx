import FinanceReports from "@/components/Reports/FinanceReports";
import TenantsReports from "@/components/Reports/TenantsReports";

const ReportPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-4">
      <div className="w-full h-px bg-white mt-4" />
      <TenantsReports />
      <div className="w-full h-px bg-white mt-4" />
      <FinanceReports />
      <div className="w-full h-px bg-white mt-4" />
    </div>
  );
};

export default ReportPage;
