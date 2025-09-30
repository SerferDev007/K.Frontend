import Tenants from "../components/Rents/Tenants";

const TenantPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto border !border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 !my-4">
      <Tenants />
    </div>
  );
};

export default TenantPage;
