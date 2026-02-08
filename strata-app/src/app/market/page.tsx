"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MainLayout } from "@/components/layout";


// ============================================
// TYPES
// ============================================

interface CrudeBenchmark {
    grade: string;
    price: number;
    change: number;
    vsWti: number | null;
    quality: string;
}

interface FuturesCurveData {
    spot: number;
    m1: number;
    m2: number;
    m3: number;
    m6: number;
    m12: number;
    isContango: boolean;
    slope: number;
    annualizedContango: number;
}

interface MarketData {
    prices: {
        wti: { price: number; change: number };
        brent: { price: number; change: number };
    };
    lastUpdated: string;
}

// ============================================
// FETCHER
// ============================================

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

// ============================================
// PRICE TABLE COMPONENT
// ============================================

function PriceTable({ wtiPrice, brentPrice, lastUpdated, onRefresh }: {
    wtiPrice: number;
    brentPrice: number;
    lastUpdated: string;
    onRefresh: () => void;
}) {
    // Build benchmarks with real WTI/Brent and estimated others
    const benchmarks: CrudeBenchmark[] = [
        {
            grade: "WTI Cushing",
            price: wtiPrice,
            change: 1.20, // Demo
            vsWti: null,
            quality: "Light Sweet"
        },
        {
            grade: "Brent",
            price: brentPrice,
            change: 0.95,
            vsWti: brentPrice - wtiPrice,
            quality: "Light Sweet"
        },
        {
            grade: "LLS",
            price: wtiPrice + 2.50, // Typical LLS premium
            change: 1.10,
            vsWti: 2.50,
            quality: "Light Sweet"
        },
        {
            grade: "Mars",
            price: wtiPrice - 4.00, // Typical Mars discount
            change: 0.80,
            vsWti: -4.00,
            quality: "Medium Sour"
        },
        {
            grade: "WCS",
            price: wtiPrice - 18.00, // Typical WCS discount
            change: 0.50,
            vsWti: -18.00,
            quality: "Heavy Sour"
        },
        {
            grade: "Dubai",
            price: brentPrice - 2.00, // Typical Dubai discount to Brent
            change: 0.65,
            vsWti: brentPrice - 2.00 - wtiPrice,
            quality: "Medium Sour"
        },
        {
            grade: "Bakken",
            price: wtiPrice - 3.00, // Clearbrook discount
            change: 0.90,
            vsWti: -3.00,
            quality: "Light Sweet"
        }
    ];

    const timeSinceUpdate = () => {
        const updated = new Date(lastUpdated);
        const now = new Date();
        const diffMs = now.getTime() - updated.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins === 1) return "1 minute ago";
        return `${diffMins} minutes ago`;
    };

    return (
        <Card padding="none" className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between px-6 py-4 border-b-2 border-black">
                <div className="flex items-center gap-3">
                    <CardTitle>Crude Oil Benchmarks</CardTitle>
                    <Badge variant="default" size="sm">LIVE</Badge>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-concrete-gray">
                        Last updated: {timeSinceUpdate()}
                    </span>
                    <Button size="sm" variant="secondary" onClick={onRefresh}>
                        ↻ Refresh
                    </Button>
                </div>
            </CardHeader>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider">
                                Grade
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">
                                Quality
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider">
                                Price
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider">
                                Change
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-bold uppercase tracking-wider">
                                vs. WTI
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {benchmarks.map((b, idx) => (
                            <tr
                                key={b.grade}
                                className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
                            >
                                <td className="px-6 py-4 font-semibold">
                                    {b.grade}
                                </td>
                                <td className="px-4 py-4">
                                    <Badge
                                        variant={b.quality.includes("Light") ? "light" : b.quality.includes("Heavy") ? "heavy" : "default"}
                                        size="sm"
                                    >
                                        {b.quality}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-lg">
                                    ${b.price.toFixed(2)}
                                </td>
                                <td className={`px-6 py-4 text-right font-mono ${b.change >= 0 ? "text-forest-green" : "text-safety-red"}`}>
                                    {b.change >= 0 ? "+" : ""}{b.change.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono">
                                    {b.vsWti === null ? (
                                        <span className="text-concrete-gray">--</span>
                                    ) : (
                                        <span className={b.vsWti >= 0 ? "text-forest-green" : "text-safety-red"}>
                                            {b.vsWti >= 0 ? "+" : ""}{b.vsWti.toFixed(2)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

// ============================================
// CRACK SPREADS COMPONENT
// ============================================

function CrackSpreads({ wtiPrice }: { wtiPrice: number }) {
    // Estimated product prices based on WTI
    // RBOB Gasoline typically trades at WTI + $15-25/bbl
    // Heating Oil/Diesel typically trades at WTI + $20-30/bbl
    const gasPrice = wtiPrice + 20; // $/bbl equivalent
    const dieselPrice = wtiPrice + 25;

    // 3-2-1 Crack Spread = (2 × Gas + 1 × Diesel) / 3 - Crude
    const crackSpread = ((2 * gasPrice + 1 * dieselPrice) / 3) - wtiPrice;

    // Determine margin status
    let marginStatus: "strong" | "moderate" | "weak";
    let marginColor: string;
    let marginText: string;

    if (crackSpread > 15) {
        marginStatus = "strong";
        marginColor = "text-forest-green";
        marginText = "Strong refining margins";
    } else if (crackSpread >= 8) {
        marginStatus = "moderate";
        marginColor = "text-yellow-600";
        marginText = "Moderate margins";
    } else {
        marginStatus = "weak";
        marginColor = "text-safety-red";
        marginText = "Weak margins";
    }

    return (
        <Card padding="none" className="overflow-hidden">
            <CardHeader className="px-6 py-4 border-b-2 border-black">
                <CardTitle>3-2-1 Crack Spread</CardTitle>
            </CardHeader>

            <div className="p-6">
                {/* Formula Display */}
                <div className="bg-gray-50 border border-gray-200 p-4 mb-6 font-mono text-sm">
                    <p className="text-concrete-gray mb-2">Formula:</p>
                    <p className="text-black">
                        Crack = (2 × Gasoline + 1 × Diesel) / 3 - Crude
                    </p>
                    <p className="text-black mt-2">
                        Crack = (2 × ${gasPrice.toFixed(2)} + 1 × ${dieselPrice.toFixed(2)}) / 3 - ${wtiPrice.toFixed(2)}
                    </p>
                </div>

                {/* Result */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-concrete-gray mb-1">
                            Current Crack Spread
                        </p>
                        <p className={`font-mono text-4xl font-bold ${marginColor}`}>
                            ${crackSpread.toFixed(2)}/bbl
                        </p>
                    </div>

                    <div className="text-right">
                        <Badge
                            variant={marginStatus === "strong" ? "success" : marginStatus === "moderate" ? "warning" : "danger"}
                            size="lg"
                        >
                            {marginText}
                        </Badge>
                        <p className="text-xs text-concrete-gray mt-2">
                            {marginStatus === "strong"
                                ? "Refiners are profitable"
                                : marginStatus === "moderate"
                                    ? "Refiners are marginally profitable"
                                    : "Refiners may cut runs"
                            }
                        </p>
                    </div>
                </div>

                {/* Component Breakdown */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">WTI Crude</p>
                        <p className="font-mono text-lg font-semibold">${wtiPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">RBOB Gasoline</p>
                        <p className="font-mono text-lg font-semibold text-forest-green">${gasPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">Heating Oil</p>
                        <p className="font-mono text-lg font-semibold text-forest-green">${dieselPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ============================================
// FUTURES CURVE COMPONENT
// ============================================

function FuturesCurve({ curve, wtiPrice }: { curve: FuturesCurveData | null; wtiPrice: number }) {
    // Use provided curve or generate demo data
    const data = curve || {
        spot: wtiPrice,
        m1: wtiPrice + 0.25,
        m2: wtiPrice + 0.50,
        m3: wtiPrice + 0.75,
        m6: wtiPrice + 1.50,
        m12: wtiPrice + 2.50,
        isContango: true,
        slope: 0.21,
        annualizedContango: 3.5
    };

    const spotVs3M = data.m3 - data.spot;
    const isContango = spotVs3M > 0;

    // Simple bar chart using divs
    const maxPrice = Math.max(data.spot, data.m1, data.m2, data.m3, data.m6, data.m12);
    const minPrice = Math.min(data.spot, data.m1, data.m2, data.m3, data.m6, data.m12);
    const range = maxPrice - minPrice || 1;

    const getHeight = (price: number) => {
        const normalized = (price - minPrice) / range;
        return 50 + normalized * 100; // 50-150px range
    };

    const points = [
        { label: "Spot", price: data.spot },
        { label: "M1", price: data.m1 },
        { label: "M2", price: data.m2 },
        { label: "M3", price: data.m3 },
        { label: "M6", price: data.m6 },
        { label: "M12", price: data.m12 }
    ];

    return (
        <Card padding="none" className="overflow-hidden">
            <CardHeader className="px-6 py-4 border-b-2 border-black">
                <div className="flex items-center justify-between">
                    <CardTitle>WTI Futures Curve</CardTitle>
                    <Badge variant={isContango ? "success" : "warning"} size="sm">
                        {isContango ? "CONTANGO" : "BACKWARDATION"}
                    </Badge>
                </div>
            </CardHeader>

            <div className="p-6">
                {/* Interpretation */}
                <div className={`p-4 mb-6 border-l-4 ${isContango ? "border-forest-green bg-green-50" : "border-yellow-500 bg-yellow-50"}`}>
                    <p className="font-semibold">
                        {isContango
                            ? `Contango: +$${spotVs3M.toFixed(2)}/bbl (3M forward)`
                            : `Backwardation: -$${Math.abs(spotVs3M).toFixed(2)}/bbl (3M forward)`
                        }
                    </p>
                    <p className="text-sm text-concrete-gray mt-1">
                        {isContango
                            ? "Storage may be profitable. Forward prices exceed spot."
                            : "Sell now is favorable. Spot prices exceed forward."
                        }
                    </p>
                </div>

                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between gap-4 h-48 px-4">
                    {points.map((point, idx) => (
                        <div key={point.label} className="flex flex-col items-center flex-1">
                            {/* Price label on top */}
                            <span className="font-mono text-xs mb-1">
                                ${point.price.toFixed(2)}
                            </span>
                            {/* Bar */}
                            <div
                                className={`w-full transition-all duration-300 ${idx === 0
                                    ? "bg-black"
                                    : isContango
                                        ? "bg-forest-green"
                                        : "bg-yellow-500"
                                    }`}
                                style={{ height: `${getHeight(point.price)}px` }}
                            />
                            {/* Month label */}
                            <span className="text-xs text-concrete-gray mt-2 font-semibold">
                                {point.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">Spot → 3M Spread</p>
                        <p className={`font-mono text-lg font-semibold ${isContango ? "text-forest-green" : "text-yellow-600"}`}>
                            {isContango ? "+" : ""}{spotVs3M.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">Annualized %</p>
                        <p className="font-mono text-lg font-semibold">
                            {data.annualizedContango.toFixed(1)}%
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs uppercase text-concrete-gray mb-1">Monthly Slope</p>
                        <p className="font-mono text-lg font-semibold">
                            ${data.slope.toFixed(2)}/mo
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function MarketIntelPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch market prices
    const { data: marketData, error: marketError, isLoading: marketLoading, mutate: mutateMarket } = useSWR<MarketData>(
        `/api/market?refresh=${refreshKey}`,
        fetcher,
        { refreshInterval: 60000 } // Refresh every minute
    );

    // Fetch futures curve
    const { data: futuresData, mutate: mutateFutures } = useSWR(
        `/api/futures/curve?refresh=${refreshKey}`,
        fetcher,
        { refreshInterval: 300000 } // Refresh every 5 minutes
    );

    const handleRefresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
        mutateMarket();
        mutateFutures();
    }, [mutateMarket, mutateFutures]);

    const wtiPrice = marketData?.prices?.wti?.price || 72;
    const brentPrice = marketData?.prices?.brent?.price || 76;
    const lastUpdated = marketData?.lastUpdated || new Date().toISOString();

    if (marketLoading) {
        return (
            <MainLayout>
                <div className="p-2">
                    <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
                        Market Intelligence
                    </h1>
                    <div className="animate-pulse space-y-6">
                        <div className="h-64 bg-gray-200" />
                        <div className="h-48 bg-gray-200" />
                        <div className="h-64 bg-gray-200" />
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (marketError) {
        return (
            <MainLayout>
                <div className="p-2">
                    <h1 className="text-3xl font-bold uppercase tracking-tight mb-8">
                        Market Intelligence
                    </h1>
                    <Card className="p-8 text-center">
                        <p className="text-safety-red mb-4">Failed to load market data</p>
                        <Button onClick={handleRefresh}>Retry</Button>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="p-2">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold uppercase tracking-tight">
                        Market Intelligence
                    </h1>
                </div>

                {/* Section 1: Price Table */}
                <div className="mb-8">
                    <PriceTable
                        wtiPrice={wtiPrice}
                        brentPrice={brentPrice}
                        lastUpdated={lastUpdated}
                        onRefresh={handleRefresh}
                    />
                </div>

                {/* Section 2: Crack Spreads */}
                <div className="mb-8">
                    <CrackSpreads wtiPrice={wtiPrice} />
                </div>

                {/* Section 3: Futures Curve */}
                <div className="mb-8">
                    <FuturesCurve
                        curve={futuresData?.curve}
                        wtiPrice={wtiPrice}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
