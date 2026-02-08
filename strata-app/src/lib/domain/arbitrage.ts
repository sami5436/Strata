/**
 * Arbitrage & Opportunity Detection System
 * 
 * Real opportunities for producers using derivatives:
 * 1. Hedging Recommendations (Black-Scholes priced puts/collars)
 * 2. Contango Storage Play (real futures curve)
 * 3. Basin Optimization (location-aware pricing)
 * 4. WTI-Brent Export Arbitrage
 */

import {
    calculateProtectivePut,
    calculateCollar,
    analyzeFuturesCurve,
    calculateStorageArbitrage,
    compareSellingLocations,
    BASIN_DATA,
    ProductionBasin,
    FuturesCurve,
    HedgeStrategy
} from "./derivatives";

export interface UserProfile {
    companyType: "producer" | "refiner" | "integrated" | "trader";
    dailyProduction: number;
    refiningCapacity: number;
    apiGravity: number;
    sulfurContent: number;
    productionBasin?: ProductionBasin;
    crudeClassification: {
        density: "Light" | "Medium" | "Heavy";
        sulfur: "Sweet" | "Sour";
        label: string;
    } | null;
}

export interface MarketData {
    wti: number;
    brent: number;
    volatility: number;
    futuresCurve?: FuturesCurve;
}

export interface ArbitrageOpportunity {
    id: string;
    type: "quality" | "temporal" | "location" | "hedge" | "contango" | "basis";
    title: string;
    description: string;
    dailyProfit: number;
    annualProfit: number;
    confidence: number;
    risks: string[];
    calculation: {
        sellPrice: number;
        buyPrice: number;
        spread: number;
        volume: number;
        formula: string;
    };
    actionable: boolean;
    actionSteps?: string[];
    hedgeDetails?: HedgeStrategy;
}

