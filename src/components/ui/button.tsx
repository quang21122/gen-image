import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "btn-gradient text-white shadow-glow hover:shadow-glow-lg transform hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-white/30 dark:border-white/20 bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 backdrop-blur-sm glass-morphism hover:border-primary-400/50 dark:hover:border-primary-400/50",
        secondary:
          "bg-gradient-to-r from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 text-secondary-900 dark:text-secondary-100 hover:from-secondary-200 hover:to-secondary-300 dark:hover:from-secondary-700 dark:hover:to-secondary-600 shadow-md hover:shadow-lg",
        ghost: "hover:bg-white/10 dark:hover:bg-white/5 hover:backdrop-blur-sm",
        link: "text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline hover:text-primary-700 dark:hover:text-primary-300",
        gradient:
          "bg-gradient-to-r from-primary-500 via-accent-500 to-electric-500 text-white shadow-glow hover:shadow-glow-lg transform hover:-translate-y-0.5 active:translate-y-0 bg-[length:200%_100%] hover:bg-right-bottom",
        neon: "bg-gradient-to-r from-neon-400 to-electric-400 text-white shadow-glow-neon hover:shadow-glow-electric transform hover:-translate-y-0.5 active:translate-y-0",
        cosmic:
          "bg-cosmic text-white shadow-glow-accent hover:shadow-glow-primary transform hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
