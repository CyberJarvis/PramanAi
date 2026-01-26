"use client";

import { useData } from "@/lib/DataContext";
import ImmersiveRiskMap from "@/components/ImmersiveRiskMap";
import RegionSelector from "@/components/RegionSelector";

export default function MapPage() {
    const { region, data, changeRegion } = useData();

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
            {/* Header Overlay */}
            <div className="flex items-center justify-between shrink-0 px-1">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Global Risk Monitor</h1>
                    <p className="text-gray-400">
                        Interactive geospatial analysis of displacement drivers
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">Live Feed Active</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/[0.08] relative shadow-2xl shadow-black/50">
                <ImmersiveRiskMap
                    selectedCountry={region}
                    onCountryClick={(country) => changeRegion(country.name)}
                    countryData={data}
                    className="h-full"
                />
            </div>
        </div>
    );
}
