"use client";

import { useData } from "@/lib/DataContext";
import CausalDAG from "@/components/CausalDAG";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import RegionSelector from "@/components/RegionSelector";

export default function CausalGraphPage() {
    const { region, data, changeRegion } = useData();

    // Dynamic pathways based on primary driver from API
    const primaryDriver = data?.risk?.driver || "Climate Vulnerability";

    const pathways = {
        "Climate Vulnerability": [
            { path: "Drought → Crop Failure → Food Prices → Displacement", desc: "Primary pathway through agricultural disruption" },
            { path: "Drought → Water Scarcity → Income Loss → Displacement", desc: "Secondary pathway through livelihood disruption" }
        ],
        "Conflict/Violence": [
            { path: "Armed Conflict → Civilian Targeting → Safety Threat → Displacement", desc: "Primary pathway through direct violence" },
            { path: "Conflict → Infrastructure Collapse → Service Loss → Displacement", desc: "Secondary pathway through systemic breakdown" }
        ],
        "Governance Failure": [
            { path: "State Collapse → Law Breakdown → Insecurity → Displacement", desc: "Primary pathway through governance vacuum" },
            { path: "Corruption → Resource Misallocation → Poverty → Displacement", desc: "Secondary pathway through economic erosion" }
        ],
        "Weather Shock": [
            { path: "Extreme Weather → Property Damage → Shelter Loss → Displacement", desc: "Primary pathway through immediate impact" },
            { path: "Flooding → Contamination → Health Crisis → Displacement", desc: "Secondary pathway through cascading effects" }
        ]
    };

    const activePathways = pathways[primaryDriver] || pathways["Climate Vulnerability"];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Causal Graph Visualization</h1>
                    <p className="text-gray-400">
                        Directed Acyclic Graph (DAG) showing assumed causal pathways for <span className="text-blue-400 font-semibold">{region}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
                    <ConfidenceIndicator level={data?.confidence?.level || "High"} score={data?.confidence?.score || 91} />
                </div>
            </div>

            {/* Graph Container */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <h2 className="text-xl font-semibold text-white mb-8">
                    {primaryDriver.includes("Climate") ? "Climate-Displacement" :
                        primaryDriver.includes("Conflict") ? "Conflict-Displacement" :
                            primaryDriver.includes("Governance") ? "Governance-Displacement" : "Shock-Displacement"} Causal Structure
                </h2>
                <CausalDAG country={region} />
            </div>

            {/* Explanation Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <h3 className="text-lg font-semibold text-white mb-4">Active Causal Pathways</h3>
                    <ul className="space-y-3">
                        {activePathways.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                                <span className="text-sm text-gray-300">
                                    <strong className="text-white">{item.path}</strong>:
                                    {" "}{item.desc}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <h3 className="text-lg font-semibold text-amber-400 mb-4">Model Assumptions</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                            <span className="text-sm text-gray-300">
                                Causal structure derived from domain expertise and prior studies
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                            <span className="text-sm text-gray-300">
                                No unmeasured confounders between mediators
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                            <span className="text-sm text-gray-300">
                                Temporal ordering: {primaryDriver.toLowerCase()} precedes displacement effects
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Interpretation Guide */}
            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-start gap-4">
                    <svg className="w-6 h-6 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-blue-400 font-semibold mb-2">How to Interpret This Graph</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Arrows represent assumed causal relationships for <strong className="text-white">{region}</strong>.
                            <strong className="text-white"> Thicker lines</strong> indicate stronger causal influence.
                            The <strong className="text-amber-400">highlighted node</strong> shows the primary displacement driver identified by the model.
                            Edge percentages show the relative contribution of each factor to the compounding stress.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
