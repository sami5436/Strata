"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    formatValue?: (value: number) => string;
    onChange: (value: number) => void;
}

/**
 * Slider Component - Industrial Brutalism Style
 * Large monospace value display (72px), native range input
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
    ({ value, min, max, step = 1, unit = "", formatValue, onChange, className = "", ...props }, ref) => {
        const displayValue = formatValue ? formatValue(value) : value.toString();

        return (
            <div className={`flex flex-col ${className}`}>
                {/* Value display - HUGE monospace */}
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono font-bold text-metric-lg" data-metric>
                        {displayValue}
                    </span>
                    {unit && (
                        <span className="font-mono text-xl text-concrete-gray">{unit}</span>
                    )}
                </div>

                {/* Range input */}
                <input
                    ref={ref}
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-full h-3 bg-white border-2 border-black appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-6
                     [&::-webkit-slider-thumb]:h-6
                     [&::-webkit-slider-thumb]:bg-black
                     [&::-webkit-slider-thumb]:border-2
                     [&::-webkit-slider-thumb]:border-black
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:w-6
                     [&::-moz-range-thumb]:h-6
                     [&::-moz-range-thumb]:bg-black
                     [&::-moz-range-thumb]:border-2
                     [&::-moz-range-thumb]:border-black
                     [&::-moz-range-thumb]:cursor-pointer"
                    {...props}
                />

                {/* Min/Max labels */}
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-concrete-gray font-mono">{min}{unit}</span>
                    <span className="text-xs text-concrete-gray font-mono">{max}{unit}</span>
                </div>
            </div>
        );
    }
);

Slider.displayName = "Slider";
