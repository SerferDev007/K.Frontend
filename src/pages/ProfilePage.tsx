import { Button } from "@/components/UI/Button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen mx-auto border !border-white/30 bg-black/20 backdrop-blur-md rounded-xl shadow-lg p-4 !my-4">
      <div className="bg-amber-300  text-2xl font-bold w-1/2 h-9 text-center rounded-2xl">
        Page Under Development
      </div>
      <Button
        className="m-4 !rounded-2xl font-bold"
        onClick={() => navigate(`/`)}
      >
        GoTo Dashboard
      </Button>
    </div>
  );
};

export default Profile;
