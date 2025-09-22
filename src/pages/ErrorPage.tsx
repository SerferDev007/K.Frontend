// src/pages/ErrorPage.tsx
import { NavLink } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-neutral-900 dark:to-neutral-800">
      <div className="relative z-10 text-center p-8 bg-white dark:bg-neutral-900 shadow-xl rounded-2xl max-w-md w-full">
        {/* Error Code */}
        <h1 className="text-9xl font-extrabold text-gray-300 dark:text-neutral-700">
          404
        </h1>

        {/* Message */}
        <h2 className="mt-2 text-2xl font-bold text-gray-800 dark:text-neutral-200">
          Oops! Page Not Found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <div className="mt-6">
          <NavLink
            to="/"
            className="inline-block px-6 py-3 text-white bg-red-500 hover:bg-red-700 transition-colors duration-300 rounded-full shadow-md font-medium"
            style={{ textDecoration: "none" }}
          >
            ⬅ Back to Home
          </NavLink>
        </div>

        {/* Extra styling detail */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 dark:text-neutral-500">
            © {new Date().getFullYear()} Shree Kshetra Khandeshwar. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
