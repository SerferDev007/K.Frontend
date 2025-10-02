import FinanceReports from "@/components/Reports/FinanceReports";
import TenantsReports from "@/components/Reports/TenantsReports";

const ReportPage = () => {
  return (
    <div className="flex flex-col items-center justify-center  min-h-screen max-w-full sm:max-w-8xl mx-auto border border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 my-4">
      <TenantsReports />
      <FinanceReports />
    </div>
  );
};

export default ReportPage;
