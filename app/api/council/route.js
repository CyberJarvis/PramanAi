import { NextResponse } from "next/server";
import { pythonService } from "@/lib/pythonService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { scenarioAName, scenarioADesc, scenarioBName, scenarioBDesc } = body;

        if (!scenarioAName || !scenarioBName) {
            return NextResponse.json(
                { error: "Both scenario names are required" },
                { status: 400 }
            );
        }

        // Call Python Backend Service
        const SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

        const response = await fetch(`${SERVICE_URL}/api/council/debate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                scenario_a_name: scenarioAName,
                scenario_a_desc: scenarioADesc,
                scenario_b_name: scenarioBName,
                scenario_b_desc: scenarioBDesc
            })
        });

        if (!response.ok) {
            throw new Error(`Python service error: ${response.status}`);
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Council API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
