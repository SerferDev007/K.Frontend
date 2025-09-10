import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";

const Login = () => {
  //const viewPassword = false;
  const loading = false;

  return (
    <div className="flex items-center justify-center min-h-screen py-10 ">
      <form
        className="md:px-8 w-full max-w-md p-3 rounded-lg border-5 border-amber-400
        bg-white dark:bg-neutral-900
        text-gray-900 dark:text-gray-100
        shadow-sm"
      >
        <div className="text-center">
          <h3 className=" dark:text-white font-bold text-2xl head-text-shadow head-text-stroke">
            Shree Kshetra Khandeshwar
          </h3>
          <h4 className=" dark:text-white font-bold text-2xl head-text-shadow head-text-stroke">
            Kusalamb
          </h4>
        </div>

        <div className="w-full h-px bg-gray-300 my-4" />

        {/* Email / Mobile */}
        <div className="relative flex items-center mt-2 mb-2 border-2 rounded-xl border-gray-200">
          <i className="bi bi-envelope m-2 text-xl text-gray-600 dark:text-gray-400"></i>
          <Input
            type="text"
            placeholder="Email or Mobile Number"
            className="focus-visible:ring-1 mx-1 border-none rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent"
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center mt-2 mb-2 border-2 rounded-xl border-gray-200">
          <i className="bi bi-lock m-2 text-xl text-gray-600 dark:text-gray-400"></i>
          <Input
            type="password"
            placeholder="Password"
            className="focus-visible:ring-1 mx-1 border-none rounded-xl
                       placeholder-gray-500 dark:placeholder-gray-400
                       text-black dark:text-white bg-transparent"
          />
          <i
            className="bi bi-eye absolute text-xl top-1/2 right-3 -translate-y-1/2
                        text-gray-400 dark:text-gray-500 hover:cursor-pointer"
          ></i>
        </div>

        <div className="mb-2">
          {loading ? (
            <Button className="w-full !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900 disabled:cursor-not-allowed">
              Please Wait…
            </Button>
          ) : (
            <Button className="w-full !rounded-xl bg-amber-400 hover:bg-orange-400 text-gray-900">
              Login
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
