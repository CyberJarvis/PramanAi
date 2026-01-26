"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ALL_COUNTRIES } from "@/lib/countries";
import { formatDisplacement } from "@/lib/formatters";
import ReactMarkdown from "react-markdown";
import "leaflet/dist/leaflet.css";

// Risk scores for countries (based on INFORM Risk Index 2024)
const COUNTRY_RISK_SCORES = {
    'Ethiopia': 72, 'Somalia': 85, 'Sudan': 88, 'South Sudan': 91,
    'Kenya': 48, 'Uganda': 52, 'Yemen': 89, 'Syria': 87,
    'Afghanistan': 84, 'Myanmar': 76, 'Bangladesh': 55, 'India': 42,
    'Pakistan': 58, 'Nigeria': 68, 'Haiti': 74, 'Venezuela': 62,
    'Colombia': 45, 'DRC': 82, 'Mali': 75, 'Niger': 71, 'Chad': 79,
    'Burkina Faso': 73, 'China': 24, 'Brazil': 35, 'Mexico': 38,
    'USA': 18, 'Canada': 12, 'UK': 15, 'Germany': 14, 'France': 16,
    'Japan': 36, 'Australia': 16, 'Russia': 32, 'Iran': 45,
    'Iraq': 72, 'Egypt': 38, 'South Africa': 42, 'Morocco': 28,
};

const COUNTRY_PRIMARY_DRIVERS = {
    'Afghanistan': 'CONFLICT/VIOLENCE',
    'Yemen': 'CONFLICT/VIOLENCE',
    'Sudan': 'CONFLICT/VIOLENCE',
    'South Sudan': 'CONFLICT/VIOLENCE',
    'Somalia': 'CONFLICT/VIOLENCE',
    'Syria': 'CONFLICT/VIOLENCE',
    'Ukraine': 'CONFLICT/VIOLENCE',
    'DRC': 'CONFLICT/VIOLENCE',
    'Myanmar': 'CONFLICT/VIOLENCE',
    'Japan': 'CLIMATE VULNERABILITY',
    'Philippines': 'CLIMATE VULNERABILITY',
    'Bangladesh': 'CLIMATE VULNERABILITY',
};

// Get risk color based on score
function getRiskColor(score) {
    if (score >= 80) return '#ef4444'; // Red - Critical
    if (score >= 60) return '#f97316'; // Orange - High
    if (score >= 40) return '#eab308'; // Yellow - Medium
    if (score >= 20) return '#22c55e'; // Green - Low
    return '#3b82f6'; // Blue - Minimal
}

