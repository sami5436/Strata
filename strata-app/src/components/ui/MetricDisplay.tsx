import { HTMLAttributes, forwardRef } from "react";

interface MetricDisplayProps extends HTMLAttributes<HTMLDivElement> {
    value: string | number;
    label: string;
    unit?: string;
    size?: "sm" | "md" | "lg" | "xl";
    trend?: "up" | "down" | "neutral";
}

/**
 * MetricDisplay Component - Industrial Brutalism Style
 * Huge monospace number with small uppercase label
 * Inspired by Swiss railway displays and Bloomberg terminals
 */
export const MetricDisplay = forwardRef<HTMLDivElement, MetricDisplayProps>(
    ({ className = "", value, label, unit, size = "lg", trend, ...props }, ref) => {
        const sizes = {
            sm: {
                value: "text-metric-sm",
                label: "text-label-sm",
                unit: "text-base",
            },
            md: {
                value: "text-metric-md",
                label: "text-label-md",
                unit: "text-lg",
            },
            lg: {
                value: "text-metric-lg",
                label: "text-label-lg",
                unit: "text-xl",
            },
            xl: {
                value: "text-metric-xl",
                label: "text-label-lg",
                unit: "text-2xl",
            },
        };

        const trendColors = {
            up: "text-forest-green",
            down: "text-safety-red",
            neutral: "text-black",
        };

        return (
            <div ref={ref} className={`flex flex-col ${className}`} {...props}>
                {/* Label - Small, uppercase, tracked */}
                <span className={`${sizes[size].label} text-concrete-gray uppercase tracking-widest mb-1`}>
                    {label}
                </span>

                {/* Value - Huge monospace number */}
                <div className="flex items-baseline gap-2">
                    <span
                        className={`font-mono font-bold ${sizes[size].value} ${trend ? trendColors[trend] : "text-black"}`}
                        data-metric
                    >
                        {value}
                    </span>
                    {unit && (
                        <span className={`font-mono ${sizes[size].unit} text-concrete-gray`}>
                            {unit}
                        </span>
                    )}
                </div>
            </div>
        );
    }
);

MetricDisplay.displayName = "MetricDisplay";
