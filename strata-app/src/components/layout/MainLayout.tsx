"use client";

import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * MainLayout Component - Industrial Brutalism Style
 * Combines Sidebar + TopBar + Main content area with grid background
 * Supports collapsible sidebar and responsive mobile layout
 */
export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Listen for sidebar state changes
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
            setSidebarExpanded(saved === "true");
        }

        // Custom event listener for sidebar toggle
        const handleSidebarChange = () => {
            const current = localStorage.getItem("sidebar-expanded");
            setSidebarExpanded(current === "true");
        };

        // Listen for mobile menu toggle
        const handleMobileMenuChange = (e: CustomEvent) => {
            setMobileMenuOpen(e.detail);
        };

        // Check periodically for changes (simple approach)
        const interval = setInterval(handleSidebarChange, 100);

        window.addEventListener("mobileMenuToggle" as any, handleMobileMenuChange as any);

        return () => {
            clearInterval(interval);
            window.removeEventListener("mobileMenuToggle" as any, handleMobileMenuChange as any);
        };
    }, []);

    // Close mobile menu when clicking overlay
    const handleOverlayClick = () => {
        setMobileMenuOpen(false);
        window.dispatchEvent(new CustomEvent("mobileMenuToggle", { detail: false }));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={handleOverlayClick}
                />
            )}

            {/* Sidebar - Fixed left, hidden on mobile unless menu is open */}
            <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={handleOverlayClick} />

            {/* TopBar - Fixed top */}
            <TopBar />

            {/* Main content area with grid background */}
            <main
                className={`
                    mt-16 min-h-[calc(100vh-64px)] grid-background transition-all duration-200
                    ml-0 
                    ${sidebarExpanded ? 'md:ml-[240px]' : 'md:ml-[64px]'}
                `}
            >
                {/* Use CSS classes for responsive margin instead of inline style */}
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
