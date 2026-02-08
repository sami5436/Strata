/**
 * Derivatives & Quantitative Analysis Module
 * 
 * Real financial calculations for oil producer hedging:
 * - Black-Scholes options pricing
 * - Futures curve analysis (contango/backwardation)
 * - Hedging strategies (collars, puts, swaps)
 * - Greeks calculation (delta, gamma, theta, vega)
 */

// ============================================
// CONSTANTS & TYPES
// ============================================

export type ProductionBasin =
    | "permian_midland"
    | "permian_delaware"
    | "eagle_ford"
    | "bakken"
    | "dj_basin"
    | "gulf_coast"
    | "cushing";

export interface BasinInfo {
    name: string;
    fullName: string;
    differential: number;  // vs WTI Cushing
    pipelineTariff: number; // to Gulf Coast
    qualityAdj: number;    // typical API/sulfur adj
}

// Real industry differentials (approximate Q1 2024 levels)
export const BASIN_DATA: Record<ProductionBasin, BasinInfo> = {
    "permian_midland": {
        name: "WTI Midland",
        fullName: "Permian Basin - Midland",
        differential: -0.75,
        pipelineTariff: 2.50,
        qualityAdj: 0
    },
    "permian_delaware": {
        name: "Delaware Basin",
        fullName: "Permian Basin - Delaware",
        differential: -1.25,
        pipelineTariff: 2.75,
        qualityAdj: -0.25
    },
    "eagle_ford": {
        name: "MEH",
        fullName: "Eagle Ford - Magellan East Houston",
        differential: +0.50,
        pipelineTariff: 0.75,
        qualityAdj: +0.50
    },
    "bakken": {
        name: "Clearbrook",
        fullName: "Bakken - Clearbrook, MN",
        differential: -3.00,
        pipelineTariff: 5.50,
        qualityAdj: +0.25
    },
    "dj_basin": {
        name: "Niobrara",
        fullName: "DJ Basin - Niobrara",
        differential: -2.25,
        pipelineTariff: 4.00,
        qualityAdj: +0.50
    },
    "gulf_coast": {
        name: "LLS",
        fullName: "Louisiana Light Sweet",
        differential: +1.50,
        pipelineTariff: 0,
        qualityAdj: +1.00
    },
    "cushing": {
        name: "WTI Cushing",
        fullName: "Cushing, OK Hub",
        differential: 0,
        pipelineTariff: 1.50,
        qualityAdj: 0
    }
};

export interface FuturesCurve {
    spot: number;
    m1: number;  // Front month
    m2: number;  // 2nd month
    m3: number;  // 3rd month
    m6: number;  // 6th month
    m12: number; // 12th month
    isContango: boolean;
    slope: number; // $/month average
    annualizedContango: number; // % per year
}

export interface OptionPrice {
    call: number;
    put: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
}

export interface HedgeStrategy {
    name: string;
    type: "put" | "collar" | "swap" | "put_spread";
    description: string;
    upfrontCost: number;      // $/bbl premium paid
    floorPrice: number;       // Minimum realized price
    ceilingPrice: number | null; // Max price (null = unlimited)
    breakeven: number;        // Price where hedge = spot
    monthsForward: number;
    confidence: number;
}

// ============================================
// BLACK-SCHOLES OPTIONS PRICING
// ============================================

/**
 * Standard normal cumulative distribution function
 */
function normalCDF(x: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
}

/**
 * Standard normal probability density function
 */
function normalPDF(x: number): number {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Black-Scholes Option Pricing Model
 * 
 * @param S - Current spot price
 * @param K - Strike price
 * @param T - Time to expiration in years
 * @param r - Risk-free interest rate (annualized)
 * @param sigma - Volatility (annualized, e.g., 0.30 for 30%)
 * @returns Option prices and Greeks
 */
export function blackScholes(
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number
): OptionPrice {
    // Handle edge cases
    if (T <= 0) {
        return {
            call: Math.max(0, S - K),
            put: Math.max(0, K - S),
            delta: S > K ? 1 : 0,
            gamma: 0,
            theta: 0,
            vega: 0
        };
    }

    const sqrtT = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
    const d2 = d1 - sigma * sqrtT;

    const Nd1 = normalCDF(d1);
    const Nd2 = normalCDF(d2);
    const Nd1Neg = normalCDF(-d1);
    const Nd2Neg = normalCDF(-d2);
    const nd1 = normalPDF(d1);

    // Option prices
    const call = S * Nd1 - K * Math.exp(-r * T) * Nd2;
    const put = K * Math.exp(-r * T) * Nd2Neg - S * Nd1Neg;

    // Greeks
    const delta = Nd1; // Call delta (put delta = Nd1 - 1)
    const gamma = nd1 / (S * sigma * sqrtT);
    const theta = -(S * nd1 * sigma) / (2 * sqrtT) - r * K * Math.exp(-r * T) * Nd2;
    const vega = S * sqrtT * nd1;

    return {
        call: Math.max(0, call),
        put: Math.max(0, put),
        delta,
        gamma,
        theta: theta / 365, // Convert to daily theta
        vega: vega / 100    // Convert to per-1% vol move
    };
}

/**
 * Calculate implied volatility using Newton-Raphson
 */
export function impliedVolatility(
    optionPrice: number,
    S: number,
    K: number,
    T: number,
    r: number,
    isCall: boolean,
    maxIterations: number = 100
): number {
    let sigma = 0.30; // Initial guess (30%)
    const tolerance = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
        const bs = blackScholes(S, K, T, r, sigma);
        const price = isCall ? bs.call : bs.put;
        const vega = bs.vega * 100; // Convert back

        const diff = price - optionPrice;
        if (Math.abs(diff) < tolerance) break;

        sigma = sigma - diff / (vega || 0.01);
        sigma = Math.max(0.01, Math.min(sigma, 2.0)); // Bound sigma
    }

    return sigma;
}

