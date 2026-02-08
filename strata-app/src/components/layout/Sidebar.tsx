"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavItem {
    label: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { label: "DASHBOARD", href: "/dashboard", icon: "◉" },
    { label: "OPPORTUNITIES", href: "/opportunities", icon: "◆" },
    { label: "MARKET INTEL", href: "/market", icon: "▤" },
    { label: "ALERTS", href: "/alerts", icon: "⚠" },
    { label: "SETTINGS", href: "/setup", icon: "⚙" },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

/**
 * Sidebar Component - Industrial Brutalism Style
 * Collapsible: 64px (icons only) ↔ 240px (full labels)
 * Responsive: Hidden on mobile, shown as overlay when mobileOpen is true
 */
export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    // Persist sidebar state in localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
            setIsExpanded(saved === "true");
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem("sidebar-expanded", String(newState));
    };

    // Close mobile menu when navigating
    const handleNavClick = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white border-r-2 border-black flex flex-col z-50 transition-all duration-200
                ${isExpanded ? "w-sidebar" : "w-16"}
                ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}
        >
            {/* Logo Section */}
            <div className="border-b-2 border-black p-4">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-black flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-mono font-bold text-lg">S</span>
                    </div>
                    {isExpanded && (
                        <div className="overflow-hidden">
                            <h1 className="font-mono font-bold text-xl tracking-tighter">STRATA</h1>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-4">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href === "/dashboard" && pathname === "/");
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3
                                        text-sm font-semibold uppercase tracking-wider
                                        border-l-4 transition-colors
                                        ${isActive
                                            ? "bg-black text-white border-industrial-yellow"
                                            : "text-black border-transparent hover:bg-gray-100 hover:border-black"
                                        }
                                        ${!isExpanded ? "justify-center px-0" : ""}
                                    `}
                                    title={item.label}
                                >
                                    <span className={`text-center ${isExpanded ? "w-5" : "w-full"}`}>
                                        {item.icon}
                                    </span>
                                    {isExpanded && (
                                        <span className="whitespace-nowrap overflow-hidden">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Toggle Button */}
            <div className="border-t-2 border-black">
                <button
                    onClick={toggleSidebar}
                    className="w-full p-4 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <span className="text-lg">
                        {isExpanded ? "◀" : "▶"}
                    </span>
                    {isExpanded && (
                        <span className="text-xs uppercase tracking-wider text-concrete-gray">
                            Collapse
                        </span>
                    )}
                </button>
            </div>

            {/* Bottom section - Status indicator */}
            <div className="border-t-2 border-black p-4">
                <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-forest-green animate-pulse-subtle flex-shrink-0" />
                    {isExpanded && (
                        <span className="text-xs uppercase tracking-wider text-concrete-gray">
                            LIVE DATA
                        </span>
                    )}
                </div>
                {isExpanded && (
                    <p className="text-[10px] text-concrete-gray mt-1 font-mono text-center">
                        LAST UPDATE: {new Date().toLocaleTimeString("en-US", { hour12: false })}
                    </p>
                )}
            </div>
        </aside>
    );
}

// Export sidebar width for layout calculations
export function useSidebarWidth() {
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
            setIsExpanded(saved === "true");
        }

        // Listen for storage changes
        const handleStorage = () => {
            const saved = localStorage.getItem("sidebar-expanded");
            setIsExpanded(saved === "true");
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return isExpanded ? 240 : 64;
}
