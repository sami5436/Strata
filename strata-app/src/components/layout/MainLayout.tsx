import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * MainLayout Component - Industrial Brutalism Style
 * Combines Sidebar + TopBar + Main content area with grid background
 */
export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Sidebar - Fixed left */}
            <Sidebar />

            {/* TopBar - Fixed top */}
            <TopBar />

            {/* Main content area with grid background */}
            <main className="ml-sidebar mt-16 min-h-[calc(100vh-64px)] grid-background">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
