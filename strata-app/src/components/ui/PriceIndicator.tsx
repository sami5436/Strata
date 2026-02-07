import { HTMLAttributes, forwardRef } from "react";

interface PriceIndicatorProps extends HTMLAttributes<HTMLDivElement> {
    price: number;
    change: number;
    changePercent?: number;
    currency?: string;
    size?: "sm" | "md" | "lg";
}

/**
 * PriceIndicator Component - Industrial Brutalism Style
 * Price with green/red arrow indicator for change
 * Monospace numbers, clear directional signals
 */
export const PriceIndicator = forwardRef<HTMLDivElement, PriceIndicatorProps>(
    ({ className = "", price, change, changePercent, currency = "$", size = "md", ...props }, ref) => {
        const isPositive = change >= 0;
        const changeColor = isPositive ? "text-forest-green" : "text-safety-red";

        const sizes = {
            sm: {
                price: "text-lg",
                change: "text-xs",
                arrow: "text-sm",
            },
            md: {
                price: "text-2xl",
                change: "text-sm",
                arrow: "text-base",
            },
            lg: {
                price: "text-4xl",
                change: "text-base",
                arrow: "text-lg",
            },
        };

        // Arrow symbols - solid triangles
        const Arrow = () => (
            <span className={`font-bold ${sizes[size].arrow}`}>
                {isPositive ? "▲" : "▼"}
            </span>
        );

        const formatPrice = (val: number) => {
            return val.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        };

        const formatChange = (val: number) => {
            const prefix = val >= 0 ? "+" : "";
            return prefix + val.toFixed(2);
        };

        return (
            <div ref={ref} className={`flex flex-col ${className}`} {...props}>
                {/* Main Price */}
                <div className="flex items-baseline gap-1">
                    <span className={`font-mono font-bold ${sizes[size].price}`} data-metric>
                        {currency}{formatPrice(price)}
                    </span>
                </div>

                {/* Change indicator */}
                <div className={`flex items-center gap-1.5 mt-1 ${changeColor}`}>
                    <Arrow />
                    <span className={`font-mono font-semibold ${sizes[size].change}`} data-metric>
                        {formatChange(change)}
                    </span>
                    {changePercent !== undefined && (
                        <span className={`font-mono ${sizes[size].change} opacity-75`} data-metric>
                            ({formatChange(changePercent)}%)
                        </span>
                    )}
                </div>
            </div>
        );
    }
);

PriceIndicator.displayName = "PriceIndicator";
