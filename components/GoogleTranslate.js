"use client";

import { useEffect, useState, useRef } from "react";

// Supported languages
const LANGUAGES = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
    { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
    { code: "zh-CN", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

/**
 * GoogleTranslate Component - Simple Full-Page Translation
 * Uses Google Translate's website widget to translate entire page content.
 */
export default function GoogleTranslate() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
    const [isLoaded, setIsLoaded] = useState(false);
    const initRef = useRef(false);

    // Initialize Google Translate widget ONCE
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        // Add CSS to hide Google's default UI
        const style = document.createElement('style');
        style.id = 'google-translate-styles';
        style.innerHTML = `
            .goog-te-banner-frame { display: none !important; }
            body { top: 0 !important; position: static !important; }
            .skiptranslate { display: none !important; }
            #google_translate_element { position: absolute; left: -9999px; opacity: 0; pointer-events: none; }
            .goog-te-gadget { font-size: 0 !important; }
        `;
        if (!document.getElementById('google-translate-styles')) {
            document.head.appendChild(style);
        }

        // Read saved preference (but don't auto-translate on load to avoid loop)
        const savedLang = localStorage.getItem('praman_language');
        if (savedLang) {
            const langInfo = LANGUAGES.find(l => l.code === savedLang);
            if (langInfo) setCurrentLang(langInfo);
        }

        // Define callback for Google Translate
        window.googleTranslateElementInit = () => {
            if (window.google?.translate?.TranslateElement) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: LANGUAGES.map(l => l.code).join(','),
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    'google_translate_element'
                );
                setIsLoaded(true);
            }
        };

        // Load Google Translate script only if not already loaded
        if (!document.getElementById('google-translate-script') && !window.google?.translate) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        } else if (window.google?.translate) {
            setIsLoaded(true);
        }
    }, []);

    // Handle language selection - uses cookie approach (NO page reload)
    const handleLanguageSelect = (lang) => {
        setCurrentLang(lang);
        setIsOpen(false);
        localStorage.setItem('praman_language', lang.code);

        // Set translation cookie
        if (lang.code === 'en') {
            // Clear translation
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } else {
            document.cookie = `googtrans=/en/${lang.code}; path=/;`;
        }

        // Trigger Google Translate programmatically (without reload)
        // Find and click the appropriate language in Google's hidden dropdown
        setTimeout(() => {
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = lang.code;
                select.dispatchEvent(new Event('change'));
            } else {
                // Fallback: Only reload if absolutely necessary (user clicked)
                window.location.reload();
            }
        }, 100);
    };

    return (
        <>
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" style={{ display: 'none' }} />

            {/* Custom Language Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] transition-all"
                >
                    <span className="text-xl">{currentLang.flag}</span>
                    <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-white">{currentLang.nativeName}</div>
                        <div className="text-xs text-gray-500">Language</div>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-full py-2 bg-[#0f1019] border border-white/10 rounded-xl shadow-2xl z-[9999] max-h-80 overflow-y-auto">
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageSelect(lang)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${lang.code === currentLang.code
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-gray-300 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex-1">
                                    <div className="text-sm font-medium">{lang.nativeName}</div>
                                    <div className="text-xs text-gray-500">{lang.name}</div>
                                </div>
                                {lang.code === currentLang.code && (
                                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
