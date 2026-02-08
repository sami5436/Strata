/**
 * Market data types for EIA API integration
 */

export interface PriceData {
    price: number;
    change: number;
    changePercent: number;
    unit: string;
}

export interface MarketPrices {
    wti: PriceData;
    brent: PriceData;
    gasoline: PriceData;
    diesel: PriceData;
}

export interface MarketDataResponse {
    prices: MarketPrices;
    fetchedAt: string;
    source: "live" | "cache" | "mock";
    cached?: boolean;
    stale?: boolean;
    cacheAge?: number;
    error?: string;
}

export interface DifferentialRequest {
    apiGravity: number;
    sulfurContent: number;
    wtiPrice: number;
}

export interface DifferentialResponse {
    inputSpecs: {
        apiGravity: number;
        sulfurContent: number;
    };
    differentials: {
        lightPremium: number;
        sweetPremium: number;
        totalDifferential: number;
    };
    pricing: {
        wtiBase: number;
        yourCrudeValue: number;
        premiumVsWti: number;
    };
    methodology: string;
}

/**
 * Fetch market prices from API
 */
export async function fetchMarketPrices(): Promise<MarketDataResponse> {
    const response = await fetch("/api/market");
    if (!response.ok) {
        throw new Error(`Failed to fetch market data: ${response.status}`);
    }
    return response.json();
}

/**
 * Calculate crude differential
 */
export async function calculateDifferential(
    request: DifferentialRequest
): Promise<DifferentialResponse> {
    const response = await fetch("/api/market/calculate-differentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error(`Failed to calculate differential: ${response.status}`);
    }
    return response.json();
}
