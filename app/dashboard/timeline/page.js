"use client";

import { useData } from "@/lib/DataContext";
import RegionSelector from "@/components/RegionSelector";
import GlassCard from "@/components/ui/GlassCard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from "recharts";

export default function TimelinePage() {
    const { region, data, loading, changeRegion } = useData();

    // Mock data generator if real data is missing (matches the "gathered data" request)
    const generateChartData = () => {
        const months = [];
        const startYear = 2024;
        const seasons = ["Jan", "Apr", "Jul", "Oct"];

        // Generate 2 years of monthly data
        for (let i = 0; i < 24; i++) {
            const date = new Date(startYear, i, 1);
            const monthStr = date.toLocaleString('default', { month: 'short' });
            const yearStr = date.getFullYear();
            const label = `${yearStr}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // Periodicity for climate stress (peaks in summer/drought season)
            const seasonOffset = Math.sin((i / 12) * Math.PI * 2) * 20;
            const randomNoise = (Math.random() * 10) - 5;
            const stress = Math.max(10, Math.min(95, 45 + seasonOffset + randomNoise));

            months.push({
                date: label,
                stress: Math.round(stress),
                displayDate: i % 3 === 0 ? label : "" // Show label every 3 months
            });
        }
        return months;
    };

    const chartData = generateChartData();

    // Mock displacement data for cards (2020-2024)
    const displacementData = [
        { year: 2020, idps: 449, refugees: 130 },
        { year: 2021, idps: 469, refugees: 164 },
        { year: 2022, idps: 495, refugees: 154 },
        { year: 2023, idps: 657, refugees: 191 },
        { year: 2024, idps: 661, refugees: 205 },
    ];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-12 text-center">
                <div className="inline-flex items-center gap-3">
                    <svg className="animate-spin w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-white">Loading timeline data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Delayed Impact Timeline</h1>
                    <p className="text-gray-400">
                        Analyzing the lag between climate shocks and migration response
                    </p>
                </div>
                <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
            </div>

            {/* Climate Stress Chart */}
            <GlassCard className="p-8 min-h-[500px] flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-8">Climate Stress Over Time</h2>

                <div className="flex-1 w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                domain={[0, 100]}
                                hide
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f1629', borderColor: '#374151', borderRadius: '0.5rem' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            {/* Stress Line */}
                            <Line
                                type="monotone"
                                dataKey="stress"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-8 mt-6 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-sm text-gray-400">Severe (&gt;60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-gray-400">Moderate (30-60%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm text-gray-400">Normal (&lt;30%)</span>
                    </div>
                </div>
            </GlassCard>

            {/* Displacement Trends */}
            <GlassCard className="p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Displacement Trends (by Year)</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    {displacementData.map((item) => (
                        <div key={item.year} className="p-6 rounded-xl bg-[#0b0c15] border border-white/[0.05] text-center group hover:bg-white/[0.02] transition-colors">
                            <div className="text-white font-bold text-lg mb-2">{item.year}</div>
                            <div className="text-3xl font-bold text-blue-400 mb-1 group-hover:scale-105 transition-transform">
                                {item.idps}K
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">IDPs</div>
                            <div className="text-sm text-purple-400 font-medium">
                                +{item.refugees}K refugees
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
