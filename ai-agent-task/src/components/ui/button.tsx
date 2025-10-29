import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantClasses = {
      default:
        "bg-foreground text-background hover:bg-gray-800 border border-transparent",
      ghost:
        "bg-transparent text-foreground hover:bg-gray-700 border border-gray-700",
    };
    return (
      <button
        ref={ref}
        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
