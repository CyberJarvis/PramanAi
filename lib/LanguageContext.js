"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// Supported languages (must match API)
export const SUPPORTED_LANGUAGES = {
    en: { name: "English", nativeName: "English", flag: "🇬🇧", rtl: false },
    es: { name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
    fr: { name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
    ar: { name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true },
    zh: { name: "Chinese", nativeName: "中文", flag: "🇨🇳", rtl: false },
    hi: { name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", rtl: false },
    pt: { name: "Portuguese", nativeName: "Português", flag: "🇧🇷", rtl: false },
    ru: { name: "Russian", nativeName: "Русский", flag: "🇷🇺", rtl: false },
    ja: { name: "Japanese", nativeName: "日本語", flag: "🇯🇵", rtl: false },
    de: { name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
};

const LanguageContext = createContext(null);

// Client-side translation cache
const clientCache = new Map();

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState("en");
    const [isLoading, setIsLoading] = useState(false);
    const [translations, setTranslations] = useState({});

    // Load saved language preference
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedLang = localStorage.getItem("praman_language");
            if (savedLang && SUPPORTED_LANGUAGES[savedLang]) {
                setLanguageState(savedLang);
            }
        }
    }, []);

    // Save language preference
    const setLanguage = useCallback((lang) => {
        if (SUPPORTED_LANGUAGES[lang]) {
            setLanguageState(lang);
            if (typeof window !== "undefined") {
                localStorage.setItem("praman_language", lang);
            }
            // Clear translations when language changes (force re-translate)
            setTranslations({});
        }
    }, []);

    // Translate a single text
    const translate = useCallback(async (text, forceRefresh = false) => {
        if (!text || typeof text !== "string") return text;
        if (language === "en") return text; // English is source language

        const cacheKey = `${language}:${text}`;

        // Check client cache
        if (!forceRefresh && clientCache.has(cacheKey)) {
            return clientCache.get(cacheKey);
        }

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, targetLang: language }),
            });

            const data = await response.json();
            if (data.success && data.translations?.[0]) {
                const translated = data.translations[0];
                clientCache.set(cacheKey, translated);
                return translated;
            }
        } catch (error) {
            console.error("Translation error:", error);
        }

        return text; // Fallback to original
    }, [language]);

    // Batch translate multiple texts
    const translateBatch = useCallback(async (texts) => {
        if (!texts || texts.length === 0) return texts;
        if (language === "en") return texts;

        setIsLoading(true);

        try {
            // Check which texts need translation
            const uncached = [];
            const results = texts.map((text, i) => {
                const cacheKey = `${language}:${text}`;
                if (clientCache.has(cacheKey)) {
                    return { index: i, text: clientCache.get(cacheKey), cached: true };
                }
                uncached.push({ index: i, text });
                return { index: i, text, cached: false };
            });

            if (uncached.length > 0) {
                const response = await fetch("/api/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: uncached.map(u => u.text),
                        targetLang: language
                    }),
                });

                const data = await response.json();
                if (data.success && data.translations) {
                    data.translations.forEach((translated, i) => {
                        const original = uncached[i];
                        const cacheKey = `${language}:${original.text}`;
                        clientCache.set(cacheKey, translated);
                        results[original.index].text = translated;
                    });
                }
            }

            return results.map(r => r.text);
        } catch (error) {
            console.error("Batch translation error:", error);
            return texts;
        } finally {
            setIsLoading(false);
        }
    }, [language]);

    // Get language info
    const languageInfo = useMemo(() => SUPPORTED_LANGUAGES[language], [language]);
    const isRTL = languageInfo?.rtl || false;

    const value = {
        language,
        setLanguage,
        languageInfo,
        isRTL,
        isLoading,
        translate,
        translateBatch,
        SUPPORTED_LANGUAGES,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

// Hook to use language context
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

// Hook for translating a single piece of text with live updates
export function useTranslation(text) {
    const { language, translate } = useLanguage();
    const [translated, setTranslated] = useState(text);

    useEffect(() => {
        if (language === "en") {
            setTranslated(text);
            return;
        }

        let mounted = true;
        translate(text).then((result) => {
            if (mounted) setTranslated(result);
        });

        return () => { mounted = false; };
    }, [text, language, translate]);

    return translated;
}

export default LanguageContext;
