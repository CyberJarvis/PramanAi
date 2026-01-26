"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/lib/LanguageContext";

export default function LanguageSelector({ compact = false }) {
    const { language, setLanguage, languageInfo, isLoading } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    if (compact) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
                    disabled={isLoading}
                >
                    <span className="text-lg">{languageInfo?.flag}</span>
                    <span className="text-sm text-gray-300">{language.toUpperCase()}</span>
                    {isLoading && (
                        <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-[#0f1019] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                        {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
                            <button
                                key={code}
                                onClick={() => handleLanguageChange(code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${code === language
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span className="text-xl">{info.flag}</span>
                                <div>
                                    <div className="text-sm font-medium">{info.nativeName}</div>
                                    <div className="text-xs text-gray-500">{info.name}</div>
                                </div>
                                {code === language && (
                                    <svg className="w-4 h-4 ml-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Full selector for sidebar
    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] transition-all"
                disabled={isLoading}
            >
                <span className="text-xl">{languageInfo?.flag}</span>
                <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{languageInfo?.nativeName}</div>
                    <div className="text-xs text-gray-500">Language</div>
                </div>
                {isLoading ? (
                    <svg className="w-4 h-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                ) : (
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-full py-2 bg-[#0f1019] border border-white/10 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
                        <button
                            key={code}
                            onClick={() => handleLanguageChange(code)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${code === language
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{info.flag}</span>
                            <div className="flex-1">
                                <div className="text-sm font-medium">{info.nativeName}</div>
                                <div className="text-xs text-gray-500">{info.name}</div>
                            </div>
                            {code === language && (
                                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
