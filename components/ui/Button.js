"use client";

import { cn } from "@/lib/utils";

const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 border border-blue-500/20",
    secondary: "bg-amber-500 text-white hover:bg-amber-400 shadow-lg shadow-amber-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10",
    destructive: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    outline: "bg-transparent text-white border border-white/10 hover:bg-white/5 hover:border-white/20"
};

const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    className,
    isLoading,
    disabled,
    icon: Icon,
    ...props
}) {
    return (
        <button
            className={cn(
                "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-lg",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            ) : Icon ? (
                <Icon className="w-4 h-4" />
            ) : null}

            {children}

            {/* Glossy Reflection for Primary */}
            {variant === "primary" && (
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}
        </button>
    );
}
