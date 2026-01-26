"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";

export default function AttributionBreakdown({ data }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    // Determine what to display in the center
    const topDriver = data.reduce((prev, current) => (prev.contribution > current.contribution) ? prev : current);
    const activeItem = activeIndex !== null ? data[activeIndex] : topDriver;
    const label = activeIndex !== null ? "Selected Factor" : "Top Driver";

    return (
        <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Chart Column */}
            <div className="h-[380px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={120}
                            outerRadius={160}
                            paddingAngle={5}
                            dataKey="contribution"
                            nameKey="factor"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke="rgba(0,0,0,0)"
                                    className="transition-all duration-300 outline-none cursor-pointer"
                                    style={{
                                        filter: activeIndex === index ? `drop-shadow(0 0 10px ${entry.color}80)` : 'none',
                                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text (Dynamic) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                    <span className="text-gray-400 text-xs uppercase tracking-wider animate-fade-in">
                        {label}
                    </span>
                    <span
                        className="text-xl md:text-2xl font-bold text-white mt-1 text-center px-4 animate-fade-in"
                        style={{ color: activeIndex !== null ? activeItem.color : 'white' }}
                    >
                        {activeItem.factor}
                    </span>
                    <span className="text-lg font-medium text-gray-300 mt-1">
                        {activeItem.contribution}%
                    </span>
                </div>
            </div>

            {/* Legend Column */}
            <div className="space-y-4">
                {data.map((factor, index) => (
                    <div
                        key={index}
                        className={`group p-4 rounded-xl border transition-all duration-300 cursor-pointer ${activeIndex === index
                            ? "bg-white/[0.05] border-white/20 scale-105 shadow-lg"
                            : "bg-transparent border-transparent hover:bg-white/[0.02]"
                            }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-3 h-3 rounded-full shadow-[0_0_10px] transition-all duration-300`}
                                    style={{
                                        backgroundColor: factor.color,
                                        boxShadow: activeIndex === index ? `0 0 15px ${factor.color}` : `0 0 5px ${factor.color}`,
                                        transform: activeIndex === index ? 'scale(1.2)' : 'scale(1)'
                                    }}
                                />
                                <span className={`font-medium transition-colors ${activeIndex === index ? "text-white" : "text-gray-300"
                                    }`}>
                                    {factor.factor}
                                </span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                {factor.contribution}%
                            </span>
                        </div>
                        <p className={`text-sm transition-colors ${activeIndex === index ? "text-gray-300" : "text-gray-500"
                            }`}>
                            {factor.description}
                        </p>

                        {/* Comparison Bar */}
                        <div className="mt-3 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${factor.contribution}%`,
                                    backgroundColor: factor.color,
                                    opacity: activeIndex === index ? 1 : 0.5
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
