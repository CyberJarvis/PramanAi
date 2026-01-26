"use client";

export default function ScenarioComparison({ scenarios, activeScenario }) {
    const active = scenarios.find(s => s.id === activeScenario) || scenarios[0];
    const baseline = scenarios.find(s => s.id === "baseline");

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {scenarios.map((scenario) => {
                const isActive = scenario.id === activeScenario;
                const isBaseline = scenario.id === "baseline";

                return (
                    <div
                        key={scenario.id}
                        className={`p-6 rounded-2xl border transition-all ${isActive
                                ? "bg-white/[0.05] border-blue-500/30 ring-2 ring-blue-500/20"
                                : "bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1]"
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: scenario.color }}
                            />
                            <h3 className="text-lg font-semibold text-white">{scenario.name}</h3>
                        </div>

                        <p className="text-sm text-gray-400 mb-6">{scenario.description}</p>

                        {/* Stats */}
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Total Displacement</div>
                                <div className="text-2xl font-bold text-white">
                                    {(scenario.totalDisplacement / 1000000).toFixed(1)}M
                                </div>
                                {scenario.comparedToBaseline && (
                                    <div className={`text-sm font-medium ${scenario.comparedToBaseline.displacementReduction
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                        }`}>
                                        {scenario.comparedToBaseline.displacementReduction || scenario.comparedToBaseline.displacementIncrease}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="text-xs text-gray-500 mb-1">Economic Loss</div>
                                <div className="text-xl font-bold text-white">
                                    ${scenario.economicLoss}B
                                </div>
                                {scenario.comparedToBaseline && (
                                    <div className={`text-sm font-medium ${scenario.comparedToBaseline.economicLossSavings
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                        }`}>
                                        {scenario.comparedToBaseline.economicLossSavings || scenario.comparedToBaseline.economicLossIncrease}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mini chart */}
                        <div className="mt-6 h-16 flex items-end gap-1">
                            {scenario.timeline.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex-1 rounded-t transition-all"
                                    style={{
                                        height: `${(point.value / 520000) * 100}%`,
                                        backgroundColor: scenario.color,
                                        opacity: 0.7,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
