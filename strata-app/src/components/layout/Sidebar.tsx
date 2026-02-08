"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

/**
 * Sidebar Component - Industrial Brutalism Style
 * 240px fixed width, left side navigation
 */
export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 w-sidebar h-screen bg-white border-r-2 border-black flex flex-col z-50">
            {/* Logo Section */}
            <div className="border-b-2 border-black p-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black flex items-center justify-center">
                        <span className="text-white font-mono font-bold text-lg">S</span>
                    </div>
                    <div>
                        <h1 className="font-mono font-bold text-xl tracking-tighter">STRATA</h1>
                        <p className="text-[10px] uppercase tracking-widest text-concrete-gray">
                            OIL TRADING INTEL
                        </p>
                    </div>
                </div>
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
                    border-l-4 transition-none
                    ${isActive
                                            ? "bg-black text-white border-industrial-yellow"
                                            : "text-black border-transparent hover:bg-gray-100 hover:border-black"
                                        }
                  `}
                                >
                                    <span className="w-5 text-center">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom section - Status indicator */}
            <div className="border-t-2 border-black p-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-forest-green animate-pulse-subtle" />
                    <span className="text-xs uppercase tracking-wider text-concrete-gray">
                        LIVE DATA
                    </span>
                </div>
                <p className="text-[10px] text-concrete-gray mt-1 font-mono">
                    LAST UPDATE: {new Date().toLocaleTimeString("en-US", { hour12: false })}
                </p>
            </div>
        </aside>
    );
}
