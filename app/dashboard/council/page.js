"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function CouncilPage() {
    const [scenarioA, setScenarioA] = useState({
        name: "Status Quo",
        desc: "Maintain current reactive aid approach. Deploy emergency response after displacement occurs."
    });
    const [scenarioB, setScenarioB] = useState({
        name: "Proactive Prevention",
        desc: "Invest in early warning systems, climate adaptation, and resilience funding to prevent displacement."
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const runDebate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/council', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenarioAName: scenarioA.name,
                    scenarioADesc: scenarioA.desc,
                    scenarioBName: scenarioB.name,
                    scenarioBDesc: scenarioB.desc
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.error || "Failed to run council debate");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                    ⚔️ Situation Room
                </h1>
                <p className="text-gray-400">
                    Multi-stakeholder strategic council for policy analysis
                </p>
            </div>

            {/* Scenario Input */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <h3 className="text-lg font-semibold text-white mb-4">📋 Scenario A</h3>
                    <input
                        type="text"
                        value={scenarioA.name}
                        onChange={(e) => setScenarioA({ ...scenarioA, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white mb-4 focus:outline-none focus:border-blue-500"
                        placeholder="Scenario Name"
                    />
                    <textarea
                        value={scenarioA.desc}
                        onChange={(e) => setScenarioA({ ...scenarioA, desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white h-32 focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Describe this policy approach..."
                    />
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <h3 className="text-lg font-semibold text-white mb-4">📋 Scenario B</h3>
                    <input
                        type="text"
                        value={scenarioB.name}
                        onChange={(e) => setScenarioB({ ...scenarioB, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white mb-4 focus:outline-none focus:border-blue-500"
                        placeholder="Scenario Name"
                    />
                    <textarea
                        value={scenarioB.desc}
                        onChange={(e) => setScenarioB({ ...scenarioB, desc: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white h-32 focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Describe this policy approach..."
                    />
                </div>
            </div>

            {/* Run Button */}
            <button
                onClick={runDebate}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Council is deliberating...
                    </span>
                ) : (
                    "🗣️ Convene Strategic Council"
                )}
            </button>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Results */}
            {result && (
                <>
                    {/* Deliberations */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white">🗣️ Council Deliberations</h2>

                        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">💰</span>
                                <h3 className="text-lg font-semibold text-amber-400">Economist Perspective</h3>
                            </div>
                            <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{result.economist}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">❤️</span>
                                <h3 className="text-lg font-semibold text-emerald-400">Human Rights Perspective</h3>
                            </div>
                            <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{result.humanist}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">🛡️</span>
                                <h3 className="text-lg font-semibold text-blue-400">Security Perspective</h3>
                            </div>
                            <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{result.security}</ReactMarkdown>
                            </div>
                        </div>
                    </div>

                    {/* Verdict */}
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                <span className="text-3xl">🏆</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Final Verdict</h2>
                                <p className="text-emerald-400 font-semibold">
                                    Recommended: {result.winner}
                                </p>
                            </div>
                        </div>
                        <div className="text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{result.verdict}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Radar Chart Comparison */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <h3 className="text-lg font-semibold text-white mb-6">📊 Multi-Criteria Comparison</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(result.scores || {}).map(([scenario, scores]) => (
                                <div key={scenario} className="space-y-3">
                                    <h4 className="text-white font-medium">{scenario}</h4>
                                    {Object.entries(scores).map(([metric, value]) => (
                                        <div key={metric} className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400 w-24">{metric}</span>
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                                    style={{ width: `${value * 10}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-white w-8">{value}/10</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
