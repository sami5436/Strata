import { NextResponse } from "next/server";
import { analyzeFuturesCurve, calculateStorageArbitrage, FuturesCurve } from "@/lib/domain/derivatives";

/**
 * GET /api/futures/curve
 * 
 * Fetches WTI futures curve from Yahoo Finance
 * Returns spot and forward month prices for contango/backwardation analysis
 */

// CME WTI Crude Oil Futures symbols for Yahoo Finance
// CL=F is front month, then CLXXY.NYM for specific months
// X = month code (F=Jan, G=Feb, H=Mar, J=Apr, K=May, M=Jun, N=Jul, Q=Aug, U=Sep, V=Oct, X=Nov, Z=Dec)
// YY = year

function getMonthCode(month: number): string {
    const codes = ["F", "G", "H", "J", "K", "M", "N", "Q", "U", "V", "X", "Z"];
    return codes[(month - 1) % 12];
}

function getFuturesSymbols(): { symbol: string; monthsOut: number }[] {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear() % 100; // Last 2 digits

    const symbols: { symbol: string; monthsOut: number }[] = [];

    // Front month (1 month out)
    let m1Month = currentMonth + 1;
    let m1Year = currentYear;
    if (m1Month > 12) { m1Month -= 12; m1Year++; }
    symbols.push({ symbol: `CL${getMonthCode(m1Month)}${m1Year}.NYM`, monthsOut: 1 });

    // 2 months out
    let m2Month = currentMonth + 2;
    let m2Year = currentYear;
    if (m2Month > 12) { m2Month -= 12; m2Year++; }
    symbols.push({ symbol: `CL${getMonthCode(m2Month)}${m2Year}.NYM`, monthsOut: 2 });

    // 3 months out
    let m3Month = currentMonth + 3;
    let m3Year = currentYear;
    if (m3Month > 12) { m3Month -= 12; m3Year++; }
    symbols.push({ symbol: `CL${getMonthCode(m3Month)}${m3Year}.NYM`, monthsOut: 3 });

    // 6 months out
    let m6Month = currentMonth + 6;
    let m6Year = currentYear;
    if (m6Month > 12) { m6Month -= 12; m6Year++; }
    symbols.push({ symbol: `CL${getMonthCode(m6Month)}${m6Year}.NYM`, monthsOut: 6 });

    // 12 months out
    let m12Month = currentMonth;
    let m12Year = currentYear + 1;
    symbols.push({ symbol: `CL${getMonthCode(m12Month)}${m12Year}.NYM`, monthsOut: 12 });

    return symbols;
}

async function fetchYahooPrice(symbol: string): Promise<number | null> {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data?.chart?.result?.[0]?.meta?.regularMarketPrice || null;
    } catch {
        return null;
    }
}

export async function GET(): Promise<NextResponse> {
    try {
        // Fetch spot price (front month)
        const spotPrice = await fetchYahooPrice("CL=F");

        if (!spotPrice) {
            // Return mock data if Yahoo fails
            return NextResponse.json({
                curve: {
                    spot: 72.50,
                    m1: 72.75,
                    m2: 73.00,
                    m3: 73.50,
                    m6: 74.25,
                    m12: 75.00,
                    isContango: true,
                    slope: 0.21,
                    annualizedContango: 3.45
                } as FuturesCurve,
                storageArbitrage: {
                    m3: { profit: 0.25, returnPct: 0.34, viable: false },
                    m6: { profit: 0.50, returnPct: 0.69, viable: false },
                    m12: { profit: 0.75, returnPct: 1.03, viable: true }
                },
                source: "mock",
                timestamp: new Date().toISOString()
            });
        }

        // Fetch forward months
        const futuresSymbols = getFuturesSymbols();
        const forwardPrices: Record<string, number> = {};

        for (const { symbol, monthsOut } of futuresSymbols) {
            const price = await fetchYahooPrice(symbol);
            if (price) {
                forwardPrices[`m${monthsOut}`] = price;
            }
        }

        // Use fetched prices or estimate from spot
        const m1 = forwardPrices.m1 || spotPrice + 0.25;
        const m2 = forwardPrices.m2 || spotPrice + 0.50;
        const m3 = forwardPrices.m3 || spotPrice + 0.75;
        const m6 = forwardPrices.m6 || spotPrice + 1.50;
        const m12 = forwardPrices.m12 || spotPrice + 2.50;

        // Analyze the curve
        const curve = analyzeFuturesCurve(spotPrice, m1, m2, m3, m6, m12);

        // Calculate storage arbitrage opportunities
        const storageCost = 0.50; // $/bbl/month typical Cushing rate
        const storageArbitrage = {
            m3: calculateStorageArbitrage(curve, 3, storageCost),
            m6: calculateStorageArbitrage(curve, 6, storageCost),
            m12: calculateStorageArbitrage(curve, 12, storageCost)
        };

        return NextResponse.json({
            curve,
            storageArbitrage,
            source: "yahoo_finance",
            symbols: { spot: "CL=F", ...Object.fromEntries(futuresSymbols.map(s => [s.monthsOut, s.symbol])) },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Futures curve fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch futures curve" },
            { status: 500 }
        );
    }
}
