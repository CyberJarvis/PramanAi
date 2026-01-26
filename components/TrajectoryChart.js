"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from "@/components/ui/GlassCard";

/**
 * 12-Week Displacement Trajectory Chart
 * Shows baseline vs intervention line comparison like praman.py
 */
export default function TrajectoryChart({
    baseDisplacement = 500,
    interventionStrength = 0.5,
    onStrengthChange,
    onRunSimulation
}) {
    const [isSimulating, setIsSimulating] = useState(false);

    // Generate trajectory data based on intervention strength
    const { chartData, stats } = useMemo(() => {
        const weeks = 12;
        const data = [];
        let baselineTotal = 0;
        let interventionTotal = 0;

        for (let week = 0; week <= weeks; week++) {
            // Baseline: logistic growth (displacement increases)
            const baselineValue = Math.round(baseDisplacement * (1 + 0.5 * (1 - Math.exp(-0.3 * week))));

            // With intervention: decay based on strength
            const decay = interventionStrength * 0.08;
            const interventionValue = Math.round(baseDisplacement * Math.exp(-decay * week) * (1 - interventionStrength * 0.3));
            const safeInterventionValue = Math.max(100, interventionValue);

            data.push({
                name: week,
                Baseline: baselineValue,
                Intervention: safeInterventionValue
            });

            if (week === weeks) {
                baselineTotal = baselineValue;
                interventionTotal = safeInterventionValue;
            }
        }

        const livesProtected = baselineTotal - interventionTotal;
        const reductionPercent = ((livesProtected / baselineTotal) * 100).toFixed(1);

        return {
            chartData: data,
            stats: { baselineTotal, interventionTotal, livesProtected, reductionPercent }
        };
    }, [baseDisplacement, interventionStrength]);

    const handleRun = async () => {
        setIsSimulating(true);
        if (onRunSimulation) {
            await onRunSimulation();
        }
        setTimeout(() => setIsSimulating(false), 1000);
    };

    const strengthLabels = ['None', 'Low', 'Medium', 'High'];
    const strengthLabel = strengthLabels[Math.round(interventionStrength * 3)] || 'Medium';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-red-500">🎯</span> Counterfactual Forecast
                    </h2>
                    <p className="text-gray-400 mt-1">
                        Simulate how <strong className="text-white">policy interventions</strong> change displacement trajectories
                    </p>
                </div>
            </div>

            {/* Model Info */}
            <div className="text-sm text-gray-500 space-y-1 pl-1">
                <p>Model accounts for:</p>
                <ul className="list-disc list-inside pl-2 marker:text-blue-500">
                    <li>Current climate conditions</li>
                    <li>Baseline displacement rates</li>
                    <li>Intervention effectiveness (early warning, aid, shelter)</li>
                </ul>
            </div>

            {/* Intervention Slider */}
            <GlassCard className="p-6 border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium flex items-center gap-2">
                        Intervention Strength
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">Adjustable</span>
                    </span>
                    <span className="text-blue-400 font-bold text-lg">{strengthLabel}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={interventionStrength * 100}
                    onChange={(e) => onStrengthChange?.(parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    style={{
                        background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-3 font-medium uppercase tracking-wider">
                    <span>None</span>
                    <span>Max Intervention</span>
                </div>
            </GlassCard>

            {/* Run Button */}
            <button
                onClick={handleRun}
                disabled={isSimulating}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
                {isSimulating ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Running Simulation...
                    </>
                ) : (
                    <>▶ Run Simulation</>
                )}
            </button>

            {/* Chart */}
            <GlassCard className="p-6 h-[450px] border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">12-Week Displacement Trajectory</h3>
                    <div className="flex gap-4 text-xs font-medium">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></span>
                            <span className="text-gray-400">Baseline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500"></span>
                            <span className="text-gray-400">With Intervention</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorIntervention" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#4b5563"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#4b5563"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                }}
                                itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="Baseline"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorBaseline)"
                                name="Baseline"
                            />
                            <Area
                                type="monotone"
                                dataKey="Intervention"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIntervention)"
                                name={`With ${strengthLabel}`}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </GlassCard>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard className="p-5 flex flex-col justify-between" hoverEffect={false}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Baseline Scenario</div>
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {stats.baselineTotal.toLocaleString()}
                        </div>
                        <div className="text-xs text-red-400 mt-1 font-medium">Projected Displacement</div>
                    </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between" hoverEffect={false}>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">With Intervention</div>
                    <div>
                        <div className="text-3xl font-bold text-white tracking-tight">
                            {stats.interventionTotal.toLocaleString()}
                        </div>
                        <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
                            <span className="bg-emerald-500/20 rounded px-1.5 py-0.5">-{stats.reductionPercent}%</span>
                            Reduction
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-5 flex flex-col justify-between border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-bl-full filter blur-xl"></div>
                    <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2 relative z-10">Lives Protected</div>
                    <div className="relative z-10">
                        <div className="text-3xl font-bold text-white tracking-tight text-glow">
                            {stats.livesProtected.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-200 mt-1 font-medium">Direct Causal Impact</div>
                    </div>
                </GlassCard>
            </div>

            {/* Policy Impact Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 text-lg">🛡️</span>
                </div>
                <div className="text-sm text-gray-300 leading-relaxed">
                    <strong className="text-white block sm:inline">Policy Impact Analysis:</strong> The proposed <strong className="text-emerald-400">{strengthLabel} intervention strategy</strong> is projected to prevent <strong className="text-white">{stats.livesProtected.toLocaleString()} displacements</strong> ({stats.reductionPercent}% reduction) over the next 12 weeks.
                </div>
            </div>
        </div>
    );
}