// ============================================
// FUTURES CURVE ANALYSIS
// ============================================

/**
 * Analyze futures curve for contango/backwardation
 */
export function analyzeFuturesCurve(
    spot: number,
    m1: number,
    m2: number,
    m3: number,
    m6: number,
    m12: number
): FuturesCurve {
    // Calculate average slope ($/month)
    const slope = (m12 - spot) / 12;

    // Is the market in contango (positive slope) or backwardation?
    const isContango = m3 > spot;

    // Annualized contango as percentage
    const annualizedContango = ((m12 - spot) / spot) * 100;

    return {
        spot,
        m1,
        m2,
        m3,
        m6,
        m12,
        isContango,
        slope,
        annualizedContango
    };
}

/**
 * Calculate storage arbitrage opportunity from contango
 */
export function calculateStorageArbitrage(
    curve: FuturesCurve,
    monthsToStore: number,
    storageCostPerMonth: number,
    financingRate: number = 0.05
): { profit: number; returnPct: number; viable: boolean } {
    // Get forward price for storage period
    let forwardPrice: number;
    switch (monthsToStore) {
        case 1: forwardPrice = curve.m1; break;
        case 2: forwardPrice = curve.m2; break;
        case 3: forwardPrice = curve.m3; break;
        case 6: forwardPrice = curve.m6; break;
        case 12: forwardPrice = curve.m12; break;
        default: forwardPrice = curve.spot + curve.slope * monthsToStore;
    }

    // Total costs
    const storageCost = storageCostPerMonth * monthsToStore;
    const financingCost = curve.spot * financingRate * (monthsToStore / 12);
    const totalCost = storageCost + financingCost;

    // Profit calculation
    const grossProfit = forwardPrice - curve.spot;
    const netProfit = grossProfit - totalCost;
    const returnPct = (netProfit / curve.spot) * 100;

    return {
        profit: netProfit,
        returnPct,
        viable: netProfit > 0.50 // Minimum $0.50/bbl profit
    };
}

// ============================================
// HEDGING STRATEGIES
// ============================================

/**
 * Calculate protective put hedge
 */
export function calculateProtectivePut(
    spotPrice: number,
    strikePrice: number,
    monthsForward: number,
    volatility: number = 0.30,
    riskFreeRate: number = 0.05
): HedgeStrategy {
    const T = monthsForward / 12;
    const bs = blackScholes(spotPrice, strikePrice, T, riskFreeRate, volatility);

    const floorPrice = strikePrice - bs.put;

    return {
        name: "Protective Put",
        type: "put",
        description: `Buy $${strikePrice} put for ${monthsForward}M protection`,
        upfrontCost: bs.put,
        floorPrice,
        ceilingPrice: null, // Unlimited upside
        breakeven: spotPrice - bs.put,
        monthsForward,
        confidence: 85
    };
}

/**
 * Calculate costless collar (buy put, sell call)
 */
export function calculateCollar(
    spotPrice: number,
    putStrike: number,
    callStrike: number,
    monthsForward: number,
    volatility: number = 0.30,
    riskFreeRate: number = 0.05
): HedgeStrategy {
    const T = monthsForward / 12;
    const putBS = blackScholes(spotPrice, putStrike, T, riskFreeRate, volatility);
    const callBS = blackScholes(spotPrice, callStrike, T, riskFreeRate, volatility);

    const netCost = putBS.put - callBS.call;
    const floorPrice = putStrike - Math.max(0, netCost);

    return {
        name: "Costless Collar",
        type: "collar",
        description: `Buy $${putStrike} put, sell $${callStrike} call`,
        upfrontCost: netCost,
        floorPrice,
        ceilingPrice: callStrike,
        breakeven: spotPrice,
        monthsForward,
        confidence: 90
    };
}

/**
 * Calculate put spread (buy higher strike, sell lower strike)
 */
