import { NextResponse } from "next/server";

const SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function POST(request) {
    try {
        const body = await request.json();
        const { query, persona } = body;

        if (!query) {
            return NextResponse.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }

        const response = await fetch(`${SERVICE_URL}/api/documents/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, persona: persona || "General" })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `Query failed: ${response.status}`);
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Document Query Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
