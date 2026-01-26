"use client";

import { useState } from "react";
import { useData } from "@/lib/DataContext";
import RegionSelector from "@/components/RegionSelector";
import ConfidenceIndicator from "@/components/ConfidenceIndicator";
import TrajectoryChart from "@/components/TrajectoryChart";
import GlassCard from "@/components/ui/GlassCard";

export default function ScenariosPage() {
    const { region, data, changeRegion } = useData();
    const [interventionStrength, setInterventionStrength] = useState(0.4);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Scenario Simulator</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Advanced counterfactual modeling engine for displacement forecasting. Adjust intervention parameters to visualize potential policy impacts.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <RegionSelector onRegionChange={changeRegion} currentRegion={region} />
                    <ConfidenceIndicator level="Medium-High" score={79} />
                </div>
            </div>

            {/* Trajectory Chart - Main Visualization */}
            {/* The component itself handles the card styling now */}
            <TrajectoryChart
                baseDisplacement={data?.displacement?.totalDisplaced / 2000 || 500}
                interventionStrength={interventionStrength}
                onStrengthChange={setInterventionStrength}
            />

            {/* Data Source Footer */}
            <div className="flex justify-center">
                <div className="px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <p className="text-xs text-gray-500 font-medium">
                        Model: Causal Deep Learning Engine v2.1 • Data Sources: NASA POWER, UNHCR, INFORM
                    </p>
                </div>
            </div>
        </div>
    );
}
