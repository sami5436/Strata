"use client";

import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { MainLayout } from "@/components/layout";
import { Card, Button, Badge, Slider } from "@/components/ui";
import { useSetupStore } from "@/lib/store";
import type { ArbitrageOpportunity, ArbitrageResult } from "@/lib/domain/arbitrage";

/**
 * Opportunity Explorer - Responsive List + Detail View
 * 
 * Mobile: Stacked - cards then detail below selected
 * Desktop: Side-by-side 60% cards / 40% detail
 */
export default function OpportunitiesPage() {
    const store = useSetupStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sensitivitySpread, setSensitivitySpread] = useState<number>(18);
    const [showDetail, setShowDetail] = useState(false);

    // Build query params for API call
    const queryParams = new URLSearchParams({
        companyType: store.companyType || "producer",
        dailyProduction: String(store.dailyProduction || 0),
        refiningCapacity: String(store.refiningCapacity || 0),
        apiGravity: String(store.apiGravity || 35),
        sulfurContent: String(store.sulfurContent || 0.3),
        crudeDensity: store.crudeClassification?.density || "Light",
        crudeSulfur: store.crudeClassification?.sulfur || "Sweet",
        crudeLabel: store.crudeClassification?.label || "Light Sweet"
    });

    // Fetch opportunities
    const { data, error, isLoading } = useSWR<ArbitrageResult>(
        `/api/arbitrage/detect?${queryParams.toString()}`,
        async (url: string) => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        }
    );

    const opportunities = useMemo(
        () => data?.opportunities || [],
        [data?.opportunities]
    );
    const selectedOpportunity = useMemo(
        () => opportunities.find((o) => o.id === selectedId) || null,
        [opportunities, selectedId]
    );

    // Auto-select first opportunity if none selected
    if (!selectedId && opportunities.length > 0) {
        setSelectedId(opportunities[0].id);
    }

    // Initialize sensitivity slider with current spread
    useEffect(() => {
        if (selectedOpportunity?.calculation?.spread) {
            setSensitivitySpread(selectedOpportunity.calculation.spread);
        }
    }, [selectedOpportunity?.calculation?.spread]);

    // Calculate sensitivity profit
    const sensitivityProfit = useMemo(() => {
        if (!selectedOpportunity?.calculation) return 0;
        return sensitivitySpread * selectedOpportunity.calculation.volume;
    }, [sensitivitySpread, selectedOpportunity]);

    const breakEvenSpread = 10; // Minimum profitable spread

    const handleSelectOpportunity = (id: string) => {
        setSelectedId(id);
        setShowDetail(true);
    };

    return (
        <MainLayout>
            {/* Mobile: Show back button when viewing detail */}
            {showDetail && selectedOpportunity && (
                <div className="lg:hidden mb-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowDetail(false)}
                    >
                        ← Back to List
                    </Button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full" style={{ minHeight: "calc(100vh - 140px)" }}>
                {/* ===== LEFT: Opportunity Cards (100% mobile, 60% desktop) ===== */}
                <div className={`w-full lg:w-3/5 overflow-y-auto lg:pr-2 ${showDetail ? "hidden lg:block" : "block"}`}>
                    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4">
                        Opportunity Explorer
                    </h1>

                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-concrete-gray animate-pulse">Analyzing opportunities...</p>
                        </div>
                    )}

                    {error && (
                        <Card padding="lg" className="text-center">
                            <p className="text-safety-red">Failed to load opportunities</p>
                        </Card>
                    )}

                    {!isLoading && !error && opportunities.length === 0 && (
                        <Card padding="lg" className="text-center">
                            <h2 className="text-lg md:text-xl font-bold uppercase mb-2 text-concrete-gray">
                                No Opportunities Available
                            </h2>
                            <p className="text-concrete-gray text-sm">
                                {data?.message || "Check back when market conditions change."}
                            </p>
                        </Card>
                    )}

                    {/* Opportunity Cards */}
                    <div className="space-y-3 md:space-y-4">
                        {opportunities.map((opp) => (
                            <OpportunityCard
                                key={opp.id}
                                opportunity={opp}
                                isSelected={selectedId === opp.id}
                                onSelect={() => handleSelectOpportunity(opp.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* ===== RIGHT: Detail Panel (100% mobile, 40% desktop) ===== */}
                <div className={`w-full lg:w-2/5 lg:sticky lg:top-0 lg:h-fit ${!showDetail ? "hidden lg:block" : "block"}`}>
                    {!selectedOpportunity ? (
                        <Card padding="lg" className="h-full flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
                            <div className="text-center">
                                <p className="text-concrete-gray text-base lg:text-lg">
                                    Select an opportunity to view details
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card padding="none" className="overflow-hidden">
                            {/* Header */}
                            <div className="bg-black text-white p-3 md:p-4">
                                <Badge
                                    variant={selectedOpportunity.type === "quality" ? "success" : "default"}
                                    size="sm"
                                    className="mb-2"
                                >
                                    {selectedOpportunity.title}
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-mono font-bold text-forest-green">
                                    +${selectedOpportunity.dailyProfit.toLocaleString()}/day
                                </h2>
                                <p className="text-gray-400 text-xs md:text-sm mt-1">
                                    ${(selectedOpportunity.annualProfit / 1000000).toFixed(1)}M annually
                                </p>
                            </div>

                            {/* Section 1: The Math */}
                            <div className="p-3 md:p-4 border-b-2 border-black">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-concrete-gray mb-2 md:mb-3">
                                    The Math
                                </h3>
                                <pre className="font-mono text-xs md:text-sm bg-gray-50 p-2 md:p-3 border border-gray-200 overflow-x-auto whitespace-pre-wrap">
                                    {`Your:  ${selectedOpportunity.calculation.volume.toLocaleString()} bpd × $${selectedOpportunity.calculation.sellPrice.toFixed(2)}
Alt:   ${selectedOpportunity.calculation.volume.toLocaleString()} bpd × $${selectedOpportunity.calculation.buyPrice.toFixed(2)}
─────────────────────────
Net:   +$${selectedOpportunity.dailyProfit.toLocaleString()}/day`}
                                </pre>
                            </div>

                            {/* Section 2: The Trade */}
                            <div className="p-3 md:p-4 border-b-2 border-black">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-concrete-gray mb-2 md:mb-3">
                                    The Trade
                                </h3>
                                <div className="space-y-2 md:space-y-3">
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <span className="bg-forest-green text-white text-xs font-bold px-2 py-1 flex-shrink-0">1</span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-xs md:text-sm">Sell your {store.crudeClassification?.label || "Light Sweet"}</p>
                                            <p className="text-concrete-gray text-xs truncate">→ Gulf Coast @ ${selectedOpportunity.calculation.sellPrice.toFixed(2)}/bbl</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 md:gap-3">
                                        <span className="bg-signal-amber text-white text-xs font-bold px-2 py-1 flex-shrink-0">2</span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-xs md:text-sm">Buy Heavy Sour (Mars/WCS)</p>
                                            <p className="text-concrete-gray text-xs truncate">→ Deliver @ ${selectedOpportunity.calculation.buyPrice.toFixed(2)}/bbl</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 p-2 md:p-3 mt-2">
                                        <p className="text-xs uppercase tracking-wider text-concrete-gray mb-1">Logistics</p>
                                        <p className="text-xs md:text-sm">Requires 500K BBL storage + 2 week lead time</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-concrete-gray mb-1">Risks</p>
                                        <ul className="space-y-1">
                                            {selectedOpportunity.risks.map((risk, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs md:text-sm">
                                                    <span className="text-safety-red flex-shrink-0">⚠</span>
                                                    <span className="break-words">{risk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Sensitivity */}
                            <div className="p-3 md:p-4 border-b-2 border-black">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-concrete-gray mb-2 md:mb-3">
                                    Sensitivity Analysis
                                </h3>
                                <p className="text-xs md:text-sm text-concrete-gray mb-2 md:mb-3">
                                    What if the spread changes?
                                </p>
                                <Slider
                                    value={sensitivitySpread}
                                    min={5}
                                    max={30}
                                    step={0.5}
                                    unit="$/bbl"
                                    onChange={setSensitivitySpread}
                                />
                                <div className="mt-3 md:mt-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-concrete-gray">At ${sensitivitySpread.toFixed(2)}/bbl:</p>
                                        <p className={`font-mono text-lg md:text-xl font-bold ${sensitivityProfit > 0 ? "text-forest-green" : "text-safety-red"}`}>
                                            ${sensitivityProfit.toLocaleString()}/day
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-concrete-gray">Break-even:</p>
                                        <p className="font-mono font-bold text-sm md:text-base">${breakEvenSpread}/bbl</p>
                                    </div>
                                </div>
                                {sensitivitySpread < breakEvenSpread && (
                                    <p className="text-safety-red text-xs md:text-sm mt-2">
                                        ⚠ Below break-even threshold
                                    </p>
                                )}
                            </div>

                            {/* Section 4: Actions */}
                            <div className="p-3 md:p-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-concrete-gray mb-2 md:mb-3">
                                    Actions
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                    <Button variant="primary" size="md" className="flex-1">
                                        Set Alert
                                    </Button>
                                    <Button variant="secondary" size="md" className="flex-1">
                                        Save Scenario
                                    </Button>
                                    <Button variant="secondary" size="md" className="flex-1 opacity-50 cursor-not-allowed" disabled>
                                        Export PDF
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

/**
 * Opportunity Card Component
 */
function OpportunityCard({
    opportunity,
    isSelected,
    onSelect,
}: {
    opportunity: ArbitrageOpportunity;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const profitFormatted = opportunity.dailyProfit >= 1000000
        ? `$${(opportunity.dailyProfit / 1000000).toFixed(1)}M`
        : `$${(opportunity.dailyProfit / 1000).toFixed(0)}K`;

    return (
        <button
            onClick={onSelect}
            className={`
                w-full text-left p-3 md:p-4 bg-white transition-none
                ${isSelected ? "border-4 border-black" : "border-2 border-black hover:bg-gray-50"}
            `}
        >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2 md:mb-3">
                <Badge
                    variant={opportunity.type === "quality" ? "success" : "default"}
                    size="sm"
                >
                    {opportunity.title}
                </Badge>
                <span className="font-mono text-xl md:text-2xl font-bold text-forest-green">
                    +{profitFormatted}/day
                </span>
            </div>

            <p className="text-concrete-gray text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                {opportunity.description}
            </p>

            {/* Confidence Bar */}
            <div className="flex items-center gap-2 md:gap-3">
                <span className="text-[10px] md:text-xs text-concrete-gray uppercase tracking-wider">Confidence</span>
                <div className="flex-1 h-2 bg-gray-200">
                    <div
                        className={`h-full ${opportunity.confidence >= 75 ? "bg-forest-green" : opportunity.confidence >= 50 ? "bg-signal-amber" : "bg-safety-red"}`}
                        style={{ width: `${opportunity.confidence}%` }}
                    />
                </div>
                <span className="font-mono text-xs md:text-sm font-bold">{opportunity.confidence}%</span>
            </div>
        </button>
    );
}
