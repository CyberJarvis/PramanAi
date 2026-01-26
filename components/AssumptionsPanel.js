"use client";

import { useState } from "react";

export default function AssumptionsPanel({ pathways, assumptions }) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            {/* Active Causal Pathways */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <h3 className="text-lg font-semibold text-white mb-4">Active Causal Pathways</h3>
                <ul className="space-y-4">
                    {pathways?.map((path, index) => (
                        <li key={index} className="flex gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {path.split(':').map((part, i) => (
                                    i === 0 ? <strong key={i} className="text-white block mb-1">{part}</strong> : part
                                ))}
                            </p>
                        </li>
                    ))}
                    {(!pathways || pathways.length === 0) && (
                        <p className="text-gray-500 text-sm">No dominant pathways detected.</p>
                    )}
                </ul>
            </div>

            {/* Model Assumptions */}
            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">Model Assumptions</h3>
                <ul className="space-y-3">
                    {assumptions?.map((item, index) => (
                        <li key={index} className="flex gap-3 text-sm text-gray-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
