"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    unit?: string;
}

/**
 * TextInput Component - Industrial Brutalism Style
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
    ({ label, error, unit, className = "", ...props }, ref) => {
        return (
            <div className={`flex flex-col ${className}`}>
                <label className="text-xs font-semibold uppercase tracking-widest text-concrete-gray mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              w-full px-3 py-2 font-mono text-base
              bg-white border-2 focus:outline-none focus:border-industrial-yellow
              ${error ? "border-safety-red" : "border-black"}
              ${unit ? "pr-16" : ""}
            `}
                        {...props}
                    />
                    {unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-concrete-gray font-mono">
                            {unit}
                        </span>
                    )}
                </div>
                {error && (
                    <span className="text-xs text-safety-red mt-1">{error}</span>
                )}
            </div>
        );
    }
);

TextInput.displayName = "TextInput";

/**
 * NumberInput Component - Industrial Brutalism Style
 */
interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "type"> {
    label: string;
    error?: string;
    unit?: string;
    value: number;
    onChange: (value: number) => void;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ label, error, unit, value, onChange, className = "", ...props }, ref) => {
        return (
            <div className={`flex flex-col ${className}`}>
                <label className="text-xs font-semibold uppercase tracking-widest text-concrete-gray mb-1">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type="number"
                        value={value}
                        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                        className={`
              w-full px-3 py-2 font-mono text-base
              bg-white border-2 focus:outline-none focus:border-industrial-yellow
              ${error ? "border-safety-red" : "border-black"}
              ${unit ? "pr-16" : ""}
            `}
                        {...props}
                    />
                    {unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-concrete-gray font-mono">
                            {unit}
                        </span>
                    )}
                </div>
                {error && (
                    <span className="text-xs text-safety-red mt-1">{error}</span>
                )}
            </div>
        );
    }
);

NumberInput.displayName = "NumberInput";
