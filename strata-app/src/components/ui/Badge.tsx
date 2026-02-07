import { HTMLAttributes, forwardRef } from "react";

type CrudeType = "light" | "heavy" | "sweet" | "sour";
type BadgeVariant = "default" | "light" | "heavy" | "sweet" | "sour" | "success" | "warning" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: "sm" | "md" | "lg";
}

/**
 * Badge Component - Industrial Brutalism Style
 * Colored labels for crude types and status indicators
 * Sharp corners, bold text, clear color coding
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
        const baseStyles = `
      inline-flex items-center justify-center
      font-semibold uppercase tracking-wider
      border-2 transition-none
    `;

        // Color variants matching crude oil classifications and status
        const variants = {
            // Default
            default: "bg-white text-black border-black",

            // Crude type: Light (premium, lighter color)
            light: "bg-industrial-yellow text-black border-black",

            // Crude type: Heavy (dark, industrial)
            heavy: "bg-oil-black text-white border-oil-black",

            // Crude type: Sweet (green for desirable)
            sweet: "bg-forest-green text-white border-forest-green",

            // Crude type: Sour (warning, requires processing)
            sour: "bg-safety-red text-white border-safety-red",

            // Status variants
            success: "bg-forest-green text-white border-forest-green",
            warning: "bg-industrial-yellow text-black border-black",
            danger: "bg-safety-red text-white border-safety-red",
        };

        const sizes = {
            sm: "px-1.5 py-0.5 text-[10px]",
            md: "px-2 py-1 text-xs",
            lg: "px-3 py-1.5 text-sm",
        };

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = "Badge";

/**
 * CrudeTypeBadge - Convenience component for crude oil classification
 */
interface CrudeTypeBadgeProps extends Omit<BadgeProps, 'variant'> {
    type: CrudeType;
}

export const CrudeTypeBadge = forwardRef<HTMLSpanElement, CrudeTypeBadgeProps>(
    ({ type, children, ...props }, ref) => {
        const labels: Record<CrudeType, string> = {
            light: "LIGHT",
            heavy: "HEAVY",
            sweet: "SWEET",
            sour: "SOUR",
        };

        return (
            <Badge ref={ref} variant={type} {...props}>
                {children || labels[type]}
            </Badge>
        );
    }
);

CrudeTypeBadge.displayName = "CrudeTypeBadge";
