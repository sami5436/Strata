"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

/**
 * Checkbox Component - Industrial Brutalism Style
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, checked, onChange, className = "", ...props }, ref) => {
        return (
            <label className={`inline-flex items-center gap-2 cursor-pointer ${className}`}>
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => onChange(e.target.checked)}
                        className="sr-only"
                        {...props}
                    />
                    <div
                        className={`
              w-5 h-5 border-2 border-black flex items-center justify-center
              ${checked ? "bg-black" : "bg-white"}
            `}
                    >
                        {checked && (
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 6L5 9L10 3"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="square"
                                />
                            </svg>
                        )}
                    </div>
                </div>
                <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
            </label>
        );
    }
);

Checkbox.displayName = "Checkbox";

/**
 * CheckboxGroup Component - For multiple checkboxes with error state
 */
interface CheckboxGroupProps {
    label?: string;
    error?: string;
    children: React.ReactNode;
}

export const CheckboxGroup = ({ label, error, children }: CheckboxGroupProps) => {
    return (
        <div className="flex flex-col">
            {label && (
                <span className="text-xs font-semibold uppercase tracking-widest text-concrete-gray mb-2">
                    {label}
                </span>
            )}
            <div className="flex flex-wrap gap-4">
                {children}
            </div>
            {error && (
                <span className="text-xs text-safety-red mt-2">{error}</span>
            )}
        </div>
    );
};
