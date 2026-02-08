"use client";

import { useSetupStore } from "@/lib/store";
import { useState, useEffect } from "react";

/**
 * TopBar Component - Fixed header with company info and status
 * Responsive to sidebar collapsed/expanded state
 */
export function TopBar() {
    const store = useSetupStore();
    const hasSetup = store.companyName && store.companyType;
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    // Listen for sidebar state changes
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
            setSidebarExpanded(saved === "true");
        }

        // Check periodically for changes
        const interval = setInterval(() => {
            const current = localStorage.getItem("sidebar-expanded");
            setSidebarExpanded(current === "true");
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const getCompanyTypeBadge = () => {
        if (!store.crudeClassification || !store.companyType) return null;
        const typeLabel = store.companyType.charAt(0).toUpperCase() + store.companyType.slice(1);
        const crudeLabel = `${store.crudeClassification.density} ${store.crudeClassification.sulfur}`;
        return `${crudeLabel} ${typeLabel}`;
    };

    return (
        <header
            className="fixed top-0 right-0 h-topbar bg-black text-white z-40 flex items-center justify-between px-6 border-b-2 border-black transition-all duration-200"
            style={{ left: sidebarExpanded ? 240 : 64 }}
        >
            {/* Left: Title */}
            <div className="flex items-center gap-4">
                <h1 className="font-semibold uppercase tracking-wider text-sm">
                    Trading Intelligence
                </h1>
                <span className="text-concrete-gray">|</span>
                <span className="text-concrete-gray uppercase text-xs tracking-wider">
                    Real-Time Market Analysis
                </span>
            </div>

            {/* Center: Live Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 border border-forest-green">
                <div className="w-2 h-2 bg-forest-green animate-pulse-subtle" />
                <span className="text-xs uppercase tracking-wider text-forest-green font-semibold">
                    Markets Open
                </span>
            </div>

            {/* Right: Company Info + Time */}
            <div className="flex items-center gap-4">
                <span className="font-mono text-sm">
                    {new Date().toLocaleTimeString("en-US", { hour12: false })}
                </span>
                <span className="text-concrete-gray">CST</span>

                {hasSetup && (
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-600">
                        <span className="text-sm font-semibold uppercase tracking-wider">
                            {store.companyName}
                        </span>
                        {getCompanyTypeBadge() && (
                            <span className="text-xs uppercase tracking-wider px-2 py-1 bg-gray-700 text-white border border-gray-500">
                                {getCompanyTypeBadge()}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
