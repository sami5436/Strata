"use client";

import { HTMLAttributes, forwardRef } from "react";

interface SelectionCardProps extends HTMLAttributes<HTMLButtonElement> {
    title: string;
    description: string;
    icon?: string;
    selected: boolean;
    onSelect: () => void;
    error?: boolean;
}

/**
 * SelectionCard Component - Industrial Brutalism Style
 * Large clickable cards for company type selection
 */
export const SelectionCard = forwardRef<HTMLButtonElement, SelectionCardProps>(
    ({ title, description, icon, selected, onSelect, error, className = "", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                onClick={onSelect}
                className={`
          w-full p-4 text-left border-2 transition-none cursor-pointer
          ${selected
                        ? "bg-black text-white border-black"
                        : error
                            ? "bg-white text-black border-safety-red hover:bg-gray-50"
                            : "bg-white text-black border-black hover:bg-gray-50"
                    }
          ${className}
        `}
                {...props}
            >
                <div className="flex items-start gap-3">
                    {icon && (
                        <span className={`text-2xl ${selected ? "text-white" : "text-black"}`}>
                            {icon}
                        </span>
                    )}
                    <div>
                        <h4 className="font-bold uppercase tracking-wider text-sm">
                            {title}
                        </h4>
                        <p className={`text-xs mt-1 ${selected ? "text-gray-300" : "text-concrete-gray"}`}>
                            {description}
                        </p>
                    </div>
                </div>
            </button>
        );
    }
);

SelectionCard.displayName = "SelectionCard";
