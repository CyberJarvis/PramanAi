"use client";

import Link from "next/link";
import { useData } from "@/lib/DataContext";
import RegionSelector from "@/components/RegionSelector";
import RiskMetricsCard from "@/components/RiskMetricsCard";
import InteractiveRiskMap from "@/components/InteractiveRiskMap";
import GlassCard from "@/components/ui/GlassCard";

export default function DashboardPage() {
    const { region, data, loading, error, changeRegion } = useData();



    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header with Region Selector */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        PRAMAN-AI Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Real-time causal decision support system
                    </p>
                </div>
                <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
            </div>

            {/* Loading State */}
            {loading && (
                <GlassCard className="p-12 text-center">
                    <div className="inline-flex items-center gap-3">
                        <svg className="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-white">Fetching real-time data from multiple sources...</span>
                    </div>
                </GlassCard>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                    <p className="text-red-400">Error: {error}</p>
                </div>
            )}

            {/* Data Display */}
            {data && !loading && (
                <>
                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-4 gap-6">
                        <GlassCard className="p-6">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Region</div>
                            <div className="text-lg font-bold text-white text-glow">{data.region?.country}</div>
                            <div className="text-sm text-gray-400">
                                {data.region?.coordinates?.lat?.toFixed(2)}°, {data.region?.coordinates?.lon?.toFixed(2)}°
                            </div>
                        </GlassCard>
                        <GlassCard className="p-6">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Displaced</div>
                            <div className="text-3xl font-bold text-white">
                                {data.displacement?.totalDisplaced
                                    ? `${(data.displacement.totalDisplaced / 1000000).toFixed(2)}M`
                                    : "N/A"
                                }
                            </div>
                            {data.displacement?.percentChange && (
                                <div className={`text-sm ${data.displacement.percentChange > 0 ? "text-red-400" : "text-emerald-400"}`}>
                                    {data.displacement.percentChange > 0 ? "+" : ""}{data.displacement.percentChange}% YoY
                                </div>
                            )}
                        </GlassCard>
                        <GlassCard className="p-6">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Model Confidence</div>
                            <div className="text-3xl font-bold text-emerald-400 text-glow">{data.confidence?.score}%</div>
                            <div className="text-sm text-gray-400">{data.confidence?.level}</div>
                        </GlassCard>
                        <GlassCard className="p-6">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Economic Stress</div>
                            <div className={`text-2xl font-bold ${data.economic?.stress?.level === "High" ? "text-red-400" :
                                data.economic?.stress?.level === "Medium" ? "text-amber-400" : "text-emerald-400"
                                }`}>
                                {data.economic?.stress?.level || "N/A"}
                            </div>
                            <div className="text-sm text-gray-400">
                                {data.economic?.stress?.inflation ? `${data.economic.stress.inflation.toFixed(1)}% inflation` : ""}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Data Sources Status */}
                    <GlassCard className="p-4 flex items-center justify-between">
                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <span className="text-gray-500 font-medium">Data Sources:</span>
                            {Object.entries(data.confidence?.dataSources || {}).map(([source, status]) => (
                                <span key={source} className={`flex items-center gap-1.5 ${status.includes("✓") ? "text-emerald-400" : "text-red-400"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${status.includes("✓") ? "bg-emerald-500" : "bg-red-500"}`}></span>
                                    {source}: {status}
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-gray-600 font-mono">
                            Updated: {new Date(data.fetchedAt).toLocaleTimeString()}
                        </span>
                    </GlassCard>

                    {/* Attribution Summary + Interactive Risk Map - Side by Side */}
                    <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                        {/* AI Risk Analysis Card (Main Feature) */}
                        <RiskMetricsCard
                            country={data?.region?.country || "Ethiopia"}
                            className="h-full"
                        />

                        {/* Interactive Risk Map */}
                        <GlassCard className="p-0 h-full flex flex-col min-h-[500px] overflow-hidden group">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-white"> Interactive Geospatial Risk</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Live</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 relative bg-[#050505]">
                                <InteractiveRiskMap
                                    selectedCountry={region}
                                    onCountryClick={(country) => changeRegion(country.name)}
                                    countryData={data}
                                />
                                {/* Gradient Overlay for blending */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0b0c15]/20" />
                            </div>
                        </GlassCard>
                    </div>



                    {/* Quick Actions */}
                    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { href: "/dashboard/timeline", icon: "timeline", color: "blue", label: "Impact Timeline", sub: "Analyze lag patterns" },
                            { href: "/dashboard/scenarios", icon: "scenarios", color: "purple", label: "Scenarios", sub: "Counterfactuals" },
                            { href: "/dashboard/causal-graph", icon: "graph", color: "emerald", label: "Causal Graph", sub: "Explore DAG" },
                            { href: "/dashboard/council", icon: "council", color: "amber", label: "Situation Room", sub: "Council" },
                            { href: "/dashboard/intelligence", icon: "brain", color: "cyan", label: "Deep Intel", sub: "RAG Analysis" },
                            { href: "/dashboard/risk", icon: "target", color: "red", label: "Quick Risk", sub: "Instant Check" },
                        ].map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className={`group p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-${item.color}-500/30 transition-all flex flex-col items-center text-center`}
                            >
                                <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.2)] group-hover:shadow-${item.color}-500/20`}>
                                    {/* Simple Icon Mapping */}
                                    {item.color === 'blue' && <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                    {item.color === 'purple' && <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                                    {item.color === 'emerald' && <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                                    {item.color === 'amber' && <span className="text-xl">⚔️</span>}
                                    {item.color === 'cyan' && <span className="text-xl">🧠</span>}
                                    {item.color === 'red' && <span className="text-xl">🎯</span>}
                                </div>
                                <h3 className="text-white text-sm font-semibold mb-1">{item.label}</h3>
                                <p className="text-[10px] text-gray-500">{item.sub}</p>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
