"use client";

import { useState, useEffect, useCallback } from "react";

// Dynamic Causal DAG Visualization
// Shows the displacement pathway with country-specific causal weights

export default function CausalDAG({ country }) {
    const [weights, setWeights] = useState({
        climate: 0.35,
        conflict: 0.45,
        economic: 0.20
    });
    const [loading, setLoading] = useState(false);

    // Calculate primary driver from weights (highest percentage)
    const getPrimaryDriver = () => {
        const drivers = [
            { name: "Climate Crisis", value: weights.climate },
            { name: "Armed Conflict", value: weights.conflict },
            { name: "Economic Shock", value: weights.economic }
        ];
        return drivers.reduce((max, driver) => driver.value > max.value ? driver : max, drivers[0]).name;
    };

    const primaryDriver = getPrimaryDriver();

    // Fetch dynamic weights from Risk API
    const fetchWeights = useCallback(async () => {
        if (!country) return;

        setLoading(true);
        try {
            const response = await fetch('/api/risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country, rainMm: 10.0, windMs: 5.0 })
            });
            const result = await response.json();

            if (result.success && result.data?.drivers_breakdown) {
                const db = result.data.drivers_breakdown;

                // Normalize to percentages (sum to 1.0)
                const total = (db["Climate Vulnerability"] || 0) +
                    (db["Conflict/Violence"] || 0) +
                    (db["Governance Failure"] || 0) +
                    (db["Weather Shock"] || 0);

                if (total > 0) {
                    setWeights({
                        climate: (db["Climate Vulnerability"] || 0) / total,
                        conflict: (db["Conflict/Violence"] || 0) / total,
                        economic: ((db["Governance Failure"] || 0) + (db["Weather Shock"] || 0)) / total
                    });
                }
            }
        } catch (err) {
            console.error("Failed to fetch causal weights", err);
        } finally {
            setLoading(false);
        }
    }, [country]);

    useEffect(() => {
        fetchWeights();
    }, [fetchWeights]);

    // Highlight the node with highest weight
    const getNodeStyle = (nodeId) => {
        const isActive =
            (nodeId === "climate" && primaryDriver === "Climate Crisis") ||
            (nodeId === "conflict" && primaryDriver === "Armed Conflict") ||
            (nodeId === "economic" && primaryDriver === "Economic Shock");

        return {
            fillOpacity: isActive ? 0.5 : 0.2,
            strokeWidth: isActive ? 3 : 2,
        };
    };

    // Fixed node positions
    const NODE_WIDTH = 120;
    const NODE_HEIGHT = 36;

    const nodes = {
        climate: { x: 60, y: 50, label: "Climate Crisis", color: "#3b82f6" },
        conflict: { x: 60, y: 130, label: "Armed Conflict", color: "#ef4444" },
        economic: { x: 60, y: 210, label: "Economic Shock", color: "#f59e0b" },
        stress: { x: 300, y: 130, label: "Compounding Stress", color: "#8b5cf6" },
        displacement: { x: 540, y: 130, label: "Forced Displacement", color: "#10b981" },
    };

    // Calculate line endpoints
    const getLineCoords = (fromId, toId) => {
        const from = nodes[fromId];
        const to = nodes[toId];
        return {
            x1: from.x + NODE_WIDTH,           // Right edge of from node
            y1: from.y + NODE_HEIGHT / 2,      // Center of from node
            x2: to.x,                           // Left edge of to node
            y2: to.y + NODE_HEIGHT / 2,        // Center of to node
        };
    };

    return (
        <div className="relative w-full bg-white/[0.02] rounded-2xl border border-white/[0.05] overflow-hidden" style={{ height: '320px' }}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-blue-400 text-sm animate-pulse">Loading causal weights...</div>
                </div>
            )}

            <svg className="w-full h-full" viewBox="0 0 720 280" preserveAspectRatio="xMidYMid meet">
                {/* Defs */}
                <defs>
                    <linearGradient id="grad-climate" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="grad-conflict" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="grad-economic" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="grad-stress" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                    </marker>
                    <marker id="arrow-green" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                </defs>

                {/* EDGE 1: Climate → Stress */}
                <line
                    {...getLineCoords("climate", "stress")}
                    stroke="url(#grad-climate)"
                    strokeWidth={2 + weights.climate * 4}
                    strokeOpacity={0.5 + weights.climate * 0.5}
                    markerEnd="url(#arrow)"
                />
                <text x={220} y={75} fill="#9ca3af" fontSize="11" fontWeight="500" textAnchor="middle">
                    {(weights.climate * 100).toFixed(0)}%
                </text>

                {/* EDGE 2: Conflict → Stress - HORIZONTAL LINE (needs explicit coords) */}
                <line
                    x1={180}
                    y1={148}
                    x2={300}
                    y2={148}
                    stroke="#ef4444"
                    strokeWidth={Math.max(3, 2 + weights.conflict * 4)}
                    strokeOpacity={0.8}
                    markerEnd="url(#arrow)"
                />
                <text x={240} y={140} fill="#9ca3af" fontSize="11" fontWeight="500" textAnchor="middle">
                    {(weights.conflict * 100).toFixed(0)}%
                </text>

                {/* EDGE 3: Economic → Stress */}
                <line
                    {...getLineCoords("economic", "stress")}
                    stroke="url(#grad-economic)"
                    strokeWidth={2 + weights.economic * 4}
                    strokeOpacity={0.5 + weights.economic * 0.5}
                    markerEnd="url(#arrow)"
                />
                <text x={220} y={200} fill="#9ca3af" fontSize="11" fontWeight="500" textAnchor="middle">
                    {(weights.economic * 100).toFixed(0)}%
                </text>

                {/* EDGE 4: Stress → Displacement - HORIZONTAL LINE */}
                <line
                    x1={420}
                    y1={148}
                    x2={540}
                    y2={148}
                    stroke="#10b981"
                    strokeWidth={5}
                    strokeOpacity={0.9}
                    markerEnd="url(#arrow-green)"
                />
                <text x={480} y={140} fill="#9ca3af" fontSize="11" fontWeight="500" textAnchor="middle">
                    100%
                </text>

                {/* NODES */}
                {Object.entries(nodes).map(([id, node]) => {
                    const style = getNodeStyle(id);
                    const isHighlighted = style.fillOpacity > 0.3;

                    return (
                        <g key={id}>
                            {/* Glow for highlighted */}
                            {isHighlighted && (
                                <rect
                                    x={node.x - 4}
                                    y={node.y - 4}
                                    width={NODE_WIDTH + 8}
                                    height={NODE_HEIGHT + 8}
                                    rx="10"
                                    fill={node.color}
                                    fillOpacity="0.2"
                                />
                            )}
                            <rect
                                x={node.x}
                                y={node.y}
                                width={NODE_WIDTH}
                                height={NODE_HEIGHT}
                                rx="8"
                                fill={node.color}
                                fillOpacity={style.fillOpacity}
                                stroke={node.color}
                                strokeWidth={style.strokeWidth}
                            />
                            <text
                                x={node.x + NODE_WIDTH / 2}
                                y={node.y + NODE_HEIGHT / 2 + 4}
                                fill="white"
                                fontSize="10"
                                fontWeight="600"
                                textAnchor="middle"
                            >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </svg>

            {/* Primary Driver Badge */}
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
                Primary: {primaryDriver} ({(Math.max(weights.climate, weights.conflict, weights.economic) * 100).toFixed(0)}%)
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-gray-500">
                <span>📊 Edge weights = causal contribution</span>
            </div>

            {/* Country Badge */}
            {country && (
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                    {country}
                </div>
            )}
        </div>
    );
}
