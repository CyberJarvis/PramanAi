"use client";

export default function AttributionBreakdown({ data }) {
    const maxContribution = Math.max(...data.map(d => d.contribution));

    return (
        <div className="space-y-6">
            {data.map((factor, index) => (
                <div key={index} className="group">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: factor.color }}
                            />
                            <span className="text-white font-medium">{factor.factor}</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{factor.contribution}%</span>
                    </div>

                    {/* Main bar */}
                    <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                                width: `${(factor.contribution / maxContribution) * 100}%`,
                                backgroundColor: factor.color,
                            }}
                        />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mb-4">{factor.description}</p>

                    {/* Sub-factors */}
                    {factor.subFactors && (
                        <div className="pl-7 space-y-2">
                            {factor.subFactors.map((sub, subIndex) => (
                                <div key={subIndex} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-500">{sub.name}</span>
                                            <span className="text-xs text-gray-400">{sub.value}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full opacity-60"
                                                style={{
                                                    width: `${(sub.value / factor.contribution) * 100}%`,
                                                    backgroundColor: factor.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
