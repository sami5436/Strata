import { NextResponse } from "next/server";
import {
    detectArbitrageOpportunities,
    UserProfile,
    ArbitrageResult
} from "@/lib/domain/arbitrage";

/**
 * GET /api/arbitrage/detect
 * 
 * Query params (all required for calculation):
 * - companyType: producer | refiner | integrated | trader
 * - dailyProduction: number (BPD)
 * - refiningCapacity: number (BPD) 
 * - apiGravity: number (degrees)
 * - sulfurContent: number (percentage)
 * - crudeDensity: Light | Medium | Heavy
 * - crudeSulfur: Sweet | Sour
 * - crudeLabel: string
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse query parameters
        const companyType = searchParams.get("companyType") as UserProfile["companyType"];
        const dailyProduction = parseFloat(searchParams.get("dailyProduction") || "0");
        const refiningCapacity = parseFloat(searchParams.get("refiningCapacity") || "0");
        const apiGravity = parseFloat(searchParams.get("apiGravity") || "35");
        const sulfurContent = parseFloat(searchParams.get("sulfurContent") || "0.3");
        const crudeDensity = searchParams.get("crudeDensity") as "Light" | "Medium" | "Heavy" | null;
        const crudeSulfur = searchParams.get("crudeSulfur") as "Sweet" | "Sour" | null;
        const crudeLabel = searchParams.get("crudeLabel");

        // Validate required params
        if (!companyType) {
            return NextResponse.json(
                {
                    opportunities: [],
                    status: "error",
                    message: "Company type is required"
                } as ArbitrageResult,
                { status: 400 }
            );
        }

        // Build user profile
        const profile: UserProfile = {
            companyType,
            dailyProduction,
            refiningCapacity,
            apiGravity,
            sulfurContent,
            crudeClassification: crudeDensity && crudeSulfur ? {
                density: crudeDensity,
                sulfur: crudeSulfur,
                label: crudeLabel || `${crudeDensity} ${crudeSulfur}`
            } : null
        };

        // Fetch current WTI price from our market API
        let wtiPrice = 80; // Default fallback
        try {
            const marketResponse = await fetch(
                new URL("/api/market", request.url).toString()
            );
            if (marketResponse.ok) {
                const marketData = await marketResponse.json();
                wtiPrice = marketData.prices?.wti?.price || 80;
            }
        } catch {
            console.warn("Failed to fetch market prices, using default WTI price");
        }

        // Calculate arbitrage opportunities
        const result = detectArbitrageOpportunities(profile, wtiPrice);

        return NextResponse.json(result);

    } catch (error) {
        console.error("Arbitrage detection error:", error);
        return NextResponse.json(
            {
                opportunities: [],
                status: "error",
                message: "Unable to calculate opportunities"
            } as ArbitrageResult,
            { status: 500 }
        );
    }
}
