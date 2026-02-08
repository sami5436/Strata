"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import { useSetupStore } from "@/lib/store";
import { fetchMarketPrices, MarketDataResponse } from "@/lib/api";

/**
 * Info icon component for widget tooltips
 */
function InfoIcon({ tooltip }: { tooltip: string }) {
    return (
        <span
            className="text-concrete-gray hover:text-black cursor-help text-sm ml-1"
            title={tooltip}
        >
            ⓘ
        </span>
    );
}

/**
 * YourCrudeValueWidget - Hero metric showing user's crude value
 * 96px monospace price with quality differential calculation
 */
export function YourCrudeValueWidget() {
    const store = useSetupStore();
    const { data: marketData } = useSWR<MarketDataResponse>("/api/market", fetchMarketPrices);

    const wtiPrice = marketData?.prices?.wti?.price;
    const wtiChange = marketData?.prices?.wti?.change || 0;

    // Calculate quality differential
    // Light premium: (API - 30) × $0.50/degree
    // Sweet premium: (0.5 - Sulfur%) × $10/point
    const hasUserSpecs = store.apiGravity > 0 || store.sulfurContent > 0;

    let yourCrudePrice: number | null = null;
    let totalDifferential = 0;

    if (wtiPrice && hasUserSpecs) {
        const lightPremium = (store.apiGravity - 30) * 0.5;
        const sweetPremium = (0.5 - store.sulfurContent) * 10;
        totalDifferential = lightPremium + sweetPremium;
        yourCrudePrice = wtiPrice + totalDifferential;
    } else if (wtiPrice) {
        yourCrudePrice = wtiPrice;
    }

    const totalChange = wtiChange; // Differential doesn't change daily
    const isPositiveChange = totalChange >= 0;

    return (
        <Card padding="none" className="h-full flex flex-col">
            <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                <div className="flex items-center">
                    <CardTitle>Your Crude Value</CardTitle>
                    <InfoIcon tooltip="Your estimated crude oil market value based on WTI benchmark plus quality differential from API gravity and sulfur content" />
                </div>
                {store.crudeClassification && (
                    <div className="flex gap-2">
                        <Badge variant={store.crudeClassification.density === "Light" ? "light" : store.crudeClassification.density === "Heavy" ? "heavy" : "default"} size="sm">
                            {store.crudeClassification.density}
                        </Badge>
                        <Badge variant={store.crudeClassification.sulfur === "Sweet" ? "sweet" : "sour"} size="sm">
                            {store.crudeClassification.sulfur}
                        </Badge>
                    </div>
                )}
            </CardHeader>

            <div className="px-6 pb-6 flex-1 flex flex-col justify-center">
                {/* Hero Price - Responsive Text Size */}
                <div className="flex items-baseline gap-2">
                    <span className="font-mono font-bold text-4xl sm:text-6xl md:text-metric-xl leading-none" data-metric>
                        {yourCrudePrice !== null ? `$${yourCrudePrice.toFixed(2)}` : "--.--"}
                    </span>
                    <span className="font-mono text-2xl text-concrete-gray">/bbl</span>
                </div>

                {/* Change indicator */}
                <div className={`flex items-center gap-2 mt-2 ${isPositiveChange ? "text-forest-green" : "text-safety-red"}`}>
                    <span className="text-lg font-bold">{isPositiveChange ? "▲" : "▼"}</span>
                    <span className="font-mono text-lg font-semibold">
                        {isPositiveChange ? "+" : ""}{totalChange.toFixed(2)}
                    </span>
                    <span className="text-sm text-concrete-gray">vs. yesterday</span>
                </div>

                {/* Breakdown */}
                <div className="mt-4 pt-4 border-t-2 border-black">
                    <p className="text-sm text-concrete-gray">
                        WTI <span className="font-mono font-semibold text-black">{wtiPrice ? `$${wtiPrice.toFixed(2)}` : "--.--"}</span>
                        {" "}
                        <span className={`font-mono font-semibold ${totalDifferential >= 0 ? "text-forest-green" : "text-safety-red"}`}>
                            {totalDifferential >= 0 ? "+" : "-"}${Math.abs(totalDifferential).toFixed(2)} quality premium
                        </span>
                    </p>
                    <p className="text-xs text-concrete-gray mt-1 font-mono">
                        API {store.apiGravity}° • Sulfur {store.sulfurContent.toFixed(1)}%
                    </p>
                </div>
            </div>
        </Card>
    );
}

/**
 * BestOpportunityWidget - Shows highest-value trading opportunity
 * Fetches real arbitrage data from /api/arbitrage/detect
 */
