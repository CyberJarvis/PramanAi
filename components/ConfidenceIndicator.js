"use client";

export default function ConfidenceIndicator({ level, score }) {
    const getColor = () => {
        if (score >= 80) return { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" };
        if (score >= 60) return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" };
        return { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400" };
    };

    const colors = getColor();

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border}`}>
            <div className={`w-2 h-2 rounded-full ${colors.text.replace("text-", "bg-")}`} />
            <span className={`text-sm font-medium ${colors.text}`}>
                {level}: {score}%
            </span>
        </div>
    );
}
