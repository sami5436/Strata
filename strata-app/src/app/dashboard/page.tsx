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
 * Dashboard Page - Production Metrics Banner + Responsive Grid Layout
 * 
 * Mobile: Single column, stacked widgets
 * Desktop: 2×2 grid layout
 */
export default function DashboardPage() {
    const store = useSetupStore();
    const hasSetup = store.companyName && store.companyType;

    // If not set up, show setup prompt
    if (!hasSetup) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-full px-4">
                    <Card padding="lg" className="max-w-md text-center">
                        <CardTitle>Setup Required</CardTitle>
                        <p className="text-concrete-gray mt-4 mb-6 text-sm md:text-base">
                            Configure your company profile to see personalized trading intelligence and opportunities.
                        </p>
                        <Link href="/setup">
                            <Button variant="primary" size="lg" className="w-full md:w-auto">
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
            <div className="flex flex-col gap-3 md:gap-4 h-full">
                {/* Full-width Production Metrics Banner */}
                <ProductionMetricsWidget />

                {/* Responsive Grid: 1 col mobile, 2 cols desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 flex-1">
                    {/* Widget 1: Your Crude Value */}
                    <YourCrudeValueWidget />

                    {/* Widget 2: Best Opportunity */}
                    <BestOpportunityWidget />

                    {/* Widget 3: Market Overview */}
                    <MarketPricesWidget />

                    {/* Widget 4: Quick Calculator */}
                    <QuickCalculatorWidget />
                </div>
            </div>
        </MainLayout>
    );
}
