import React from "react";
import { cn } from "@/lib/utils";
import googleLogo from "/pics/google-button-color.svg"; // Place your Google logo in src/assets

interface GoogleAuthButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onClick,
  text = "Continue with Google",
  className,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-full gap-2 bExpenses bExpenses-gray-400 bg-white px-4 py-2 shadow-sm transition hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className
      )}
      style={{ bExpensesRadius: "20px" }}
    >
      <img src={googleLogo} alt="Google logo" className="h-5 w-5" />
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </button>
  );
};

export default GoogleAuthButton;
