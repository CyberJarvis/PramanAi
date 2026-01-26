import { useState, useEffect, useCallback } from "react";
import { formatDisplacement } from "@/lib/formatters";
import GlassCard from "@/components/ui/GlassCard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const statusColors = {
    CRITICAL: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", color: "#f87171" },
    SEVERE: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", color: "#fb923c" },
    ELEVATED: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", color: "#fbbf24" },
    MODERATE: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", color: "#60a5fa" },
    LOW: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", color: "#34d399" },
};

function Gauge({ value, color }) {
    const radius = 55;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
                <circle className="text-white/5" strokeWidth="12" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" />
                <circle style={{ color: color, strokeDasharray: circumference, strokeDashoffset: offset }} strokeWidth="12" strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pt-1">
                <span className="text-4xl font-bold text-white tracking-tighter shimmer-text">{value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1">Score</span>
            </div>
        </div>
    );
}

function MiniPie({ value, color }) {
    const data = [
        { value: value, color: color },
        { value: 100 - value, color: "#ffffff10" },
    ];
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={45}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default function RiskMetricsCard({ country, onClose, className }) {
    const [riskData, setRiskData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRiskData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country, rainMm: 10.0, windMs: 5.0 })
            });
            const result = await response.json();
            if (result.success) {
                setRiskData(result.data);
            } else {
                setError(result.error || "Python backend not running");
            }
        } catch (err) {
            setError("Cannot connect to Python backend");
        } finally {
            setLoading(false);
        }
    }, [country]);

    useEffect(() => {
        if (!country) return;
        fetchRiskData();
    }, [country, fetchRiskData]);

    const colors = statusColors[riskData?.status] || statusColors.LOW;

    return (
        <GlassCard className={`p-8 ${colors.bg.replace('/10', '/5')} ${colors.border} ${className || ''} flex flex-col`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-xl shadow-black/20 backdrop-blur-md border border-white/5">
                        📍
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{country}</h3>
                        <div className={`mt-1 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 ${colors.bg} ${colors.text} border ${colors.border.replace('/30', '/10')}`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
                            {riskData?.status || "LOADING..."}
                        </div>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                        ✕
                    </button>
                )}
            </div>

            {loading && (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
                    <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-blue-500/50 animate-spin mb-4" />
                    <p className="text-blue-400 font-medium tracking-wide">ANALYZING GEOSPATIAL DATA...</p>
                </div>
            )}

            {error && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl border border-red-500/20">
                    <p className="text-red-400 mb-4 font-medium">{error}</p>
                    <button onClick={fetchRiskData} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-semibold uppercase tracking-wider">
                        Retry Analysis
                    </button>
                </div>
            )}

            {riskData && !loading && (
                <div className="flex-1 flex flex-col gap-6">
                    {/* Top Section: Hero Metrics (Gauge & Big Number) */}
                    <div className="p-6 rounded-3xl bg-black/20 border border-white/5 relative overflow-hidden group flex items-center justify-around gap-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] via-transparent to-transparent pointer-events-none" />

                        {/* Gauge */}
                        <div className="scale-110">
                            <Gauge value={riskData.risk_index} color={colors.color} />
                        </div>

                        {/* Displacement Metric */}
                        <div className="text-center">
                            <div className="text-5xl font-bold text-white tracking-tight text-glow mb-1">
                                {formatDisplacement(riskData.pred)}
                            </div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Individuals at risk</div>
                        </div>
                    </div>

                    {/* Middle Section: Primary Driver (Full Width) */}
                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.05] relative w-full hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Primary Driver</div>
                                <div className="text-xl font-bold text-white mb-2">{riskData.driver}</div>
                                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                    {riskData.explanation?.replace(/\*\*/g, '')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: 2x2 Factors Grid with Pie Charts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {Object.entries(riskData.drivers_breakdown || {}).map(([factor, score], i) => (
                            <div key={factor} className={`p-6 rounded-2xl bg-black/20 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-white/10 transition-colors py-6 ${i >= 2 ? 'mt-0' : ''}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                                <div className="w-28 h-28 mb-4 relative">
                                    <MiniPie
                                        value={score}
                                        color={score > 70 ? colors.color : score > 40 ? "#60a5fa" : "#94a3b8"}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white tracking-tight">{score.toFixed(0)}</span>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-400 font-bold text-center uppercase tracking-wider truncate w-full px-2" title={factor}>
                                    {factor}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
