/**
 * TopBar Component - Industrial Brutalism Style
 * Company name placeholder, current time, status indicators
 */
export function TopBar() {
    return (
        <header className="fixed top-0 left-sidebar right-0 h-16 bg-white border-b-2 border-black flex items-center justify-between px-6 z-40">
            {/* Left: Page title area */}
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                    Trading Intelligence
                </h2>
                <div className="w-px h-6 bg-black" />
                <span className="text-sm text-concrete-gray uppercase tracking-wider">
                    Real-Time Market Analysis
                </span>
            </div>

            {/* Right: Company info and status */}
            <div className="flex items-center gap-6">
                {/* Market status indicator */}
                <div className="flex items-center gap-2 border-2 border-black px-3 py-1.5">
                    <div className="w-2 h-2 bg-forest-green" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                        MARKETS OPEN
                    </span>
                </div>

                {/* Time display */}
                <div className="text-right">
                    <p className="font-mono text-lg font-bold" data-metric>
                        14:32:15
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-concrete-gray">
                        CST
                    </p>
                </div>

                {/* Company placeholder */}
                <div className="border-l-2 border-black pl-4">
                    <p className="text-sm font-semibold uppercase tracking-wider">
                        ACME OIL CO.
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-concrete-gray">
                        INTEGRATED • 50K BPD
                    </p>
                </div>
            </div>
        </header>
    );
}