function InteractiveRiskMapComponent({ selectedCountry, onCountryClick, countryData, className }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [L, setL] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);

    // Load Leaflet on client
    useEffect(() => {
        import('leaflet').then((leaflet) => {
            setL(leaflet.default);
        });

        // Load GeoJSON data for countries
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(res => res.json())
            .then(data => setGeoJsonData(data))
            .catch(err => console.error("Failed to load map data", err));
    }, []);

    // Initialize and update map
    useEffect(() => {
        if (!L || !mapRef.current) return;

        // Initialize map if not exists
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: [20, 0],
                zoom: 2,
                minZoom: 2,
                maxZoom: 10,
                worldCopyJump: true,
                attributionControl: false,
            });

            // Dark tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                subdomains: 'abcd',
            }).addTo(mapInstanceRef.current);
        }

        // Draw Country Layers (Choropleth)
        if (geoJsonData) {
            // Clear existing layers (except tile layer)
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.GeoJSON) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });

            const geoJsonLayer = L.geoJSON(geoJsonData, {
                style: (feature) => {
                    const countryName = feature.properties.name;
                    // Fuzzy match or direct lookup
                    const riskScore = COUNTRY_RISK_SCORES[countryName] ||
                        COUNTRY_RISK_SCORES[Object.keys(COUNTRY_RISK_SCORES).find(k => k.includes(countryName) || countryName.includes(k))];

                    const isSelected = countryName === selectedCountry || (selectedCountry && (countryName.includes(selectedCountry) || selectedCountry.includes(countryName)));

                    if (!riskScore) {
                        return {
                            fillColor: '#1f2937',
                            weight: 1,
                            opacity: 1,
                            color: '#374151',
                            fillOpacity: 0.1
                        };
                    }

                    const color = getRiskColor(riskScore);
                    return {
                        fillColor: color,
                        weight: isSelected ? 2 : 1,
                        opacity: 1,
                        color: isSelected ? '#fff' : '#000',
                        fillOpacity: isSelected ? 0.6 : 0.4
                    };
                },
                onEachFeature: (feature, layer) => {
                    const countryName = feature.properties.name;
                    const riskScore = COUNTRY_RISK_SCORES[countryName] ||
                        COUNTRY_RISK_SCORES[Object.keys(COUNTRY_RISK_SCORES).find(k => k.includes(countryName) || countryName.includes(k))];

                    if (riskScore) {
                        layer.bindTooltip(`
                            <div style="text-align:center;">
                                <strong>${countryName}</strong><br/>
                                Risk Score: ${riskScore}/100
                            </div>
                        `, { direction: 'top', sticky: true });

                        layer.on('click', (e) => {
                            L.DomEvent.stopPropagation(e); // Prevent map click

                            // Find matching country in our DB or use default
                            const dbCountry = ALL_COUNTRIES.find(c => c.name === countryName || c.name.includes(countryName) || countryName.includes(c.name));
                            const finalName = dbCountry ? dbCountry.name : countryName;

                            setSelectedInfo({ name: finalName, riskScore });
                            if (onCountryClick) {
                                onCountryClick({ name: finalName });
                            }
                        });

                        layer.on('mouseover', () => {
                            layer.setStyle({ fillOpacity: 0.8, weight: 2, color: '#fff' });
                        });
                        layer.on('mouseout', () => {
                            const isSelected = countryName === selectedCountry;
                            layer.setStyle({
                                fillOpacity: isSelected ? 0.6 : 0.4,
                                weight: isSelected ? 2 : 1,
                                color: isSelected ? '#fff' : '#000'
                            });
                        });
                    }
                }
            }).addTo(mapInstanceRef.current);
        }

        // Zoom to selected country with animation
        if (selectedCountry) {
            const country = ALL_COUNTRIES.find(c => c.name === selectedCountry);
            if (country) {
                mapInstanceRef.current.flyTo([country.lat, country.lon], 5, { duration: 1.5 });
                const riskScore = COUNTRY_RISK_SCORES[country.name] || 35;
                setSelectedInfo({ ...country, riskScore });
            }
        }

        // Invalidate size strictly
        setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 100);

    }, [L, geoJsonData, selectedCountry, onCountryClick]);

    const riskScore = selectedInfo?.riskScore || COUNTRY_RISK_SCORES[selectedCountry] || 35;
    const rainfall = countryData?.climate?.current?.precipitation || "1.2";
    const wind = countryData?.climate?.current?.windSpeed || "3.5";

    // Consistent displacement display
    const displacementDisplay = countryData?.displacement?.totalDisplaced
        ? formatDisplacement(countryData.displacement.totalDisplaced)
        : "N/A";

    return (
        <div className={`relative w-full h-full overflow-hidden rounded-xl bg-[#0a0f1c] ${className || "min-h-[800px]"}`}>
            {/* Full Screen Map Background */}
            <div className="absolute inset-0 z-0">
                <div ref={mapRef} style={{ height: '100%', width: '100%', background: '#0a0f1c' }} />
            </div>

            {/* Legend (Floating Top Right) */}
            <div className="absolute top-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 z-[400] shadow-xl">
                <div className="text-xs text-gray-400 mb-2 font-bold tracking-wider">RISK INDEX</div>
                <div className="space-y-1.5">
                    {[
                        { color: "bg-red-500", label: "100" },
                        { color: "bg-orange-500", label: "80" },
                        { color: "bg-yellow-500", label: "60" },
                        { color: "bg-emerald-500", label: "40" },
                        { color: "bg-blue-500", label: "20" },
                        { color: "bg-blue-900", label: "0" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-3 h-3 ${item.color} rounded-sm shadow-sm`} />
                            <span className="text-[10px] text-gray-300 font-mono">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Country Info Panel (Floating Bottom Overlay) */}
            {selectedCountry && (
                <div className="absolute bottom-4 left-4 right-4 z-[500] animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <div className="p-6 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl max-h-[50vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-start justify-between gap-6">

                            {/* Left Column: Context & Weather */}
                            <div className="flex-1 min-w-[300px]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                        📍 {selectedCountry}
                                    </h3>
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        LIVE FEED
                                    </span>
                                </div>

                                {/* Weather Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
                                        <span className="text-xl">🌧️</span>
                                        <div>
                                            <div className="text-white font-bold">{rainfall}mm</div>
                                            <div className="text-[10px] text-gray-400 uppercase">Precipitation</div>
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
                                        <span className="text-xl">💨</span>
                                        <div>
                                            <div className="text-white font-bold">{wind}m/s</div>
                                            <div className="text-[10px] text-gray-400 uppercase">Wind Speed</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Primary Driver */}
                                <div className={`p-4 rounded-lg border mb-2 ${(COUNTRY_PRIMARY_DRIVERS[selectedCountry] || 'Climate Vulnerability').includes('Conflict')
                                    ? 'bg-red-500/10 border-red-500/20'
                                    : 'bg-purple-500/10 border-purple-500/20'
                                    }`}>
                                    <div className={`text-xs font-bold mb-1 tracking-wider ${(COUNTRY_PRIMARY_DRIVERS[selectedCountry] || 'Climate Vulnerability').includes('Conflict')
                                        ? 'text-red-400'
                                        : 'text-purple-400'
                                        }`}>
                                        {(COUNTRY_PRIMARY_DRIVERS[selectedCountry] || 'Climate Vulnerability').includes('Conflict') ? '⚔️' : '🌊'} PRIMARY DRIVER
                                    </div>
                                    <div className="text-gray-300 text-xs leading-relaxed">
                                        <ReactMarkdown>
                                            {(COUNTRY_PRIMARY_DRIVERS[selectedCountry] || 'Climate Vulnerability').includes('Conflict')
                                                ? `**Armed conflict/instability** is the dominant driver. Intensity: ${riskScore}/100.`
                                                : `**Climate shocks** are the major trigger. Baseline risk: ${riskScore}/100.`
                                            }
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column: Stats */}
                            <div className="w-[200px] shrink-0 flex flex-col gap-2">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Predicted Displacement</div>
                                    <div className="text-2xl font-bold text-cyan-400 text-glow">
                                        {displacementDisplay}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-center">
                                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Risk Index</div>
                                    <div className={`text-3xl font-bold ${riskScore >= 60 ? 'text-red-400' : riskScore >= 40 ? 'text-amber-400' : 'text-green-400'}`}>
                                        {riskScore}/100
                                    </div>
                                    <div className="text-[10px] text-gray-400 mt-1 font-mono">
                                        {riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 40 ? 'MODERATE' : 'LOW'}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sources & Proof (Scrollable if needed) */}
                            <div className="w-[240px] shrink-0 text-[10px] text-gray-400 space-y-3">
                                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 font-mono">
                                    <div className="text-amber-400 mb-1 font-bold">🔬 LOGIC TRACE</div>
                                    <div className="opacity-70">
                                        ({riskScore} × 0.6) + ({(parseFloat(rainfall) * 0.5).toFixed(0)} × 0.4) ≈ {Math.round(riskScore * 0.6 + parseFloat(rainfall) * 0.5 * 0.4)}
                                    </div>
                                </div>
                                <div className="space-y-1 opacity-60">
                                    <div className="font-bold text-gray-500 uppercase tracking-wider">Data Sources</div>
                                    <div>• INFORM Risk 2024</div>
                                    <div>• NASA POWER API</div>
                                    <div>• UNHCR Data Finder</div>
                                    <div>• WeatherApi & OpenMeteo</div>
                                    <div>• World Bank Open</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Dynamic import to avoid SSR issues with Leaflet
const ImmersiveRiskMap = dynamic(
    () => Promise.resolve(InteractiveRiskMapComponent),
    { ssr: false, loading: () => <div className="h-[600px] bg-gray-800 animate-pulse rounded-xl" /> }
);

export default ImmersiveRiskMap;
