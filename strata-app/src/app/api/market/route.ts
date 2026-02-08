import { NextResponse } from "next/server";

// Simple in-memory cache
interface CacheEntry {
    data: MarketData;
    timestamp: number;
}

interface MarketData {
    prices: {
        wti: PriceData;
        brent: PriceData;
        gasoline: PriceData;
        diesel: PriceData;
    };
    fetchedAt: string;
    source: "live" | "cache" | "mock";
}

interface PriceData {
    price: number;
    change: number;
    changePercent: number;
    unit: string;
}

let cache: CacheEntry | null = null;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch live data from Yahoo Finance (no API key required)
 * CL=F is WTI Crude, BZ=F is Brent Crude
 */
async function fetchYahooFinanceData(): Promise<MarketData> {
    const symbols = ["CL=F", "BZ=F", "RB=F", "HO=F"]; // WTI, Brent, RBOB Gasoline, Heating Oil

    try {
        const results = await Promise.all(
            symbols.map(async (symbol) => {
                const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
                const response = await fetch(url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Yahoo Finance API error for ${symbol}`);
                }

                const data = await response.json();
                const result = data.chart?.result?.[0];
                const quote = result?.indicators?.quote?.[0];
                const meta = result?.meta;

                const currentPrice = meta?.regularMarketPrice || quote?.close?.[quote.close.length - 1] || 0;
                const previousClose = meta?.chartPreviousClose || meta?.previousClose || quote?.close?.[0] || currentPrice;
                const change = currentPrice - previousClose;
                const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

                return {
                    symbol,
                    price: currentPrice,
                    change,
                    changePercent,
                };
            })
        );

        const wtiData = results.find(r => r.symbol === "CL=F");
        const brentData = results.find(r => r.symbol === "BZ=F");
        const gasData = results.find(r => r.symbol === "RB=F");
        const dieselData = results.find(r => r.symbol === "HO=F");

        return {
            prices: {
                wti: {
                    price: parseFloat((wtiData?.price || 71).toFixed(2)),
                    change: parseFloat((wtiData?.change || 0).toFixed(2)),
                    changePercent: parseFloat((wtiData?.changePercent || 0).toFixed(2)),
                    unit: "$/bbl",
                },
                brent: {
                    price: parseFloat((brentData?.price || 75).toFixed(2)),
                    change: parseFloat((brentData?.change || 0).toFixed(2)),
                    changePercent: parseFloat((brentData?.changePercent || 0).toFixed(2)),
                    unit: "$/bbl",
                },
                gasoline: {
                    price: parseFloat((gasData?.price || 2.10).toFixed(3)),
                    change: parseFloat((gasData?.change || 0).toFixed(3)),
                    changePercent: parseFloat((gasData?.changePercent || 0).toFixed(2)),
                    unit: "$/gal",
                },
                diesel: {
                    price: parseFloat((dieselData?.price || 2.25).toFixed(3)),
                    change: parseFloat((dieselData?.change || 0).toFixed(3)),
                    changePercent: parseFloat((dieselData?.changePercent || 0).toFixed(2)),
                    unit: "$/gal",
                },
            },
            fetchedAt: new Date().toISOString(),
            source: "live",
        };
    } catch (error) {
        console.error("Yahoo Finance fetch error:", error);
        throw error;
    }
}

/**
 * Mock data for fallback
 */
function getMockData(): MarketData {
    return {
        prices: {
            wti: { price: 71.50, change: 0.45, changePercent: 0.63, unit: "$/bbl" },
            brent: { price: 75.20, change: 0.38, changePercent: 0.51, unit: "$/bbl" },
            gasoline: { price: 2.10, change: 0.02, changePercent: 0.96, unit: "$/gal" },
            diesel: { price: 2.25, change: -0.01, changePercent: -0.44, unit: "$/gal" },
        },
        fetchedAt: new Date().toISOString(),
        source: "mock",
    };
}

export async function GET() {
    try {
        // Check cache first
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION_MS) {
            return NextResponse.json({
                ...cache.data,
                cached: true,
                cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
            });
        }

        // Fetch live data from Yahoo Finance
        const data = await fetchYahooFinanceData();

        // Update cache
        cache = {
            data,
            timestamp: Date.now(),
        };

        return NextResponse.json({
            ...data,
            cached: false,
        });
    } catch (error) {
        console.error("Market data fetch error:", error);

        // Return cached data if available, even if stale
        if (cache) {
            return NextResponse.json({
                ...cache.data,
                cached: true,
                stale: true,
                cacheAge: Math.floor((Date.now() - cache.timestamp) / 1000),
            });
        }

        // Fall back to mock data on error
        return NextResponse.json({
            ...getMockData(),
            error: "Failed to fetch live data, showing fallback data",
        });
    }
}
