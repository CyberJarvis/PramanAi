"use client";

export default function ImpactTimeline({ data }) {
    const maxShock = Math.max(...data.map(d => d.shockIntensity));
    const maxDisplacement = Math.max(...data.map(d => d.displacement));

    return (
        <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-gray-500">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
            </div>

            {/* Chart area */}
            <div className="ml-20 mr-4">
                {/* Legend */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-gray-400">Shock Intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs text-gray-400">Displacement</span>
                    </div>
                </div>

                {/* Bars */}
                <div className="flex items-end gap-1 h-64">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-1">
                            {/* Dual bars */}
                            <div className="w-full flex gap-0.5 items-end h-full">
                                {/* Shock bar */}
                                <div
                                    className="flex-1 bg-red-500/80 rounded-t transition-all duration-500"
                                    style={{ height: `${(item.shockIntensity / maxShock) * 100}%` }}
                                />
                                {/* Displacement bar */}
                                <div
                                    className="flex-1 bg-blue-500/80 rounded-t transition-all duration-500"
                                    style={{ height: `${(item.displacement / maxDisplacement) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-3 text-xs text-gray-500">
                    {data.filter((_, i) => i % 2 === 0).map((item, index) => (
                        <span key={index} className="text-center">{item.month.split(" ")[0]}</span>
                    ))}
                </div>
            </div>

            {/* Lag annotation */}
            <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-blue-400 font-medium">Key Observation:</span>
                    <span className="text-gray-400">Displacement peaks ~4-6 months after shock peak</span>
                </div>
            </div>
        </div>
    );
}