export function BestOpportunityWidget() {
    const store = useSetupStore();

    // Build query params for API call
    const queryParams = new URLSearchParams({
        companyType: store.companyType || "producer",
        dailyProduction: String(store.dailyProduction || 0),
        refiningCapacity: String(store.refiningCapacity || 0),
        apiGravity: String(store.apiGravity || 35),
        sulfurContent: String(store.sulfurContent || 0.3),
        crudeDensity: store.crudeClassification?.density || "Light",
        crudeSulfur: store.crudeClassification?.sulfur || "Sweet",
        crudeLabel: store.crudeClassification?.label || "Light Sweet",
        productionBasin: store.productionBasin || "permian_midland"
    });

    // Fetch arbitrage opportunities
    const { data, error, isLoading } = useSWR(
        `/api/arbitrage/detect?${queryParams.toString()}`,
        async (url: string) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        }
    );

    // Loading state
    if (isLoading) {
        return (
            <Card padding="none" variant="highlight" className="h-full flex flex-col">
                <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                    <div className="flex items-center">
                        <CardTitle>Best Opportunity</CardTitle>
                        <InfoIcon tooltip="The highest-value trading opportunity currently available based on market conditions and your company profile" />
                    </div>
                </CardHeader>
                <div className="px-6 pb-6 flex-1 flex items-center justify-center">
                    <p className="text-concrete-gray animate-pulse">Analyzing opportunities...</p>
                </div>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card padding="none" variant="highlight" className="h-full flex flex-col">
                <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                    <div className="flex items-center">
                        <CardTitle>Best Opportunity</CardTitle>
                        <InfoIcon tooltip="The highest-value trading opportunity currently available based on market conditions and your company profile" />
                    </div>
                </CardHeader>
                <div className="px-6 pb-6 flex-1 flex items-center justify-center">
                    <p className="text-safety-red text-sm">Unable to calculate opportunities</p>
                </div>
            </Card>
        );
    }

    // No opportunities or not eligible
    if (!data?.opportunities?.length) {
        return (
            <Card padding="none" variant="highlight" className="h-full flex flex-col">
                <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                    <div className="flex items-center">
                        <CardTitle>Best Opportunity</CardTitle>
                        <InfoIcon tooltip="The highest-value trading opportunity currently available based on market conditions and your company profile" />
                    </div>
                    <Badge variant="default" size="sm">
                        N/A
                    </Badge>
                </CardHeader>
                <div className="px-6 pb-6 flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-2 text-concrete-gray">
                        {data?.status === "not_eligible" ? "Upgrade Required" : "No Opportunities"}
                    </h3>
                    <p className="text-concrete-gray text-sm">
                        {data?.message || "No arbitrage opportunities detected at current spreads."}
                    </p>
                </div>
            </Card>
        );
    }

    // Show best opportunity
    const opportunity = data.opportunities[0];
    const profitFormatted = opportunity.dailyProfit >= 1000000
        ? `$${(opportunity.dailyProfit / 1000000).toFixed(1)}M`
        : `$${(opportunity.dailyProfit / 1000).toFixed(0)}K`;

    return (
        <Card padding="none" variant="highlight" className="h-full flex flex-col">
            <CardHeader className="px-6 pt-6 pb-4 mb-0 border-b-0">
                <div className="flex items-center">
                    <CardTitle>Best Opportunity</CardTitle>
                    <InfoIcon tooltip="The highest-value trading opportunity currently available based on market conditions and your company profile" />
                </div>
                <Badge variant="success" size="sm">
                    +{profitFormatted}/DAY
                </Badge>
            </CardHeader>

            <div className="px-6 pb-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">
                    {opportunity.title}
                </h3>
                <p className="text-concrete-gray text-sm mb-3">
                    {opportunity.description}
                </p>

                {/* Math breakdown */}
                <div className="bg-gray-50 border border-gray-200 p-3 mb-3">
                    <p className="text-xs text-concrete-gray uppercase tracking-wider mb-1">Calculation</p>
                    <p className="font-mono text-sm text-black">
                        {opportunity.calculation?.formula}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-concrete-gray">
                        <span>Sell: <span className="text-forest-green font-semibold">${opportunity.calculation?.sellPrice?.toFixed(2)}</span></span>
                        <span>Buy: <span className="text-black font-semibold">${opportunity.calculation?.buyPrice?.toFixed(2)}</span></span>
                        <span>Spread: <span className="text-forest-green font-semibold">${opportunity.calculation?.spread?.toFixed(2)}</span></span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-concrete-gray">Confidence:</span>
                    <div className="flex-1 h-2 bg-gray-200">
                        <div
                            className="h-full bg-forest-green"
                            style={{ width: `${opportunity.confidence}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono font-semibold">{opportunity.confidence}%</span>
                </div>

                <Link href="/opportunities" className="mt-auto">
                    <Button size="lg" className="w-full">
                        View Details →
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

/**
 * ProductionMetricsWidget - Full-width horizontal card showing key production metrics
 * Now supports multiple crude streams
 */
export function ProductionMetricsWidget() {
    const store = useSetupStore();

    const showProduction = store.companyType === "producer" || store.companyType === "integrated";
    const showRefining = store.companyType === "refiner" || store.companyType === "integrated";

    // Calculate utilization if both production and refining
    const utilization = store.companyType === "integrated" && store.refiningCapacity > 0
        ? Math.min((store.dailyProduction / store.refiningCapacity) * 100, 100)
        : null;

    const hasMultipleStreams = store.crudeStreams && store.crudeStreams.length > 1;

    return (
        <Card padding="none" className="w-full">
            {/* Top Row: Key Metrics - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-gray-200 divide-y divide-gray-200 lg:divide-y-0 lg:divide-x">
                {/* Daily Production */}
                {showProduction && (
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                            Daily Production
                        </p>
                        <p className="font-mono text-xl md:text-2xl font-bold text-forest-green">
                            {store.dailyProduction.toLocaleString()}
                        </p>
                        <p className="text-xs text-concrete-gray">BPD</p>
                    </div>
                )}

                {/* Blended Specs (Weighted Average) */}
                {showProduction && (
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                            {hasMultipleStreams ? "Blended Specs" : "Crude Specs"}
                        </p>
                        <div className="flex justify-center items-baseline gap-2">
                            <span className="font-mono text-lg md:text-xl font-bold">{store.apiGravity}°</span>
                            <span className="text-concrete-gray">/</span>
                            <span className="font-mono text-lg md:text-xl font-bold">{store.sulfurContent.toFixed(2)}%</span>
                        </div>
                        <p className="text-xs text-concrete-gray">API / Sulfur</p>
                    </div>
                )}

                {/* Classification */}
                {store.crudeClassification && showProduction && (
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                            Classification
                        </p>
                        <div className="flex justify-center gap-2">
                            <Badge variant={store.crudeClassification.density === "Light" ? "light" : store.crudeClassification.density === "Heavy" ? "heavy" : "default"}>
                                {store.crudeClassification.density}
                            </Badge>
                            <Badge variant={store.crudeClassification.sulfur === "Sweet" ? "sweet" : "sour"}>
                                {store.crudeClassification.sulfur}
                            </Badge>
                        </div>
                        <p className="text-xs text-concrete-gray mt-1">{store.crudeClassification.label}</p>
                    </div>
                )}

                {/* Refining Capacity */}
                {showRefining && (
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                            Refining Capacity
                        </p>
                        <p className="font-mono text-xl md:text-2xl font-bold text-signal-amber">
                            {store.refiningCapacity.toLocaleString()}
                        </p>
                        <p className="text-xs text-concrete-gray">BPD</p>
                    </div>
                )}

                {/* Utilization (for Integrated) */}
                {utilization !== null && (
                    <div className="p-4 text-center">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                            Utilization
                        </p>
                        <p className={`font-mono text-xl md:text-2xl font-bold ${utilization >= 80 ? "text-forest-green" : utilization >= 50 ? "text-signal-amber" : "text-safety-red"}`}>
                            {utilization.toFixed(0)}%
                        </p>
                        <div className="w-full h-1.5 bg-gray-200 mt-1">
                            <div
                                className={`h-full ${utilization >= 80 ? "bg-forest-green" : utilization >= 50 ? "bg-signal-amber" : "bg-safety-red"}`}
                                style={{ width: `${utilization}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Benchmark */}
                <div className="p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-concrete-gray mb-1">
                        Benchmark
                    </p>
                    <p className="font-mono text-xl md:text-2xl font-bold">
                        {store.primaryBenchmark}
                    </p>
                    <p className="text-xs text-concrete-gray">Primary Index</p>
                </div>
            </div>

            {/* Bottom Row: Crude Streams (only if multiple streams) - Compact inline display */}
            {showProduction && hasMultipleStreams && store.crudeStreams && (
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-concrete-gray whitespace-nowrap">
                        Streams:
                    </span>
                    <div className="flex gap-4 overflow-x-auto">
                        {store.crudeStreams.map((stream, index) => (
                            <div key={stream.id} className="flex items-center gap-2 whitespace-nowrap">
                                <span className="bg-black text-white text-[10px] font-bold px-1 py-0.5">
                                    {index + 1}
                                </span>
                                <span className="text-xs font-semibold">{stream.name}</span>
                                <span className="font-mono text-xs font-bold text-forest-green">
                                    {stream.percentage}%
                                </span>
                                <span className="text-[10px] text-concrete-gray">
                                    ({stream.apiGravity}° / {stream.sulfurContent.toFixed(1)}%)
                                </span>
                                <Badge
                                    variant={stream.classification.sulfur === "Sweet" ? "sweet" : "sour"}
                                    size="sm"
                                >
                                    {stream.classification.density} {stream.classification.sulfur}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
