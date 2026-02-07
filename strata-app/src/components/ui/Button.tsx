import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

/**
 * Button Component - Industrial Brutalism Style
 * Black background, white text, sharp corners, no shadows
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center
      font-semibold uppercase tracking-wider
      border-2 transition-none cursor-pointer
      focus:outline-none focus-visible:ring-2 focus-visible:ring-industrial-yellow focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

        const variants = {
            primary: "bg-black text-white border-black hover:bg-oil-black active:bg-concrete-gray",
            secondary: "bg-white text-black border-black hover:bg-gray-100 active:bg-gray-200",
            danger: "bg-safety-red text-white border-safety-red hover:opacity-90 active:opacity-80",
            ghost: "bg-transparent text-black border-transparent hover:border-black",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
