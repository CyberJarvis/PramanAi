"use client";

import { useState } from "react";

export default function AssumptionsPanel({ assumptions, limitations }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-white">Assumptions & Limitations</span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="px-6 pb-5 space-y-4">
                    {assumptions && assumptions.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Assumptions</h4>
                            <ul className="space-y-2">
                                {assumptions.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {limitations && limitations.length > 0 && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Limitations</h4>
                            <ul className="space-y-2">
                                {limitations.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
