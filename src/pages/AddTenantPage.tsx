import TenantForm from "@/components/Tenants/TenantForm";
import { useState } from "react";

const AddTenant = () => {
  const [showTenantForm, setShowTenantForm] = useState(true);
  return (
    <div className="flex items-center justify-center  min-h-screen max-w-full sm:max-w-8xl mx-auto border border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 my-4">
      {showTenantForm ? (
        <TenantForm onBack={() => setShowTenantForm(false)} />
      ) : null}
    </div>
  );
};

export default AddTenant;
