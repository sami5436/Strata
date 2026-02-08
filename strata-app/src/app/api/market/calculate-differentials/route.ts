import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering since we use request.nextUrl
export const dynamic = 'force-dynamic';

interface DifferentialRequest {
    apiGravity: number;
    sulfurContent: number;
    wtiPrice: number;
}

interface DifferentialResponse {
    inputSpecs: {
        apiGravity: number;
        sulfurContent: number;
    };
    differentials: {
        lightPremium: number;
        sweetPremium: number;
        totalDifferential: number;
    };
    pricing: {
        wtiBase: number;
        yourCrudeValue: number;
        premiumVsWti: number;
    };
    methodology: string;
}

/**
 * Calculate quality differential based on crude specifications
 * 
 * Formula approximation:
 * - Light premium: (API - 30) × $0.50/degree
 * - Sweet premium: (0.5 - Sulfur%) × $10/point
 * 
 * This is a simplified model. Real differentials depend on:
 * - Refinery configurations
 * - Product yields
 * - Transportation costs
 * - Market conditions
 */
function calculateDifferential(
    apiGravity: number,
    sulfurContent: number,
    wtiPrice: number
): DifferentialResponse {
    // Light crude premium/discount
    // WTI is approximately 40° API, we use 30 as baseline for the premium calculation
    // Heavier oil (lower API) = discount, Lighter oil (higher API) = premium
    const lightPremium = (apiGravity - 30) * 0.5;

    // Sweet crude premium/discount
    // Lower sulfur = premium (easier to refine)
    // 0.5% is threshold for sweet/sour
    const sweetPremium = (0.5 - sulfurContent) * 10;

    // Total differential
    const totalDifferential = lightPremium + sweetPremium;

    // Your crude's estimated value
    const yourCrudeValue = wtiPrice + totalDifferential;

    return {
        inputSpecs: {
            apiGravity,
            sulfurContent,
        },
        differentials: {
            lightPremium: parseFloat(lightPremium.toFixed(2)),
            sweetPremium: parseFloat(sweetPremium.toFixed(2)),
            totalDifferential: parseFloat(totalDifferential.toFixed(2)),
        },
        pricing: {
            wtiBase: wtiPrice,
            yourCrudeValue: parseFloat(yourCrudeValue.toFixed(2)),
            premiumVsWti: parseFloat(totalDifferential.toFixed(2)),
        },
        methodology: "Simplified model: Light premium = (API - 30) × $0.50, Sweet premium = (0.5 - Sulfur%) × $10",
    };
}

export async function POST(request: NextRequest) {
    try {
        const body: DifferentialRequest = await request.json();

        // Validate inputs
        if (
            typeof body.apiGravity !== "number" ||
            typeof body.sulfurContent !== "number" ||
            typeof body.wtiPrice !== "number"
        ) {
            return NextResponse.json(
                { error: "Invalid input. Required: apiGravity, sulfurContent, wtiPrice (all numbers)" },
                { status: 400 }
            );
        }

        // Validate ranges
        if (body.apiGravity < 10 || body.apiGravity > 50) {
            return NextResponse.json(
                { error: "API Gravity must be between 10 and 50" },
                { status: 400 }
            );
        }

        if (body.sulfurContent < 0 || body.sulfurContent > 5) {
            return NextResponse.json(
                { error: "Sulfur content must be between 0 and 5%" },
                { status: 400 }
            );
        }

        const result = calculateDifferential(
            body.apiGravity,
            body.sulfurContent,
            body.wtiPrice
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error("Differential calculation error:", error);
        return NextResponse.json(
            { error: "Failed to calculate differential" },
            { status: 500 }
        );
    }
}

// Also support GET with query params for simple testing
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const apiGravity = parseFloat(searchParams.get("api") || "35");
    const sulfurContent = parseFloat(searchParams.get("sulfur") || "0.3");
    const wtiPrice = parseFloat(searchParams.get("wti") || "80");

    const result = calculateDifferential(apiGravity, sulfurContent, wtiPrice);

    return NextResponse.json(result);
}
