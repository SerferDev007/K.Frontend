import LoginForm from "@/components/Auth/Login";

const LoginPage = () => {
  return (
    <>
      <div className="relative min-h-screen flex justify-center">
        <div className="absolute w-full">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;
