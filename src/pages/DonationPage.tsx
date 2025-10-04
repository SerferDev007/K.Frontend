import Donations from "../components/Donations/Donations";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const DonationPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-4">
        <Donations />
      </div>
    )
  );
};

export default DonationPage;
