import { NextResponse } from "next/server";
import {
    detectArbitrageOpportunities,
    UserProfile,
    ArbitrageResult
} from "@/lib/domain/arbitrage";
import { ProductionBasin } from "@/lib/domain/derivatives";

/**
 * GET /api/arbitrage/detect
 * 
 * Calculates real derivatives opportunities for producers using Black-Scholes,
 * futures curve analysis, and location-aware pricing
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
        const productionBasin = (searchParams.get("productionBasin") || "permian_midland") as ProductionBasin;

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
            productionBasin,
            crudeClassification: crudeDensity && crudeSulfur ? {
                density: crudeDensity,
                sulfur: crudeSulfur,
                label: crudeLabel || `${crudeDensity} ${crudeSulfur}`
            } : null
        };

        // Fetch current market prices
        let wtiPrice = 72;
        let brentPrice = 76;

        try {
            const marketResponse = await fetch(
                new URL("/api/market", request.url).toString()
            );
            if (marketResponse.ok) {
                const marketData = await marketResponse.json();
                wtiPrice = marketData.prices?.wti?.price || 72;
                brentPrice = marketData.prices?.brent?.price || wtiPrice + 4;
            }
        } catch {
            console.warn("Failed to fetch market prices, using defaults");
        }

        // Calculate opportunities with derivatives pricing
        // Using 30% implied volatility (typical for WTI)
        const volatility = 0.30;
        const result = detectArbitrageOpportunities(profile, wtiPrice, brentPrice, volatility);

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
