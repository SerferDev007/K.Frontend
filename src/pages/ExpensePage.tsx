import Expenses from "../components/Expenses/Expenses";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ExpensePage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto bg-black/30 backdrop-blur-md rounded-xl shadow-lg p-4">
        <Expenses />
      </div>
    )
  );
};

export default ExpensePage;
