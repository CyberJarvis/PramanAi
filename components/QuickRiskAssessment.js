"use client";

import { useState } from "react";
import RegionSelector from "@/components/RegionSelector";

export default function QuickRiskAssessment({ onAssess }) {
    const [country, setCountry] = useState("Ethiopia");
    const [rainfall, setRainfall] = useState(25);
    const [windSpeed, setWindSpeed] = useState(12);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAssess = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country,
                    rainMm: rainfall,
                    windMs: windSpeed
                })
            });
            const data = await response.json();
            if (data.success) {
                setResult(data.data);
                onAssess?.(data.data);
            }
        } catch (error) {
            console.error("Risk assessment error:", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        CRITICAL: "text-red-500 bg-red-500/20",
        SEVERE: "text-orange-500 bg-orange-500/20",
        ELEVATED: "text-amber-500 bg-amber-500/20",
        MODERATE: "text-blue-400 bg-blue-500/20",
        LOW: "text-emerald-400 bg-emerald-500/20"
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-red-500">Quick Risk Assessment</h2>
            </div>

            {/* Country Selector */}
            <div className="w-full">
                <RegionSelector
                    currentRegion={country}
                    onRegionChange={(c) => setCountry(c.name)}
                />
            </div>

            {/* Sliders Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Rainfall Slider */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                            <span>🌧️</span> Daily Rainfall (mm)
                        </label>
                        <span className="text-cyan-400 font-mono">{rainfall.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={rainfall}
                        onChange={(e) => setRainfall(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #06b6d4 ${rainfall}%, #1e293b ${rainfall}%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.00</span>
                        <span>100.00</span>
                    </div>
                </div>

                {/* Wind Speed Slider */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                            <span>💨</span> Wind Speed (m/s)
                        </label>
                        <span className="text-cyan-400 font-mono">{windSpeed.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.1"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #06b6d4 ${(windSpeed / 30) * 100}%, #1e293b ${(windSpeed / 30) * 100}%)`
                        }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.00</span>
                        <span>30.00</span>
                    </div>
                </div>
            </div>

            {/* Assess Button */}
            <button
                onClick={handleAssess}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Assessing...
                    </>
                ) : (
                    <>⚙️ Assess Risk</>
                )}
            </button>

            {/* Result Display */}
            {result && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">{country} Risk Assessment</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[result.status] || statusColors.LOW}`}>
                            {result.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Risk Index</div>
                            <div className="text-3xl font-bold text-white">{result.risk_index}/100</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 uppercase">Predicted Displacement</div>
                            <div className="text-3xl font-bold text-amber-400">
                                {(result.pred / 1000).toFixed(0)}K
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-2">Primary Driver</div>
                        <p className="text-white">{result.driver}</p>
                    </div>

                    <div>
                        <div className="text-xs text-gray-500 uppercase mb-2">Analysis</div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            {result.explanation?.replace(/\*\*/g, '').slice(0, 300)}...
                        </p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-white/[0.05]">
                <p><strong className="text-gray-400">PRAMAN.AI</strong> - Policy Ready Analytics for Migration</p>
                <p>Powered by NASA POWER API • INFORM Risk Index • UNHCR Data</p>
                <p>For humanitarian and policy use only. Data updates every 24 hours.</p>
            </div>
        </div>
    );
}
