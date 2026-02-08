"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, Button, Select, NumberInput } from "@/components/ui";

type CalculatorType = "refine-vs-sell" | "storage-economics" | "quality-swap";

interface CalculatorResult {
    profit: number;
    description: string;
}

const calculatorOptions = [
    { value: "refine-vs-sell", label: "Refine vs. Sell" },
    { value: "storage-economics", label: "Storage Economics" },
    { value: "quality-swap", label: "Quality Swap" },
];

/**
 * QuickCalculatorWidget - Scenario calculator with dropdown selection
 */
export function QuickCalculatorWidget() {
    const [calculatorType, setCalculatorType] = useState<CalculatorType>("refine-vs-sell");
    const [result, setResult] = useState<CalculatorResult | null>(null);

    // Input states for different calculators
    const [refineInputs, setRefineInputs] = useState({ crudePrice: 80, crackSpread: 14.5 });
    const [storageInputs, setStorageInputs] = useState({ spotPrice: 80, futuresPrice: 84, months: 3 });
    const [swapInputs, setSwapInputs] = useState({ yourPrice: 82, targetPrice: 62, volume: 10000 });

    const handleCalculate = () => {
        switch (calculatorType) {
            case "refine-vs-sell": {
                // Simplified: Refining profit = Crack spread per barrel
                // Selling profit = 0 (baseline)
                const refineProfit = refineInputs.crackSpread;
                const sellProfit = 0;
                const difference = refineProfit - sellProfit;
                setResult({
                    profit: difference,
                    description: difference > 0
                        ? `Refining yields +$${difference.toFixed(2)}/bbl more than selling`
                        : `Selling is more profitable by $${Math.abs(difference).toFixed(2)}/bbl`,
                });
                break;
            }
            case "storage-economics": {
                // Contango profit = (Futures - Spot) - Storage costs
                const storageCost = 0.5 * storageInputs.months; // $0.50/bbl/month
                const grossProfit = storageInputs.futuresPrice - storageInputs.spotPrice;
                const netProfit = grossProfit - storageCost;
                setResult({
                    profit: netProfit,
                    description: netProfit > 0
                        ? `Store and sell later for +$${netProfit.toFixed(2)}/bbl profit`
                        : `Storage not profitable. Sell now.`,
                });
                break;
            }
            case "quality-swap": {
                // Quality arbitrage = (Your price - Target price) × Volume
                const dailyProfit = (swapInputs.yourPrice - swapInputs.targetPrice) * swapInputs.volume;
                setResult({
                    profit: dailyProfit,
                    description: dailyProfit > 0
                        ? `Swap crude for +$${(dailyProfit / 1000).toFixed(0)}K/day profit`
                        : `Swap not profitable at current spreads`,
                });
                break;
            }
        }
    };

    return (
        <Card padding="none" className="h-full flex flex-col">
            <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                <div className="flex items-center">
                    <CardTitle>Quick Calculator</CardTitle>
                    <span
                        className="text-concrete-gray hover:text-black cursor-help text-sm ml-1"
                        title="Run quick profit/loss calculations for common trading scenarios: Refine vs Sell, Storage Economics, or Quality Swap arbitrage"
                    >
                        ⓘ
                    </span>
                </div>
            </CardHeader>

            <div className="px-6 pb-6 flex-1 flex flex-col">
                {/* Calculator Type Selector */}
                <Select
                    label="Scenario"
                    value={calculatorType}
                    onChange={(v) => {
                        setCalculatorType(v as CalculatorType);
                        setResult(null);
                    }}
                    options={calculatorOptions}
                    className="mb-4"
                />

                {/* Dynamic Input Fields */}
                <div className="space-y-3 flex-1">
                    {calculatorType === "refine-vs-sell" && (
                        <>
                            <NumberInput
                                label="Crude Price"
                                value={refineInputs.crudePrice}
                                onChange={(v) => setRefineInputs({ ...refineInputs, crudePrice: v })}
                                unit="$/bbl"
                            />
                            <NumberInput
                                label="Crack Spread"
                                value={refineInputs.crackSpread}
                                onChange={(v) => setRefineInputs({ ...refineInputs, crackSpread: v })}
                                unit="$/bbl"
                            />
                        </>
                    )}

                    {calculatorType === "storage-economics" && (
                        <>
                            <NumberInput
                                label="Spot Price"
                                value={storageInputs.spotPrice}
                                onChange={(v) => setStorageInputs({ ...storageInputs, spotPrice: v })}
                                unit="$/bbl"
                            />
                            <NumberInput
                                label="Futures Price"
                                value={storageInputs.futuresPrice}
                                onChange={(v) => setStorageInputs({ ...storageInputs, futuresPrice: v })}
                                unit="$/bbl"
                            />
                            <NumberInput
                                label="Storage Period"
                                value={storageInputs.months}
                                onChange={(v) => setStorageInputs({ ...storageInputs, months: v })}
                                unit="months"
                            />
                        </>
                    )}

                    {calculatorType === "quality-swap" && (
                        <>
                            <NumberInput
                                label="Your Crude Price"
                                value={swapInputs.yourPrice}
                                onChange={(v) => setSwapInputs({ ...swapInputs, yourPrice: v })}
                                unit="$/bbl"
                            />
                            <NumberInput
                                label="Target Crude Price"
                                value={swapInputs.targetPrice}
                                onChange={(v) => setSwapInputs({ ...swapInputs, targetPrice: v })}
                                unit="$/bbl"
                            />
                            <NumberInput
                                label="Daily Volume"
                                value={swapInputs.volume}
                                onChange={(v) => setSwapInputs({ ...swapInputs, volume: v })}
                                unit="BPD"
                            />
                        </>
                    )}
                </div>

                {/* Calculate Button */}
                <Button
                    variant="primary"
                    size="md"
                    className="w-full mt-4"
                    onClick={handleCalculate}
                >
                    Calculate
                </Button>

                {/* Result Display */}
                {result && (
                    <div className={`mt-4 p-3 border-2 ${result.profit >= 0 ? "border-forest-green bg-forest-green/5" : "border-safety-red bg-safety-red/5"}`}>
                        <p className={`font-mono font-bold text-xl ${result.profit >= 0 ? "text-forest-green" : "text-safety-red"}`}>
                            {result.profit >= 0 ? "+" : ""}{calculatorType === "quality-swap"
                                ? `$${(result.profit / 1000).toFixed(0)}K/day`
                                : `$${result.profit.toFixed(2)}/bbl`
                            }
                        </p>
                        <p className="text-xs text-concrete-gray mt-1">
                            {result.description}
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
