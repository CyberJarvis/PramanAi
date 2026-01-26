"use client";

import { useState, useMemo } from "react";
import { ALL_COUNTRIES } from "@/lib/countries";

export default function RegionSelector({ onRegionChange, currentRegion }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedContinent, setSelectedContinent] = useState("All");

    const continents = ["All", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

    const filteredCountries = useMemo(() => {
        return ALL_COUNTRIES.filter((country) => {
            const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase());
            // When searching, show all matching countries regardless of continent
            // Only apply continent filter when not searching
            const matchesContinent = search.length > 0 || selectedContinent === "All" || country.region === selectedContinent;
            return matchesSearch && matchesContinent;
        });
    }, [search, selectedContinent]);

    const handleSelect = (country) => {
        onRegionChange(country);
        setIsOpen(false);
        setSearch("");
    };

    const selected = ALL_COUNTRIES.find((c) => c.name === currentRegion) || ALL_COUNTRIES[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-all w-full sm:w-auto"
            >
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-left">
                    <div className="text-xs text-gray-500">Selected Region</div>
                    <div className="text-white font-semibold">{selected.name}</div>
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
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full mt-2 right-0 w-80 max-w-[calc(100vw-2rem)] bg-[#0f1629] border border-white/[0.1] rounded-xl shadow-2xl z-50 overflow-hidden">
                        {/* Search */}
                        <div className="p-3 border-b border-white/[0.05]">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search countries..."
                                className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50"
                                autoFocus
                            />
                        </div>

                        {/* Continent Filter */}
                        <div className="p-2 border-b border-white/[0.05] flex flex-wrap gap-1">
                            {continents.map((continent) => (
                                <button
                                    key={continent}
                                    onClick={() => setSelectedContinent(continent)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${selectedContinent === continent
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "text-gray-400 hover:bg-white/[0.05]"
                                        }`}
                                >
                                    {continent}
                                </button>
                            ))}
                        </div>

                        {/* Results count */}
                        <div className="px-3 py-2 border-b border-white/[0.05] text-xs text-gray-500">
                            {filteredCountries.length} countries found
                        </div>

                        {/* Country List */}
                        <div className="max-h-72 overflow-y-auto">
                            {filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    onClick={() => handleSelect(country)}
                                    className={`w-full px-4 py-3 text-left hover:bg-white/[0.05] transition-colors flex items-center justify-between ${country.name === currentRegion ? "bg-blue-500/10" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 w-10">{country.code}</span>
                                        <div>
                                            <div className="text-white font-medium">{country.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {country.region} • {country.lat.toFixed(2)}°, {country.lon.toFixed(2)}°
                                            </div>
                                        </div>
                                    </div>
                                    {country.name === currentRegion && (
                                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}

                            {filteredCountries.length === 0 && (
                                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                    No countries found matching &quot;{search}&quot;
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Export countries for use in other components
export { ALL_COUNTRIES as REGIONS } from "@/lib/countries";
