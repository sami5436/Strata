import { NextResponse } from "next/server";
import {
    blackScholes,
    calculateProtectivePut,
    calculateCollar,
    calculatePutSpread,
    getHedgeRecommendations,
    BASIN_DATA,
    calculateBasinPrice,
    compareSellingLocations,
    ProductionBasin
} from "@/lib/domain/derivatives";

/**
 * GET /api/derivatives/hedging
 * 
 * Calculate hedging recommendations based on user profile and market conditions
 * 
 * Query params:
 * - spotPrice: current WTI price
 * - brentPrice: current Brent price
 * - volatility: implied volatility (default 0.30)
 * - basin: production basin
 * - apiGravity: crude API gravity
 * - sulfurContent: crude sulfur %
 * - dailyProduction: BPD
 */
export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);

        const spotPrice = parseFloat(searchParams.get("spotPrice") || "70");
        const brentPrice = parseFloat(searchParams.get("brentPrice") || "74");
        const volatility = parseFloat(searchParams.get("volatility") || "0.30");
        const basin = (searchParams.get("basin") || "permian_midland") as ProductionBasin;
        const apiGravity = parseFloat(searchParams.get("apiGravity") || "35");
        const sulfurContent = parseFloat(searchParams.get("sulfurContent") || "0.3");
        const dailyProduction = parseFloat(searchParams.get("dailyProduction") || "10000");

        // === 1. HEDGING STRATEGIES ===

        // Calculate ATM put for reference
        const atmStrike = Math.round(spotPrice);
        const otm5Strike = Math.round(spotPrice * 0.95);
        const otm10Strike = Math.round(spotPrice * 0.90);
        const callStrike = Math.round(spotPrice * 1.10);

        // Option Greeks for transparency
        const atmOption = blackScholes(spotPrice, atmStrike, 0.25, 0.05, volatility);

        // Calculate specific hedge strategies
        const protectivePut3m = calculateProtectivePut(spotPrice, otm5Strike, 3, volatility);
        const collar6m = calculateCollar(spotPrice, otm5Strike, callStrike, 6, volatility);
        const putSpread3m = calculatePutSpread(spotPrice, otm5Strike, otm10Strike, 3, volatility);

        // Get sorted recommendations
        const recommendations = getHedgeRecommendations(spotPrice, volatility);

        // === 2. LOCATION PRICING ===

        const basinInfo = BASIN_DATA[basin];
        const localPrice = calculateBasinPrice(spotPrice, basin, apiGravity, sulfurContent, "local");
        const gulfPrice = calculateBasinPrice(spotPrice, basin, apiGravity, sulfurContent, "gulf_coast");
        const locationComparison = compareSellingLocations(spotPrice, brentPrice, basin, apiGravity, sulfurContent);

        // === 3. CALCULATE HEDGE VALUE ===

        // Monthly production value at risk
        const monthlyProduction = dailyProduction * 30;
        const monthlyRevenue = monthlyProduction * spotPrice;

        // Cost of 3-month put hedge
        const hedgeCost = protectivePut3m.upfrontCost * monthlyProduction;
        const hedgeCostPct = (protectivePut3m.upfrontCost / spotPrice) * 100;

        // Value at risk (10% downside)
        const valueAtRisk10Pct = monthlyRevenue * 0.10;
        const protectionValue = valueAtRisk10Pct - hedgeCost;

        return NextResponse.json({
            // Market data used
            market: {
                spotPrice,
                brentPrice,
                volatility,
                brentWtiSpread: brentPrice - spotPrice
            },

            // Basin pricing
            location: {
                basin,
                basinName: basinInfo.name,
                basinFullName: basinInfo.fullName,
                differential: basinInfo.differential,
                localPrice: localPrice.price,
                gulfPrice: gulfPrice.price,
                exportPrice: locationComparison.exportPrice,
                recommendation: locationComparison.recommendation,
                breakdown: localPrice.breakdown
            },

            // Option Greeks (for ATM put)
            greeks: {
                delta: -atmOption.delta,  // Put delta
                gamma: atmOption.gamma,
                theta: atmOption.theta,
                vega: atmOption.vega,
                putPremium: atmOption.put,
                callPremium: atmOption.call
            },

            // Specific hedge strategies
            strategies: [
                {
                    ...protectivePut3m,
                    totalCost: protectivePut3m.upfrontCost * dailyProduction * 90,
                    costPct: hedgeCostPct
                },
                {
                    ...collar6m,
                    totalCost: Math.abs(collar6m.upfrontCost) * dailyProduction * 180,
                    costPct: (Math.abs(collar6m.upfrontCost) / spotPrice) * 100
                },
                {
                    ...putSpread3m,
                    totalCost: putSpread3m.upfrontCost * dailyProduction * 90,
                    costPct: (putSpread3m.upfrontCost / spotPrice) * 100
                }
            ],

            // Recommendations sorted by value
            recommendations: recommendations.slice(0, 3),

            // Risk metrics
            risk: {
                monthlyProduction,
                monthlyRevenue,
                hedgeCost,
                valueAtRisk10Pct,
                protectionValue,
                breakeven: protectivePut3m.breakeven
            },

            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Hedging calculation error:", error);
        return NextResponse.json(
            { error: "Failed to calculate hedging recommendations" },
            { status: 500 }
        );
    }
}
