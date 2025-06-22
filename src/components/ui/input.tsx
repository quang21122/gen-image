import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-white/30 dark:border-white/20 bg-white/50 dark:bg-white/10 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:border-primary-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 backdrop-blur-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
