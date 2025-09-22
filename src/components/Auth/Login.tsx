import { useState, useRef, type FormEvent } from "react";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { loginUser } from "../../services/authService";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [viewPassword, setViewPassword] = useState(false); // toggle password
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      const response = await loginUser({ email, password });
      toast.success(response.message);
      login(response.user);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <form
        onSubmit={handleLogin}
        className="md:px-8 w-full max-w-md p-3 rounded-lg border-5 border-amber-400
        bg-white dark:bg-neutral-900
        text-gray-900 dark:text-gray-100
        shadow-sm"
      >
        <div className="text-center">
          <h3 className="dark:text-white font-bold text-2xl head-text-shadow head-text-stroke">
            Shree Kshetra Khandeshwar
          </h3>
          <h4 className="dark:text-white font-bold text-2xl head-text-shadow head-text-stroke">
            Kusalamb
          </h4>
        </div>

        <div className="w-full h-px bg-gray-300 my-4" />

        {/* Email */}
        <div className="relative flex items-center mt-2 mb-2 border-2 rounded-xl border-gray-200">
          <i className="bi bi-envelope m-2 text-xl text-gray-600 dark:text-gray-400"></i>
          <Input
            type="text"
            placeholder="Email"
            ref={emailRef}
            className="focus-visible:ring-1 mx-1 border-none rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent"
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center mt-2 mb-2 border-2 rounded-xl border-gray-200">
          <i className="bi bi-lock m-2 text-xl text-gray-600 dark:text-gray-400"></i>
          <Input
            type={viewPassword ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
            className="focus-visible:ring-1 mx-1 border-none rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent"
          />
          <i
            onClick={() => setViewPassword(!viewPassword)}
            className={`bi ${
              viewPassword ? "bi-eye" : "bi-eye-slash"
            } absolute text-xl top-1/2 right-3 -translate-y-1/2
               text-gray-400 dark:text-gray-500 hover:cursor-pointer`}
          ></i>
        </div>

        {/* Login Button */}
        <div className="mb-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
