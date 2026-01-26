import { NextResponse } from "next/server";

const SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Forward to Python backend
        const pythonFormData = new FormData();
        pythonFormData.append('file', file);

        const response = await fetch(`${SERVICE_URL}/api/documents/upload`, {
            method: 'POST',
            body: pythonFormData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || `Upload failed: ${response.status}`);
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Document Upload Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
