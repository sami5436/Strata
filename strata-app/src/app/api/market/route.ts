import { NextResponse } from "next/server";

// EIA API series IDs for petroleum spot prices
const SERIES_IDS = {
    WTI: "RWTC",      // WTI Cushing Oklahoma Spot Price
    BRENT: "RBRTE",   // Brent Europe Spot Price
    GASOLINE: "EER_EPMRR_PF4_RGC_DPG", // RBOB Gasoline Regular
    DIESEL: "EER_EPD2DXL0_PF4_RGC_DPG", // Diesel No. 2
};

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
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Mock data for development/demo when EIA API key is not configured
 */
function getMockData(): MarketData {
    // Simulated realistic prices with slight randomization
    const baseWti = 80.0 + (Math.random() - 0.5) * 2;
    const baseBrent = baseWti + 3.5 + (Math.random() - 0.5);
    const baseGasoline = 2.45 + (Math.random() - 0.5) * 0.1;
    const baseDiesel = 2.78 + (Math.random() - 0.5) * 0.1;

    return {
        prices: {
            wti: {
                price: parseFloat(baseWti.toFixed(2)),
                change: parseFloat((Math.random() * 2 - 1).toFixed(2)),
                changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
                unit: "$/bbl",
            },
            brent: {
                price: parseFloat(baseBrent.toFixed(2)),
                change: parseFloat((Math.random() * 2 - 1).toFixed(2)),
                changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
                unit: "$/bbl",
            },
            gasoline: {
                price: parseFloat(baseGasoline.toFixed(3)),
                change: parseFloat((Math.random() * 0.1 - 0.05).toFixed(3)),
                changePercent: parseFloat((Math.random() * 4 - 2).toFixed(2)),
                unit: "$/gal",
            },
            diesel: {
                price: parseFloat(baseDiesel.toFixed(3)),
                change: parseFloat((Math.random() * 0.1 - 0.05).toFixed(3)),
                changePercent: parseFloat((Math.random() * 4 - 2).toFixed(2)),
                unit: "$/gal",
            },
        },
        fetchedAt: new Date().toISOString(),
        source: "mock",
    };
}

/**
 * Fetch live data from EIA API
 */
async function fetchEIAData(apiKey: string): Promise<MarketData> {
    const baseUrl = "https://api.eia.gov/v2/petroleum/pri/spt/data/";

    // Fetch WTI and Brent crude prices
    const crudeUrl = `${baseUrl}?api_key=${apiKey}&frequency=daily&data[0]=value&facets[series][]=RWTC&facets[series][]=RBRTE&sort[0][column]=period&sort[0][direction]=desc&length=2`;

    try {
        const response = await fetch(crudeUrl, {
            next: { revalidate: 900 }, // Next.js cache for 15 minutes
        });

        if (!response.ok) {
            throw new Error(`EIA API responded with ${response.status}`);
        }

        const data = await response.json();
        const records = data.response?.data || [];

        // Parse WTI price
        const wtiRecords = records.filter((r: Record<string, string>) => r.series === "RWTC");
        const wtiLatest = wtiRecords[0]?.value ? parseFloat(wtiRecords[0].value) : 80.0;
        const wtiPrevious = wtiRecords[1]?.value ? parseFloat(wtiRecords[1].value) : wtiLatest;
        const wtiChange = wtiLatest - wtiPrevious;

        // Parse Brent price
        const brentRecords = records.filter((r: Record<string, string>) => r.series === "RBRTE");
        const brentLatest = brentRecords[0]?.value ? parseFloat(brentRecords[0].value) : 83.5;
        const brentPrevious = brentRecords[1]?.value ? parseFloat(brentRecords[1].value) : brentLatest;
        const brentChange = brentLatest - brentPrevious;

        return {
            prices: {
                wti: {
                    price: wtiLatest,
                    change: parseFloat(wtiChange.toFixed(2)),
                    changePercent: parseFloat(((wtiChange / wtiPrevious) * 100).toFixed(2)),
                    unit: "$/bbl",
                },
                brent: {
                    price: brentLatest,
                    change: parseFloat(brentChange.toFixed(2)),
                    changePercent: parseFloat(((brentChange / brentPrevious) * 100).toFixed(2)),
                    unit: "$/bbl",
                },
                // For demo, use approximations for refined products
                gasoline: {
                    price: 2.45,
                    change: 0.03,
                    changePercent: 1.24,
                    unit: "$/gal",
                },
                diesel: {
                    price: 2.78,
                    change: -0.02,
                    changePercent: -0.71,
                    unit: "$/gal",
                },
            },
            fetchedAt: new Date().toISOString(),
            source: "live",
        };
    } catch (error) {
        console.error("EIA API fetch error:", error);
        throw error;
    }
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

        const apiKey = process.env.EIA_API_KEY;

        let data: MarketData;

        if (!apiKey || apiKey === "your_api_key_here") {
            // Use mock data if no API key configured
            console.log("EIA API key not configured, using mock data");
            data = getMockData();
        } else {
            // Fetch live data
            data = await fetchEIAData(apiKey);
        }

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
            error: "Failed to fetch live data, showing demo data",
        });
    }
}
