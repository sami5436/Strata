"use client";

import { useSetupStore } from "@/lib/store";
import { useState, useEffect } from "react";

/**
 * TopBar Component - Fixed header with company info and status
 * Responsive to sidebar collapsed/expanded state and mobile screens
 */
export function TopBar() {
    const store = useSetupStore();
    const hasSetup = store.companyName && store.companyType;
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        // Listen for mobile menu close events
        const handleMobileMenuChange = (e: CustomEvent) => {
            setMobileMenuOpen(e.detail);
        };

        window.addEventListener("mobileMenuToggle", handleMobileMenuChange as unknown as EventListener);

        return () => {
            clearInterval(interval);
            window.removeEventListener("mobileMenuToggle", handleMobileMenuChange as unknown as EventListener);
        };
    }, []);

    const getCompanyTypeBadge = () => {
        if (!store.crudeClassification || !store.companyType) return null;
        const typeLabel = store.companyType.charAt(0).toUpperCase() + store.companyType.slice(1);
        const crudeLabel = `${store.crudeClassification.density} ${store.crudeClassification.sulfur}`;
        return `${crudeLabel} ${typeLabel}`;
    };

    const toggleMobileMenu = () => {
        const newState = !mobileMenuOpen;
        setMobileMenuOpen(newState);
        window.dispatchEvent(new CustomEvent("mobileMenuToggle", { detail: newState }));
    };

    return (
        <header
            className={`
                fixed top-0 right-0 h-topbar bg-black text-white z-40 flex items-center justify-between px-4 md:px-6 border-b-2 border-black transition-all duration-200
                left-0
                ${sidebarExpanded ? 'md:left-[240px]' : 'md:left-[64px]'}
            `}
        >
            {/* Mobile: Hamburger Menu */}
            <button
                className="md:hidden p-2 -ml-2 hover:bg-gray-800 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                <div className="w-5 h-4 flex flex-col justify-between">
                    <span className={`block h-0.5 bg-white transition-all duration-200 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                    <span className={`block h-0.5 bg-white transition-all duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 bg-white transition-all duration-200 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
            </button>

            {/* Left: Title - Simplified on mobile */}
            <div className="flex items-center gap-2 md:gap-4">
                <h1 className="font-semibold uppercase tracking-wider text-xs md:text-sm">
                    <span className="hidden sm:inline">Trading Intelligence</span>
                    <span className="sm:hidden">STRATA</span>
                </h1>
                <span className="hidden md:inline text-concrete-gray">|</span>
                <span className="hidden md:inline text-concrete-gray uppercase text-xs tracking-wider">
                    Real-Time Market Analysis
                </span>
            </div>

            {/* Center: Live Indicator - Hidden on smallest screens */}
            <div className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1 border border-forest-green">
                <div className="w-2 h-2 bg-forest-green animate-pulse-subtle" />
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-forest-green font-semibold">
                    <span className="hidden md:inline">Markets Open</span>
                    <span className="md:hidden">LIVE</span>
                </span>
            </div>

            {/* Right: Company Info + Time - Simplified on mobile */}
            <div className="flex items-center gap-2 md:gap-4">
                <span className="font-mono text-xs md:text-sm">
                    {new Date().toLocaleTimeString("en-US", { hour12: false })}
                </span>
                <span className="hidden sm:inline text-concrete-gray text-xs">CST</span>

                {hasSetup && (
                    <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-gray-600">
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
