"use client";

import { useTranslation } from "@/lib/LanguageContext";

/**
 * T - Translatable Text Component
 * 
 * Usage:
 *   <T>Hello World</T>
 *   <T as="h1" className="text-2xl">Dashboard</T>
 * 
 * This component automatically translates its children text
 * based on the current language setting.
 */
export default function T({ children, as: Component = "span", className = "", ...props }) {
    const translated = useTranslation(typeof children === "string" ? children : "");

    // If children is not a string, just render it as-is
    if (typeof children !== "string") {
        return <Component className={className} {...props}>{children}</Component>;
    }

    return (
        <Component className={className} {...props}>
            {translated}
        </Component>
    );
}

/**
 * useT - Hook version for more control
 * 
 * Usage:
 *   const t = useT();
 *   const title = t("Dashboard");
 */
export function useT() {
    const { translate, language } = require("@/lib/LanguageContext").useLanguage();

    return async (text) => {
        if (language === "en") return text;
        return await translate(text);
    };
}
