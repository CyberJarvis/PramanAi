"use client";

import { cn } from "@/lib/utils";

export default function GlassCard({ children, className, hoverEffect = true, ...props }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.03] p-6 backdrop-blur-xl",
                hoverEffect && "transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08] hover:shadow-xl hover:shadow-blue-500/5",
                className
            )}
            {...props}
        >
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
