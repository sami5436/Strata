import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "highlight" | "warning";
    padding?: "none" | "sm" | "md" | "lg";
}

/**
 * Card Component - Industrial Brutalism Style
 * White background, 2px black border, no shadows, sharp corners
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", variant = "default", padding = "md", children, ...props }, ref) => {
        const baseStyles = "bg-white border-2 transition-none";

        const variants = {
            default: "border-black",
            highlight: "border-industrial-yellow bg-industrial-yellow/5",
            warning: "border-safety-red bg-safety-red/5",
        };

        const paddings = {
            none: "",
            sm: "p-2",
            md: "p-4",
            lg: "p-6",
        };

        return (
            <div
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

/**
 * CardHeader - For card titles and actions
 */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`flex items-center justify-between border-b-2 border-black pb-3 mb-4 ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

/**
 * CardTitle - Uppercase label for card headers
 */
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={`text-sm font-semibold uppercase tracking-widest ${className}`}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = "CardTitle";
