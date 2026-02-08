"use client";

import { MainLayout } from "@/components/layout";
import {
    MarketPricesWidget,
    QuickCalculatorWidget,
    YourCrudeValueWidget,
    BestOpportunityWidget,
    ProductionMetricsWidget,
} from "@/components/widgets";
import { useSetupStore } from "@/lib/store";
import Link from "next/link";
import { Button, Card, CardTitle } from "@/components/ui";

/**
 * Dashboard Page - Production Metrics Banner + 2×2 Grid Layout
 * 
 * Top: Full-width production metrics bar
 * Widget 1: Your Crude Value (Top Left)
 * Widget 2: Best Opportunity (Top Right)
 * Widget 3: Market Overview (Bottom Left)
 * Widget 4: Quick Calculator (Bottom Right)
 */
export default function DashboardPage() {
    const store = useSetupStore();
    const hasSetup = store.companyName && store.companyType;

    // If not set up, show setup prompt
    if (!hasSetup) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full">
                    <Card padding="lg" className="max-w-md text-center">
                        <CardTitle>Setup Required</CardTitle>
                        <p className="text-concrete-gray mt-4 mb-6">
                            Configure your company profile to see personalized trading intelligence and opportunities.
                        </p>
                        <Link href="/setup">
                            <Button variant="primary" size="lg">
                                Complete Setup →
                            </Button>
                        </Link>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="flex flex-col gap-4 h-full">
                {/* Full-width Production Metrics Banner */}
                <ProductionMetricsWidget />

                {/* 2×2 Grid Layout */}
                <div
                    className="grid grid-cols-2 gap-4 flex-1"
                    style={{
                        gridTemplateRows: "1fr 1fr",
                    }}
                >
                    {/* Widget 1: Your Crude Value (Top Left) */}
                    <YourCrudeValueWidget />

                    {/* Widget 2: Best Opportunity (Top Right) */}
                    <BestOpportunityWidget />

                    {/* Widget 3: Market Overview (Bottom Left) */}
                    <MarketPricesWidget />

                    {/* Widget 4: Quick Calculator (Bottom Right) */}
                    <QuickCalculatorWidget />
                </div>
            </div>
        </MainLayout>
    );
}
