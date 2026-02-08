"use client";

import { MainLayout } from "@/components/layout";
import { MarketPricesWidget } from "@/components/widgets";
import {
    Card,
    CardHeader,
    CardTitle,
    MetricDisplay,
    Button,
    Badge,
} from "@/components/ui";
import { useSetupStore } from "@/lib/store";

/**
 * Dashboard Page - Main trading intelligence view
 */
export default function DashboardPage() {
    const store = useSetupStore();
    const hasSetup = store.companyName && store.companyType;

    return (
        <MainLayout>
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-tight mb-1">
                    Trading Dashboard
                </h1>
                <p className="text-concrete-gray uppercase tracking-wider text-sm">
                    {hasSetup
                        ? `${store.companyName} • ${store.companyType?.toUpperCase()}`
                        : "Configure your company profile to unlock personalized insights"
                    }
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Hero Metrics */}
                <div className="col-span-8 space-y-6">
                    {/* Your Crude Value (if Producer/Integrated) */}
                    {(store.companyType === "producer" || store.companyType === "integrated") && store.crudeClassification && (
                        <Card padding="lg">
                            <CardHeader>
                                <CardTitle>Your Crude Value</CardTitle>
                                <div className="flex gap-2">
                                    <Badge variant={store.crudeClassification.density === "Light" ? "light" : store.crudeClassification.density === "Heavy" ? "heavy" : "default"}>
                                        {store.crudeClassification.density}
                                    </Badge>
                                    <Badge variant={store.crudeClassification.sulfur === "Sweet" ? "sweet" : "sour"}>
                                        {store.crudeClassification.sulfur}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <MetricDisplay
                                value="$82.50"
                                label="Estimated Market Price"
                                unit="/bbl"
                                size="xl"
                            />
                            <div className="mt-4 pt-4 border-t-2 border-black">
                                <p className="text-sm text-concrete-gray">
                                    WTI $80.00 + <span className="text-forest-green font-semibold">$2.50 quality premium</span>
                                </p>
                                <p className="text-xs text-concrete-gray mt-1 font-mono">
                                    API {store.apiGravity}° • Sulfur {store.sulfurContent.toFixed(1)}%
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Best Opportunity */}
                    <Card padding="lg" variant="highlight">
                        <CardHeader>
                            <CardTitle>Best Opportunity</CardTitle>
                            <Badge variant="success" size="sm">+$180K/DAY</Badge>
                        </CardHeader>
                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">
                            Quality Arbitrage
                        </h3>
                        <p className="text-concrete-gray mb-4">
                            {store.companyType === "integrated"
                                ? "Sell your Light Sweet crude, buy Heavy Sour for refinery processing."
                                : "Opportunity to capture quality spreads in current market."
                            }
                        </p>
                        <Button size="lg">View Details →</Button>
                    </Card>

                    {/* Production/Refining Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {(store.companyType === "producer" || store.companyType === "integrated") && (
                            <Card padding="md">
                                <MetricDisplay
                                    value={store.dailyProduction.toLocaleString()}
                                    label="Daily Production"
                                    unit="BPD"
                                    size="md"
                                />
                            </Card>
                        )}
                        {(store.companyType === "refiner" || store.companyType === "integrated") && (
                            <Card padding="md">
                                <MetricDisplay
                                    value={store.refiningCapacity.toLocaleString()}
                                    label="Refining Capacity"
                                    unit="BPD"
                                    size="md"
                                />
                            </Card>
                        )}
                        <Card padding="md">
                            <MetricDisplay
                                value="14.50"
                                label="Crack Spread"
                                unit="$/bbl"
                                size="md"
                                trend="up"
                            />
                        </Card>
                    </div>
                </div>

                {/* Right Column - Market Data */}
                <div className="col-span-4 space-y-6">
                    {/* Market Prices Widget */}
                    <MarketPricesWidget />

                    {/* Quick Actions */}
                    <Card padding="md">
                        <CardTitle>Quick Actions</CardTitle>
                        <div className="space-y-2 mt-4">
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                ⊞ Refine vs. Sell Calculator
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                ⊞ Storage Economics
                            </Button>
                            <Button variant="secondary" size="md" className="w-full justify-start">
                                ⊞ Grade Swap Analysis
                            </Button>
                        </div>
                    </Card>

                    {/* Setup Prompt (if not configured) */}
                    {!hasSetup && (
                        <Card padding="md" variant="warning">
                            <CardTitle>Setup Required</CardTitle>
                            <p className="text-sm text-concrete-gray mt-2">
                                Configure your company profile to see personalized trading opportunities.
                            </p>
                            <Button variant="primary" size="md" className="w-full mt-4">
                                Complete Setup →
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
