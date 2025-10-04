import LoginForm from "@/components/Auth/Login";

const LoginPage = () => {
  return (
    <div className="flex items-start justify-center min-h-screen max-w-full sm:max-w-8xl bg-black/30 backdrop-blur-md rounded-xl shadow-lg ">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
