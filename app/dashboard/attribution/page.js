"use client";

import { useData } from "@/lib/DataContext";
import RegionSelector from "@/components/RegionSelector";
import AttributionBreakdown from "@/components/AttributionBreakdown";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import AssumptionsPanel from "@/components/AssumptionsPanel";

export default function AttributionPage() {
    const { region, data, loading, error, changeRegion } = useData();

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-12 text-center">
                <div className="inline-flex items-center gap-3">
                    <svg className="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-white">Loading attribution data...</span>
                </div>
            </div>
        );
    }

    const attribution = data?.attribution;
    const confidence = data?.confidence;
    const displacement = data?.displacement;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Causal Attribution Engine</h1>
                    <p className="text-gray-400">
                        Breakdown of causal factors driving population displacement
                    </p>
                </div>
                <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
            </div>

            {/* Region Info Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Region</div>
                        <div className="text-xl font-bold text-white">{data?.region?.country}</div>
                        <div className="text-sm text-gray-400">
                            {data?.region?.coordinates?.lat?.toFixed(2)}°, {data?.region?.coordinates?.lon?.toFixed(2)}°
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Displacement</div>
                        <div className="text-3xl font-bold text-white">
                            {displacement?.totalDisplaced
                                ? `${(displacement.totalDisplaced / 1000000).toFixed(2)}M`
                                : "N/A"
                            }
                        </div>
                        <div className="text-sm text-gray-400">people displaced</div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Model Confidence</div>
                        {confidence && (
                            <ConfidenceIndicator level={confidence.level} score={confidence.score} />
                        )}
                    </div>
                </div>
            </div>

            {/* Main Attribution Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Attribution Breakdown - Main */}
                <div className="lg:col-span-2 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <h2 className="text-xl font-semibold text-white mb-6">Causal Factor Breakdown</h2>
                    {attribution?.factors && (
                        <AttributionBreakdown data={attribution.factors} />
                    )}
                </div>

                {/* Summary Cards */}
                <div className="space-y-6">
                    {/* Methodology */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Methodology</h3>
                        <p className="text-white font-medium">{attribution?.methodology || "Structural Causal Model"}</p>
                    </div>

                    {/* Data Sources */}
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <h4 className="text-blue-400 font-semibold mb-3">Live Data Sources</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className={data?.climate?.error ? "text-red-400" : "text-emerald-400"}>●</span>
                                Open-Meteo Climate
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className={data?.displacement?.error ? "text-red-400" : "text-emerald-400"}>●</span>
                                UNHCR Displacement
                            </li>
                            <li className="flex items-center gap-2 text-gray-300">
                                <span className={data?.economic?.error ? "text-red-400" : "text-emerald-400"}>●</span>
                                World Bank Economic
                            </li>
                        </ul>
                    </div>

                    {/* Economic Stress */}
                    {data?.economic?.stress && (
                        <div className={`p-6 rounded-2xl border ${data.economic.stress.level === "High"
                            ? "bg-red-500/5 border-red-500/10"
                            : "bg-amber-500/5 border-amber-500/10"
                            }`}>
                            <h4 className={`font-semibold mb-2 ${data.economic.stress.level === "High" ? "text-red-400" : "text-amber-400"
                                }`}>
                                Economic Stress: {data.economic.stress.level}
                            </h4>
                            <p className="text-sm text-gray-300">
                                Inflation: {data.economic.stress.inflation?.toFixed(1)}%<br />
                                GDP Change: {data.economic.stress.gdpChange}%
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Assumptions Panel */}
            <AssumptionsPanel
                pathways={attribution?.pathways}
                assumptions={attribution?.assumptions}
            />
        </div>
    );
}