export function calculatePutSpread(
    spotPrice: number,
    longPutStrike: number,
    shortPutStrike: number,
    monthsForward: number,
    volatility: number = 0.30,
    riskFreeRate: number = 0.05
): HedgeStrategy {
    const T = monthsForward / 12;
    const longPut = blackScholes(spotPrice, longPutStrike, T, riskFreeRate, volatility);
    const shortPut = blackScholes(spotPrice, shortPutStrike, T, riskFreeRate, volatility);

    const netCost = longPut.put - shortPut.put;
    // maxProtection = longPutStrike - shortPutStrike (used for reference)

    return {
        name: "Put Spread",
        type: "put_spread",
        description: `Buy $${longPutStrike} put, sell $${shortPutStrike} put`,
        upfrontCost: netCost,
        floorPrice: shortPutStrike, // Protection stops at short strike
        ceilingPrice: null,
        breakeven: longPutStrike - netCost,
        monthsForward,
        confidence: 80
    };
}

/**
 * Get optimal hedge recommendations based on market conditions
 */
export function getHedgeRecommendations(
    spotPrice: number,
    volatility: number,
    _curve: FuturesCurve,
    _riskTolerance: "low" | "medium" | "high" = "medium"
): HedgeStrategy[] {
    const recommendations: HedgeStrategy[] = [];

    // OTM strikes
    const otm5 = Math.round(spotPrice * 0.95);  // 5% OTM
    const otm15 = Math.round(spotPrice * 0.85); // 15% OTM

    // Call strikes for collar
    const call10 = Math.round(spotPrice * 1.10);

    // 3-month protective put
    const put3m = calculateProtectivePut(spotPrice, otm5, 3, volatility);
    recommendations.push(put3m);

    // 6-month collar
    const collar6m = calculateCollar(spotPrice, otm5, call10, 6, volatility);
    if (collar6m.upfrontCost <= 0.50) { // Near costless
        recommendations.push(collar6m);
    }

    // Put spread for cost reduction
    const spread3m = calculatePutSpread(spotPrice, otm5, otm15, 3, volatility);
    recommendations.push(spread3m);

    // Sort by cost-effectiveness (protection per dollar spent)
    return recommendations.sort((a, b) => {
        const aValue = (spotPrice - a.floorPrice) / Math.max(a.upfrontCost, 0.01);
        const bValue = (spotPrice - b.floorPrice) / Math.max(b.upfrontCost, 0.01);
        return bValue - aValue;
    });
}

// ============================================
// LOCATION-AWARE PRICING
// ============================================

/**
 * Calculate net realized price for a basin
 */
export function calculateBasinPrice(
    wtiCushing: number,
    basin: ProductionBasin,
    apiGravity: number,
    sulfurContent: number,
    sellLocation: "local" | "gulf_coast" = "local"
): { price: number; breakdown: { wti: number; basinDiff: number; quality: number; transport: number } } {
    const basinInfo = BASIN_DATA[basin];

    // Quality adjustment (simplified)
    const lightPremium = (apiGravity - 35) * 0.25;
    const sweetPremium = (0.5 - sulfurContent) * 5;
    const qualityAdj = lightPremium + sweetPremium + basinInfo.qualityAdj;

    // Transport cost if selling at Gulf Coast
    const transportCost = sellLocation === "gulf_coast" ? basinInfo.pipelineTariff : 0;

    // Final price
    const price = wtiCushing + basinInfo.differential + qualityAdj - transportCost;

    return {
        price,
        breakdown: {
            wti: wtiCushing,
            basinDiff: basinInfo.differential,
            quality: qualityAdj,
            transport: -transportCost
        }
    };
}

/**
 * Compare selling locally vs Gulf Coast
 */
export function compareSellingLocations(
    wtiCushing: number,
    brentPrice: number,
    basin: ProductionBasin,
    apiGravity: number,
    sulfurContent: number
): { localPrice: number; gulfPrice: number; exportPrice: number; recommendation: string } {
    const localPrice = calculateBasinPrice(wtiCushing, basin, apiGravity, sulfurContent, "local");
    const gulfPrice = calculateBasinPrice(wtiCushing, basin, apiGravity, sulfurContent, "gulf_coast");

    // Export to Europe (Brent-linked)
    const exportCost = 3.50; // Shipping to Europe
    const exportPrice = brentPrice - exportCost;

    const prices = [
        { location: "local", price: localPrice.price },
        { location: "gulf_coast", price: gulfPrice.price },
        { location: "export", price: exportPrice }
    ];

    const best = prices.reduce((a, b) => a.price > b.price ? a : b);

    let recommendation: string;
    if (best.location === "export" && exportPrice > gulfPrice.price + 1) {
        recommendation = `Export to Europe for +$${(exportPrice - localPrice.price).toFixed(2)}/bbl`;
    } else if (best.location === "gulf_coast" && gulfPrice.price > localPrice.price + 0.50) {
        recommendation = `Sell at Gulf Coast for +$${(gulfPrice.price - localPrice.price).toFixed(2)}/bbl`;
    } else {
        recommendation = "Sell locally - transport not justified";
    }

    return {
        localPrice: localPrice.price,
        gulfPrice: gulfPrice.price,
        exportPrice,
        recommendation
    };
}
