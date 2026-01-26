import { NextResponse } from "next/server";

// In-memory cache for translations (production: use Redis)
const translationCache = new Map();

// Supported languages
export const SUPPORTED_LANGUAGES = {
    en: { name: "English", nativeName: "English", rtl: false },
    es: { name: "Spanish", nativeName: "Español", rtl: false },
    fr: { name: "French", nativeName: "Français", rtl: false },
    ar: { name: "Arabic", nativeName: "العربية", rtl: true },
    zh: { name: "Chinese", nativeName: "中文", rtl: false },
    hi: { name: "Hindi", nativeName: "हिन्दी", rtl: false },
    pt: { name: "Portuguese", nativeName: "Português", rtl: false },
    ru: { name: "Russian", nativeName: "Русский", rtl: false },
    ja: { name: "Japanese", nativeName: "日本語", rtl: false },
    de: { name: "German", nativeName: "Deutsch", rtl: false },
};

/**
 * POST /api/translate
 * Translates text using Google Translate API
 * 
 * Body: { text: string | string[], targetLang: string, sourceLang?: string }
 * Returns: { success: boolean, translations: string[] }
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { text, targetLang, sourceLang = "en" } = body;

        // Validate inputs
        if (!text || !targetLang) {
            return NextResponse.json(
                { success: false, error: "Missing required fields: text, targetLang" },
                { status: 400 }
            );
        }

        if (!SUPPORTED_LANGUAGES[targetLang]) {
            return NextResponse.json(
                { success: false, error: `Unsupported language: ${targetLang}` },
                { status: 400 }
            );
        }

        // If target is same as source, return original
        if (targetLang === sourceLang) {
            const texts = Array.isArray(text) ? text : [text];
            return NextResponse.json({ success: true, translations: texts });
        }

        // Normalize to array
        const textsToTranslate = Array.isArray(text) ? text : [text];
        const translations = [];
        const uncachedTexts = [];
        const uncachedIndices = [];

        // Check cache first
        for (let i = 0; i < textsToTranslate.length; i++) {
            const cacheKey = `${sourceLang}:${targetLang}:${textsToTranslate[i]}`;
            if (translationCache.has(cacheKey)) {
                translations[i] = translationCache.get(cacheKey);
            } else {
                uncachedTexts.push(textsToTranslate[i]);
                uncachedIndices.push(i);
            }
        }

        // If all cached, return early
        if (uncachedTexts.length === 0) {
            return NextResponse.json({ success: true, translations, fromCache: true });
        }

        // Call Google Translate API
        const apiKey = process.env.GOOGLE_TRANSLATE_API;
        if (!apiKey) {
            console.error("GOOGLE_TRANSLATE_API not set");
            return NextResponse.json(
                { success: false, error: "Translation service unavailable", translations: textsToTranslate },
                { status: 503 }
            );
        }

        const googleApiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        const response = await fetch(googleApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: uncachedTexts,
                source: sourceLang,
                target: targetLang,
                format: "text",
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Google Translate API error:", errorData);
            return NextResponse.json(
                { success: false, error: "Translation API error", translations: textsToTranslate },
                { status: response.status }
            );
        }

        const data = await response.json();
        const googleTranslations = data.data?.translations || [];

        // Map translations back and cache them
        for (let i = 0; i < googleTranslations.length; i++) {
            const translated = googleTranslations[i].translatedText;
            const originalIndex = uncachedIndices[i];
            const originalText = textsToTranslate[originalIndex];

            translations[originalIndex] = translated;

            // Cache the translation
            const cacheKey = `${sourceLang}:${targetLang}:${originalText}`;
            translationCache.set(cacheKey, translated);
        }

        return NextResponse.json({ success: true, translations });
    } catch (error) {
        console.error("Translation error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

/**
 * GET /api/translate/languages
 * Returns list of supported languages
 */
export async function GET() {
    return NextResponse.json({
        success: true,
        languages: SUPPORTED_LANGUAGES,
    });
}
