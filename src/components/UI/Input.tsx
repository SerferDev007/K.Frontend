import * as React from "react";
import { cn } from "@/lib/utils";

const Input = ({
  className,
  placeholder,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        // typed text color - ensure it's visible
        "text-black dark:text-white",

        // placeholder text - make it more visible
        "placeholder:text-gray-500 dark:placeholder:text-gray-400 file:text-foreground",

        // the rest of your styles
        "selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/30 bExpenses-input flex h-9 w-full min-w-0 rounded-md bExpenses bg-transparent",
        "px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:bExpenses-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:bExpenses-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:bExpenses-destructive",
        className
      )}
      {...props}
    />
  );
};

export { Input };
