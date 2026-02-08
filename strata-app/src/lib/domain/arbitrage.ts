/**
 * Arbitrage Detection System
 * 
 * Phase 4: Quality Arbitrage Calculator
 * - Calculates opportunities for integrated companies
 * - Compares light sweet vs heavy sour spreads
 */

export interface UserProfile {
    companyType: "producer" | "refiner" | "integrated" | "trader";
    dailyProduction: number;  // BPD
    refiningCapacity: number; // BPD
    apiGravity: number;       // API degrees
    sulfurContent: number;    // Percentage
    crudeClassification: {
        density: "Light" | "Medium" | "Heavy";
        sulfur: "Sweet" | "Sour";
        label: string;
    } | null;
}

export interface MarketPrices {
    wti: { price: number; change: number };
    brent: { price: number; change: number };
    heavySour: { price: number; change: number }; // Placeholder for heavy sour benchmark
}

export interface ArbitrageOpportunity {
    id: string;
    type: "quality" | "temporal" | "location";
    title: string;
    description: string;
    dailyProfit: number;
    annualProfit: number;
    confidence: number; // 0-100
    risks: string[];
    calculation: {
        sellPrice: number;
        buyPrice: number;
        spread: number;
        volume: number;
        formula: string;
    };
    actionable: boolean;
    message?: string;
}

export interface ArbitrageResult {
    opportunities: ArbitrageOpportunity[];
    status: "success" | "no_opportunities" | "not_eligible" | "error";
    message: string;
}

/**
 * Calculate user's crude price based on WTI + quality differential
 * Light premium: (API - 30) × $0.50/degree
 * Sweet premium: (0.5 - Sulfur%) × $10/point
 */
export function calculateUserCrudePrice(
    wtiPrice: number,
    apiGravity: number,
    sulfurContent: number
): number {
    const lightPremium = (apiGravity - 30) * 0.5;
    const sweetPremium = (0.5 - sulfurContent) * 10;
    return wtiPrice + lightPremium + sweetPremium;
}

/**
 * Estimate heavy sour crude price
 * Heavy sour typically trades at a discount to WTI
 * Discount based on: lower API gravity + higher sulfur = more discount
 * Typical heavy sour specs: API ~20, Sulfur ~3%
 */
export function estimateHeavySourPrice(wtiPrice: number): number {
    // Heavy sour discount: typically $15-25/bbl below WTI
    // Using ~$18-20 as baseline discount for Maya-like crude
    const heavyDiscount = 18;
    return wtiPrice - heavyDiscount;
}

/**
 * Calculate historical spread average for confidence calculation
 * In production, this would query historical data
 */
export function getHistoricalSpreadAverage(): number {
    // Historical light-heavy spread average: ~$15-20/bbl
    return 17;
}

/**
 * Calculate confidence based on current spread vs historical
 */
export function calculateConfidence(
    currentSpread: number,
    historicalAverage: number
): number {
    // If spread is above historical average, higher confidence
    // If spread is near historical average, moderate confidence
    // If spread is below historical average, lower confidence

    const spreadRatio = currentSpread / historicalAverage;

    if (spreadRatio >= 1.5) return 95; // Exceptional spread
    if (spreadRatio >= 1.2) return 85; // Above average
    if (spreadRatio >= 1.0) return 75; // At average
    if (spreadRatio >= 0.8) return 60; // Below average
    return 50; // Low confidence
}

/**
 * Main Quality Arbitrage Calculator
 */
export function calculateQualityArbitrage(
    profile: UserProfile,
    wtiPrice: number
): ArbitrageResult {
    // Edge case 1: Not integrated - can't do quality arbitrage
    if (profile.companyType !== "integrated") {
        return {
            opportunities: [],
            status: "not_eligible",
            message: profile.companyType === "producer"
                ? "Integrate refining capabilities to unlock quality arbitrage opportunities"
                : profile.companyType === "refiner"
                    ? "Integrate production to optimize crude sourcing"
                    : "Quality arbitrage requires production and refining assets"
        };
    }

    // Calculate prices
    const userCrudePrice = calculateUserCrudePrice(
        wtiPrice,
        profile.apiGravity,
        profile.sulfurContent
    );
    const heavySourPrice = estimateHeavySourPrice(wtiPrice);
    const spread = userCrudePrice - heavySourPrice;

    // Edge case 2: Spread too narrow
    const MIN_PROFITABLE_SPREAD = 10;
    if (spread < MIN_PROFITABLE_SPREAD) {
        return {
            opportunities: [],
            status: "no_opportunities",
            message: `Spread of $${spread.toFixed(2)}/bbl is below minimum threshold of $${MIN_PROFITABLE_SPREAD}/bbl. No profitable opportunities detected.`
        };
    }

    // Calculate arbitrage opportunity
    const volume = Math.min(profile.dailyProduction, profile.refiningCapacity);
    const dailyProfit = spread * volume;
    const annualProfit = dailyProfit * 365;

    // Calculate confidence
    const historicalAvg = getHistoricalSpreadAverage();
    const confidence = calculateConfidence(spread, historicalAvg);

    // Define risks based on spread level
    const risks: string[] = [];
    if (spread > historicalAvg * 1.5) {
        risks.push("Spread is unusually wide - may revert to mean");
    }
    if (spread < historicalAvg) {
        risks.push("Spread is narrower than historical average");
    }
    risks.push("Storage and logistics required for swap execution");
    risks.push("Refinery must handle heavy sour feedstock");

    const opportunity: ArbitrageOpportunity = {
        id: "quality-arb-001",
        type: "quality",
        title: "Quality Arbitrage",
        description: `Sell your ${profile.crudeClassification?.label || "Light Sweet"} crude at premium, buy Heavy Sour for refinery processing.`,
        dailyProfit,
        annualProfit,
        confidence,
        risks,
        calculation: {
            sellPrice: userCrudePrice,
            buyPrice: heavySourPrice,
            spread,
            volume,
            formula: `($${userCrudePrice.toFixed(2)} - $${heavySourPrice.toFixed(2)}) × ${volume.toLocaleString()} BPD = $${dailyProfit.toLocaleString()}/day`
        },
        actionable: true
    };

    return {
        opportunities: [opportunity],
        status: "success",
        message: `Found ${1} quality arbitrage opportunity`
    };
}

/**
 * Main entry point for arbitrage detection
 * Returns all detected opportunities sorted by profit
 */
export function detectArbitrageOpportunities(
    profile: UserProfile,
    wtiPrice: number
): ArbitrageResult {
    // For now, only quality arbitrage
    // Phase 5 will add temporal (contango) arbitrage
    // Future phases will add location arbitrage

    const qualityResult = calculateQualityArbitrage(profile, wtiPrice);

    // If not eligible or error, return that result
    if (qualityResult.status !== "success") {
        return qualityResult;
    }

    // Combine all opportunities and sort by daily profit
    const allOpportunities = [
        ...qualityResult.opportunities
    ].sort((a, b) => b.dailyProfit - a.dailyProfit);

    return {
        opportunities: allOpportunities,
        status: "success",
        message: `Found ${allOpportunities.length} arbitrage opportunit${allOpportunities.length === 1 ? 'y' : 'ies'}`
    };
}
