"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
    value: string;
    label: string;
    description?: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
    label: string;
    options: SelectOption[];
    error?: string;
    value: string;
    onChange: (value: string) => void;
}

/**
 * Select Component - Industrial Brutalism Style
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, options, error, value, onChange, className = "", ...props }, ref) => {
        return (
            <div className={`flex flex-col ${className}`}>
                <label className="text-xs font-semibold uppercase tracking-widest text-concrete-gray mb-1">
                    {label}
                </label>
                <select
                    ref={ref}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
            w-full px-3 py-2 font-mono text-base appearance-none
            bg-white border-2 focus:outline-none focus:border-industrial-yellow
            cursor-pointer
            ${error ? "border-safety-red" : "border-black"}
          `}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black'%3E%3Cpath stroke-linecap='square' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 8px center",
                        backgroundSize: "20px",
                    }}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <span className="text-xs text-safety-red mt-1">{error}</span>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
