import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-tet-red-600 to-tet-red-700 text-white shadow-glow-red hover:from-tet-red-700 hover:to-tet-red-900",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        gold: "bg-gradient-to-r from-tet-gold-500 to-tet-gold-600 text-white shadow-glow-gold hover:from-tet-gold-600 hover:to-tet-gold-600",
        outline: "border-2 border-tet-gold-500 bg-transparent text-tet-gold-500 hover:bg-tet-gold-500 hover:text-white",
        ghost: "hover:bg-tet-red-100 hover:text-tet-red-900",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base font-bold",
        xl: "h-16 rounded-xl px-12 text-lg font-bold",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
