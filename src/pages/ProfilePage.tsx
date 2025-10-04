import { Button } from "@/components/UI/Button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  if (!isAuthenticated) {
    toast.loading("Please login first");
    return <Navigate to="/login" replace />;
  }

  return (
    isAuthenticated && (
      <div className="flex flex-col items-center justify-center min-h-screen max-w-full sm:max-w-8xl bg-black/30 backdrop-blur-md rounded-xl shadow-lg ">
        <div className="bg-blue-200  text-2xl font-bold w-1/2 h-9 text-center rounded-2xl">
          Page Under Development
        </div>
        <Button
          className="m-4 !rounded-2xl font-bold bg-blue-600 hover:bg-blue-400"
          onClick={() => navigate(`/`)}
        >
          GoTo Dashboard
        </Button>
      </div>
    )
  );
};

export default Profile;
