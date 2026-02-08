"use client";

import useSWR from "swr";
import { Card, CardHeader, CardTitle, PriceIndicator } from "@/components/ui";
import { fetchMarketPrices, MarketDataResponse, PriceData } from "@/lib/api";

// 15 minute refresh interval
const REFRESH_INTERVAL = 15 * 60 * 1000;

interface PriceCellProps {
    label: string;
    data: PriceData | undefined;
    loading: boolean;
}

/**
 * Individual price cell within the grid
 */
function PriceCell({ label, data, loading }: PriceCellProps) {
    if (loading || !data) {
        return (
            <div className="p-4 border-2 border-black bg-gray-50">
                <p className="text-xs uppercase tracking-widest text-concrete-gray mb-2">
                    {label}
                </p>
                <div className="h-8 bg-gray-200 animate-pulse mb-2" />
                <div className="h-4 w-20 bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="p-4 border-2 border-black bg-white">
            <p className="text-xs uppercase tracking-widest text-concrete-gray mb-2">
                {label}
            </p>
            <div className="flex items-baseline gap-2">
                <span className="font-mono font-bold text-3xl" data-metric>
                    {data.unit === "$/gal"
                        ? data.price.toFixed(3)
                        : data.price.toFixed(2)
                    }
                </span>
                <span className="font-mono text-sm text-concrete-gray">{data.unit}</span>
            </div>
            <div className={`flex items-center gap-1 mt-1 ${data.change >= 0 ? "text-forest-green" : "text-safety-red"}`}>
                <span className="text-sm font-bold">{data.change >= 0 ? "▲" : "▼"}</span>
                <span className="font-mono text-sm">
                    {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}
                </span>
                <span className="font-mono text-xs opacity-75">
                    ({data.changePercent >= 0 ? "+" : ""}{data.changePercent.toFixed(2)}%)
                </span>
            </div>
        </div>
    );
}

/**
 * Format relative time for "last updated"
 */
function getRelativeTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins === 1) return "1 minute ago";
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
}

/**
 * MarketPricesWidget - Live market data display
 * 2×2 grid showing WTI, Brent, Gasoline, Diesel
 */
export function MarketPricesWidget() {
    const { data, error, isLoading } = useSWR<MarketDataResponse>(
        "/api/market",
        fetchMarketPrices,
        {
            refreshInterval: REFRESH_INTERVAL,
            revalidateOnFocus: false,
            dedupingInterval: 60000, // Dedupe requests within 1 minute
        }
    );

    const hasError = error || data?.error;

    return (
        <Card padding="none" className="overflow-hidden">
            <CardHeader className="px-4 pt-4 pb-3 mb-0 border-b-0">
                <CardTitle>Market Prices</CardTitle>
                <div className="flex items-center gap-2">
                    {data?.source === "mock" && (
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-industrial-yellow text-black border border-black">
                            DEMO
                        </span>
                    )}
                    {data?.cached && (
                        <span className="text-[10px] uppercase tracking-wider text-concrete-gray">
                            CACHED
                        </span>
                    )}
                </div>
            </CardHeader>

            {hasError ? (
                <div className="px-4 pb-4">
                    <div className="border-2 border-safety-red bg-safety-red/5 p-4 text-center">
                        <p className="text-sm font-semibold uppercase tracking-wider text-safety-red">
                            Market Data Unavailable
                        </p>
                        <p className="text-xs text-concrete-gray mt-1">
                            {typeof data?.error === "string" ? data.error : "Failed to load prices"}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* 2×2 Price Grid */}
                    <div className="grid grid-cols-2">
                        <PriceCell
                            label="WTI Cushing"
                            data={data?.prices.wti}
                            loading={isLoading}
                        />
                        <PriceCell
                            label="Brent"
                            data={data?.prices.brent}
                            loading={isLoading}
                        />
                        <PriceCell
                            label="Gasoline RBOB"
                            data={data?.prices.gasoline}
                            loading={isLoading}
                        />
                        <PriceCell
                            label="Diesel No. 2"
                            data={data?.prices.diesel}
                            loading={isLoading}
                        />
                    </div>

                    {/* Last Updated */}
                    <div className="px-4 py-2 border-t-2 border-black bg-gray-50">
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray">
                            {isLoading ? (
                                "Loading..."
                            ) : data?.fetchedAt ? (
                                `Last updated: ${getRelativeTime(data.fetchedAt)} • Source: ${data.source?.toUpperCase()}`
                            ) : (
                                "Waiting for data..."
                            )}
                        </p>
                    </div>
                </>
            )}
        </Card>
    );
}
