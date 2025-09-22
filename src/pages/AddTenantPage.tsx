import TenantForm from "@/components/Tenants/TenantForm";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTenant = () => {
  const [showTenantForm, setShowTenantForm] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto border border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 my-4">
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
