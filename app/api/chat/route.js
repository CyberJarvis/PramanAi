import { NextResponse } from "next/server";
import { getClimateAnalysis } from "@/lib/api/climate";
import { getDisplacementData } from "@/lib/api/displacement";
import { getConflictData } from "@/lib/api/conflict";

const PERSONAS = {
    "UN Crisis Coordinator": {
        name: "UN Crisis Coordinator",
        prompt: `You are a senior UN OCHA Crisis Coordinator with 20 years of humanitarian field experience.
Analyze the provided real-time data through the lens of humanitarian response coordination.
Focus on: inter-agency coordination, resource mobilization, affected population needs, protection concerns.
Provide actionable recommendations for humanitarian actors.`
    },
    "Climate Data Scientist": {
        name: "Climate Data Scientist",
        prompt: `You are a climate scientist specializing in displacement analytics and climate-migration nexus.
Analyze the provided real-time data through the lens of climate science.
Focus on: climate attribution, environmental trends, vulnerability indices, adaptation strategies.
Use data-driven language and reference scientific frameworks.`
    },
    "Policy Strategist": {
        name: "Policy Strategist",
        prompt: `You are a policy strategist advising governments on migration and displacement policy.
Analyze the provided real-time data through the lens of policy implementation.
Focus on: legal frameworks, bilateral agreements, funding mechanisms, political feasibility.
Be pragmatic and solution-oriented with clear policy recommendations.`
    },
    "Humanitarian Economist": {
        name: "Humanitarian Economist",
        prompt: `You are an economist specializing in disaster economics and forced displacement.
Analyze the provided real-time data through the lens of cost-benefit analysis.
Focus on: ROI of interventions, cost per beneficiary, economic multipliers, fiscal sustainability.
Provide economic analysis with concrete numbers and projections.`
    },
    "Human Rights Investigator": {
        name: "Human Rights Investigator",
        prompt: `You are a human rights investigator specializing in displacement and protection.
Analyze the provided real-time data through the lens of international humanitarian law.
Focus on: rights violations, vulnerable populations, accountability mechanisms, protection gaps.
Be principled and cite relevant conventions and frameworks.`
    }
};

// Extract country name from query
function extractCountry(query) {
    const countries = [
        "Ethiopia", "Somalia", "Sudan", "South Sudan", "Kenya", "Uganda",
        "Yemen", "Syria", "Afghanistan", "Myanmar", "Bangladesh", "India",
        "Pakistan", "Nigeria", "DR Congo", "Haiti", "Venezuela", "Colombia"
    ];

    const queryLower = query.toLowerCase();
    for (const country of countries) {
        if (queryLower.includes(country.toLowerCase())) {
            return country;
        }
    }
    return null;
}

export async function POST(request) {
    try {
        const { query, persona } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Query required" }, { status: 400 });
        }

        const personaConfig = PERSONAS[persona] || PERSONAS["UN Crisis Coordinator"];
        const country = extractCountry(query);

        // Gather real-time data from all integrations
        let context = "";
        let dataGathered = [];

        if (country) {
            // Fetch climate data
            try {
                const climateData = await getClimateAnalysis(country);
                if (climateData && !climateData.error) {
                    context += `\n\n## Climate Data (${country}):\n`;
                    context += `- Temperature: ${climateData.current?.temperature || 'N/A'}°C\n`;
                    context += `- Precipitation: ${climateData.current?.precipitation || 'N/A'} mm\n`;
                    context += `- Drought Index: ${climateData.droughtIndex || 'N/A'}\n`;
                    dataGathered.push("NASA Climate");
                }
            } catch (e) { console.log("Climate fetch error"); }

            // Fetch displacement data
            try {
                const displacementData = await getDisplacementData(country);
                if (displacementData) {
                    context += `\n\n## Displacement Data (${country}):\n`;
                    context += `- Total IDPs: ${displacementData.idps?.toLocaleString() || 'N/A'}\n`;
                    context += `- Refugees: ${displacementData.refugees?.toLocaleString() || 'N/A'}\n`;
                    context += `- Source: UNHCR\n`;
                    dataGathered.push("UNHCR Displacement");
                }
            } catch (e) { console.log("Displacement fetch error"); }

            // Fetch conflict data
            try {
                const conflictData = await getConflictData(country, "2023", "2024");
                if (conflictData?.analysis) {
                    context += `\n\n## Conflict Analysis (${country}):\n`;
                    context += `- Intensity: ${conflictData.analysis.intensity}\n`;
                    context += `- Primary Driver: ${conflictData.analysis.primaryDriver}\n`;
                    context += `- Conflict Index: ${conflictData.analysis.conflictIndex || 'N/A'}\n`;
                    dataGathered.push("INFORM Conflict");
                }
            } catch (e) { console.log("Conflict fetch error"); }
        }

        // If no country detected, add general context
        if (!country) {
            context = `\n\nNote: No specific country was detected in the query. Providing general analysis based on global displacement trends and humanitarian principles.`;
        }

        // Call Groq LLM with gathered context
        const SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

        // Use direct Groq call via Python or fallback
        const response = await fetch(`${SERVICE_URL}/api/chat/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                persona: personaConfig.name,
                system_prompt: personaConfig.prompt,
                context: context,
                data_sources: dataGathered
            })
        });

        if (response.ok) {
            const result = await response.json();
            return NextResponse.json({
                success: true,
                data: {
                    answer: result.answer,
                    persona_used: personaConfig.name,
                    data_sources: dataGathered,
                    country_detected: country
                }
            });
        } else {
            // Fallback: Return context-aware but simple response
            return NextResponse.json({
                success: true,
                data: {
                    answer: generateFallbackResponse(query, country, personaConfig.name, context, dataGathered),
                    persona_used: personaConfig.name,
                    data_sources: dataGathered,
                    country_detected: country
                }
            });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}

function generateFallbackResponse(query, country, persona, context, dataSources) {
    if (country && dataSources.length > 0) {
        return `**${country} Analysis** (${persona})\n\nBased on real-time data from ${dataSources.join(", ")}:\n${context}\n\n---\n\nFor detailed AI-powered analysis, ensure the Python backend is running with your Groq API key configured.`;
    }
    return `As a ${persona}, I can help analyze displacement patterns and humanitarian needs. Please mention a specific country (e.g., "Ethiopia", "Syria", "Myanmar") to get real-time data from NASA, UNHCR, and other sources.\n\nExample queries:\n- "displacement analytics of India"\n- "climate risk in Ethiopia"\n- "humanitarian needs in Syria"`;
}
