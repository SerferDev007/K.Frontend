import TenantsDetails from "@/components/Rents/TenantsDetails";
import Tenants from "../components/Rents/Tenants";

const TenantPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto border !border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 !my-4">
      <Tenants />
      <div className="flex flex-col md:flex-row justify-between items-center w-full border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-2">
        <TenantsDetails />
      </div>
    </div>
  );
};

export default TenantPage;