export interface ArbitrageResult {
    opportunities: ArbitrageOpportunity[];
    status: "success" | "no_opportunities" | "not_eligible" | "error";
    message: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculateUserCrudePrice(
    wtiPrice: number,
    apiGravity: number,
    sulfurContent: number
): number {
    const lightPremium = (apiGravity - 30) * 0.5;
    const sweetPremium = (0.5 - sulfurContent) * 10;
    return wtiPrice + lightPremium + sweetPremium;
}

export function calculateQualityDifferential(
    apiGravity: number,
    sulfurContent: number
): number {
    const lightPremium = (apiGravity - 30) * 0.5;
    const sweetPremium = (0.5 - sulfurContent) * 10;
    return lightPremium + sweetPremium;
}

export function estimateHeavySourPrice(wtiPrice: number): number {
    return wtiPrice - 18;
}

// ============================================
// PRODUCER OPPORTUNITIES
// ============================================

/**
 * 1. HEDGING OPPORTUNITY (Black-Scholes priced)
 */
function calculateHedgingOpportunity(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    const spotPrice = market.wti;
    const vol = market.volatility || 0.30;

    // Calculate 3-month protective put at 5% OTM
    const putStrike = Math.round(spotPrice * 0.95);
    const hedge = calculateProtectivePut(spotPrice, putStrike, 3, vol);

    // Cost analysis
    const hedgeCostPerBbl = hedge.upfrontCost;
    const monthlyProduction = profile.dailyProduction * 30;
    const totalHedgeCost = hedgeCostPerBbl * monthlyProduction * 3;

    // Value protected (10% downside for 3 months)
    const potentialLoss = spotPrice * 0.10 * monthlyProduction * 3;
    const netProtection = potentialLoss - totalHedgeCost;

    // Only recommend if protection value > 0
    if (netProtection <= 0) return null;

    return {
        id: "hedge-001",
        type: "hedge",
        title: "Protective Put Hedge",
        description: `Lock in $${hedge.floorPrice.toFixed(2)}/bbl floor with 3-month put at $${putStrike} strike. Cost: $${hedgeCostPerBbl.toFixed(2)}/bbl`,
        dailyProfit: Math.round(netProtection / 90), // Spread over 3 months
        annualProfit: Math.round(netProtection * 4), // 4 quarters
        confidence: 90,
        risks: [
            "Premium paid is non-refundable",
            "Unlimited upside preserved",
            "Requires margin/collateral"
        ],
        calculation: {
            sellPrice: hedge.floorPrice,
            buyPrice: hedgeCostPerBbl,
            spread: spotPrice - hedge.floorPrice - hedgeCostPerBbl,
            volume: monthlyProduction * 3,
            formula: `Floor: $${putStrike} - Premium: $${hedgeCostPerBbl.toFixed(2)} = Net $${hedge.floorPrice.toFixed(2)}/bbl`
        },
        actionable: true,
        actionSteps: [
            "Execute via CME CL options (NYMEX)",
            `Buy ${Math.round(monthlyProduction * 3 / 1000)} put contracts at $${putStrike} strike`,
            "Expiry: 3 months forward"
        ],
        hedgeDetails: hedge
    };
}

/**
 * 2. COLLAR STRATEGY (Costless hedging)
 */
function calculateCollarOpportunity(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    const spotPrice = market.wti;
    const vol = market.volatility || 0.30;

    const putStrike = Math.round(spotPrice * 0.93); // 7% OTM put
    const callStrike = Math.round(spotPrice * 1.10); // 10% OTM call

    const collar = calculateCollar(spotPrice, putStrike, callStrike, 6, vol);

    // Only show if near costless
    if (Math.abs(collar.upfrontCost) > 0.75) return null;

    const monthlyProduction = profile.dailyProduction * 30;

    return {
        id: "collar-001",
        type: "hedge",
        title: "Costless Collar",
        description: `Lock in $${collar.floorPrice.toFixed(2)}-$${collar.ceilingPrice?.toFixed(2)} range for 6 months. Net cost: $${collar.upfrontCost.toFixed(2)}/bbl`,
        dailyProfit: 0, // Costless means no immediate P&L
        annualProfit: 0,
        confidence: 95, // High confidence since it locks in range
        risks: [
            "Upside capped at ceiling",
            "Floor protected",
            "Requires credit line"
        ],
        calculation: {
            sellPrice: collar.ceilingPrice || callStrike,
            buyPrice: collar.floorPrice,
            spread: (collar.ceilingPrice || callStrike) - collar.floorPrice,
            volume: monthlyProduction * 6,
            formula: `Buy $${putStrike} put, Sell $${callStrike} call → Range: $${collar.floorPrice.toFixed(2)}-$${collar.ceilingPrice?.toFixed(2)}`
        },
        actionable: true,
        actionSteps: [
            "Execute as zero-cost collar",
            `Buy $${putStrike} puts, sell $${callStrike} calls`,
            "6-month expiry for H2 protection"
        ],
        hedgeDetails: collar
    };
}

/**
 * 3. CONTANGO STORAGE PLAY
 */
function calculateContangoOpportunity(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    // Use futures curve if available, otherwise estimate
    const curve = market.futuresCurve || analyzeFuturesCurve(
        market.wti,
        market.wti + 0.25,
        market.wti + 0.50,
        market.wti + 0.75,
        market.wti + 1.50,
        market.wti + 2.50
    );

    if (!curve.isContango) return null;

    const storageCostPerMonth = 0.50;
    const storage6m = calculateStorageArbitrage(curve, 6, storageCostPerMonth);

    if (!storage6m.viable) return null;

    // Calculate based on storeable volume (1 month production)
    const storableVolume = profile.dailyProduction * 30;
    const totalProfit = storage6m.profit * storableVolume;

    return {
        id: "contango-001",
        type: "contango",
        title: "Contango Storage Arb",
        description: `Store crude 6 months to capture $${curve.annualizedContango.toFixed(1)}% annualized contango. Net gain: $${storage6m.profit.toFixed(2)}/bbl`,
        dailyProfit: Math.round(totalProfit / 180),
        annualProfit: Math.round(totalProfit * 2), // 2 cycles per year
        confidence: 75,
        risks: [
            "Requires storage capacity",
            "Contango may narrow",
            "Working capital required"
        ],
        calculation: {
            sellPrice: curve.m6,
            buyPrice: curve.spot,
            spread: storage6m.profit,
            volume: storableVolume,
            formula: `6M Forward $${curve.m6.toFixed(2)} - Spot $${curve.spot.toFixed(2)} - Storage $${(storageCostPerMonth * 6).toFixed(2)} = $${storage6m.profit.toFixed(2)}/bbl`
        },
        actionable: true,
        actionSteps: [
            "Secure tank storage (Cushing or Gulf Coast)",
            `Sell ${Math.round(storableVolume / 1000)} forward contracts at $${curve.m6.toFixed(2)}`,
            "Deliver in 6 months"
        ]
    };
}

/**
 * 4. BASIN OPTIMIZATION (Location arbitrage)
 */
function calculateBasinOpportunity(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    const basin = profile.productionBasin || "permian_midland";
    const basinInfo = BASIN_DATA[basin];

    const comparison = compareSellingLocations(
        market.wti,
        market.brent,
        basin,
        profile.apiGravity,
        profile.sulfurContent
    );

    // Check if transport is worth it
    const localVsGulf = comparison.gulfPrice - comparison.localPrice;
    const localVsExport = comparison.exportPrice - comparison.localPrice;

    const bestDiff = Math.max(localVsGulf, localVsExport);

    // Minimum $1/bbl improvement to recommend
    if (bestDiff < 1.00) return null;

    const transportableVolume = profile.dailyProduction * 0.30; // 30% can be transported
    const dailyGain = bestDiff * transportableVolume;

    const isExportBetter = localVsExport > localVsGulf;

    return {
        id: "basis-001",
        type: "basis",
        title: isExportBetter ? "Export Arbitrage" : "Gulf Coast Premium",
        description: comparison.recommendation,
        dailyProfit: Math.round(dailyGain),
        annualProfit: Math.round(dailyGain * 365),
        confidence: 80,
        risks: [
            "Pipeline capacity constraints",
            "Transport commitments required",
            isExportBetter ? "Shipping rate volatility" : "Gulf basis volatility"
        ],
        calculation: {
            sellPrice: isExportBetter ? comparison.exportPrice : comparison.gulfPrice,
            buyPrice: comparison.localPrice,
            spread: bestDiff,
            volume: transportableVolume,
            formula: `${isExportBetter ? "Export" : "Gulf"} $${(isExportBetter ? comparison.exportPrice : comparison.gulfPrice).toFixed(2)} - Local $${comparison.localPrice.toFixed(2)} = +$${bestDiff.toFixed(2)}/bbl`
        },
        actionable: true,
        actionSteps: isExportBetter ? [
            "Secure export terminal capacity (LOOP)",
            "Charter Aframax tanker",
            "Sell FOB Rotterdam or Dated Brent"
        ] : [
            `Secure pipeline capacity to Gulf (${basinInfo.pipelineTariff}/bbl)`,
            "Negotiate Gulf Coast marketing agreement",
            "Lock in LLS or MEH pricing"
        ]
    };
}

/**
 * 5. WTI-BRENT SPREAD
 */
function calculateWtiBrentOpportunity(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    const spread = market.brent - market.wti;
    const transportCost = 3.50;
    const netGain = spread - transportCost;

    if (netGain < 1.50) return null;

    const exportVolume = profile.dailyProduction * 0.20;
    const dailyProfit = netGain * exportVolume;

    return {
        id: "wti-brent-001",
        type: "location",
        title: "Brent Premium Capture",
        description: `Brent-WTI spread at $${spread.toFixed(2)}/bbl. Export nets +$${netGain.toFixed(2)}/bbl after transport.`,
        dailyProfit: Math.round(dailyProfit),
        annualProfit: Math.round(dailyProfit * 365),
        confidence: spread > 5 ? 90 : 75,
        risks: [
            "Spread may narrow",
            "Shipping costs volatile",
            "Export logistics complex"
        ],
        calculation: {
            sellPrice: market.brent,
            buyPrice: market.wti + transportCost,
            spread: netGain,
            volume: exportVolume,
            formula: `Brent $${market.brent.toFixed(2)} - WTI $${market.wti.toFixed(2)} - Ship $${transportCost.toFixed(2)} = $${netGain.toFixed(2)}/bbl`
        },
        actionable: true,
        actionSteps: [
            "Contact Enterprise/LOOP for export slot",
            "Hedge with Brent-WTI spread options",
            "Secure tanker charter"
        ]
    };
}

// ============================================
// INTEGRATED COMPANY - QUALITY ARBITRAGE
// ============================================

function calculateQualityArbitrage(
    profile: UserProfile,
    market: MarketData
): ArbitrageOpportunity | null {
    if (profile.companyType !== "integrated") return null;

    const userPrice = calculateUserCrudePrice(market.wti, profile.apiGravity, profile.sulfurContent);
    const heavyPrice = estimateHeavySourPrice(market.wti);
    const spread = userPrice - heavyPrice;

    if (spread < 10) return null;

    const volume = Math.min(profile.dailyProduction, profile.refiningCapacity);
    const dailyProfit = spread * volume;

    return {
        id: "quality-001",
        type: "quality",
        title: "Quality Arbitrage",
        description: `Sell ${profile.crudeClassification?.label || "Light Sweet"} at premium, buy Heavy Sour for refinery.`,
        dailyProfit: Math.round(dailyProfit),
        annualProfit: Math.round(dailyProfit * 365),
        confidence: 85,
        risks: [
            "Heavy sour processing required",
            "Spread may narrow",
            "Quality consistency needed"
        ],
        calculation: {
            sellPrice: userPrice,
            buyPrice: heavyPrice,
            spread,
            volume,
            formula: `Light @$${userPrice.toFixed(2)} - Heavy @$${heavyPrice.toFixed(2)} = $${spread.toFixed(2)}/bbl × ${volume.toLocaleString()} BPD`
        },
        actionable: true
    };
}

// ============================================
// MAIN ENTRY POINT
// ============================================

export function detectArbitrageOpportunities(
    profile: UserProfile,
    wtiPrice: number,
    brentPrice: number = 0,
    volatility: number = 0.30,
    futuresCurve?: FuturesCurve
): ArbitrageResult {
    const market: MarketData = {
        wti: wtiPrice,
        brent: brentPrice > 0 ? brentPrice : wtiPrice + 4.5,
        volatility,
        futuresCurve
    };

    const opportunities: ArbitrageOpportunity[] = [];

    // PRODUCER opportunities
    if (profile.companyType === "producer" || profile.companyType === "integrated") {
        const hedge = calculateHedgingOpportunity(profile, market);
        if (hedge) opportunities.push(hedge);

        const collar = calculateCollarOpportunity(profile, market);
        if (collar) opportunities.push(collar);

        const contango = calculateContangoOpportunity(profile, market);
        if (contango) opportunities.push(contango);

        const basis = calculateBasinOpportunity(profile, market);
        if (basis) opportunities.push(basis);

        const wtiBrent = calculateWtiBrentOpportunity(profile, market);
        if (wtiBrent) opportunities.push(wtiBrent);
    }

    // INTEGRATED additional opportunity
    if (profile.companyType === "integrated") {
        const quality = calculateQualityArbitrage(profile, market);
        if (quality) opportunities.push(quality);
    }

    if (opportunities.length === 0) {
        return {
            opportunities: [],
            status: "no_opportunities",
            message: "No significant opportunities at current market conditions"
        };
    }

    // Sort by daily profit (descending), then confidence
    opportunities.sort((a, b) => {
        if (b.dailyProfit !== a.dailyProfit) {
            return b.dailyProfit - a.dailyProfit;
        }
        return b.confidence - a.confidence;
    });

    const totalDaily = opportunities.reduce((sum, o) => sum + o.dailyProfit, 0);

    return {
        opportunities,
        status: "success",
        message: `Found ${opportunities.length} opportunities worth $${totalDaily.toLocaleString()}/day`
    };
}
