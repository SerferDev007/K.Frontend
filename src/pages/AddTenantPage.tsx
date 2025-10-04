import TenantForm from "@/components/Tenants/TenantForm";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddTenant = () => {
  const [showTenantForm, setShowTenantForm] = useState(true);

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex items-start justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-4">
      {isAuthenticated && showTenantForm && (
        <TenantForm
          onBack={() => {
            setShowTenantForm(false);
            navigate("/");
          }}
        />
      )}
    </div>
  );
};

export default AddTenant;
