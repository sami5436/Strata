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
 * Supports collapsible sidebar
 */
export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

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

        // Check periodically for changes (simple approach)
        const interval = setInterval(handleSidebarChange, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Sidebar - Fixed left */}
            <Sidebar />

            {/* TopBar - Fixed top */}
            <TopBar />

            {/* Main content area with grid background */}
            <main
                className="mt-16 min-h-[calc(100vh-64px)] grid-background transition-all duration-200"
                style={{ marginLeft: sidebarExpanded ? 240 : 64 }}
            >
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
