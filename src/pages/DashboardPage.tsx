import Dashboard from "../components/Dashboard/Dashboard";
// import { useAuth } from "@/hooks/useAuth";
// import { Navigate } from "react-router-dom";
// import toast from "react-hot-toast";

const DashboardPage = () => {
  // const { isAuthenticated } = useAuth();

  // if (!isAuthenticated) {
  //   toast.loading("Please login first");
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen max-w-full sm:max-w-8xl mx-auto backdrop-blur-md  shadow-lg">
        <Dashboard />
      </div>
    </>
  );
};

export default DashboardPage;
