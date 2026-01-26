import { NextResponse } from "next/server";
import { pythonService } from "@/lib/pythonService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { country, interventionStrength, currentRain } = body;

        if (!country) {
            return NextResponse.json(
                { error: "Country parameter is required" },
                { status: 400 }
            );
        }

        // Call Python Backend Service
        const result = await pythonService.runSimulation(
            country,
            interventionStrength || 0.0,
            currentRain || 0.0
        );

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Simulation API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
