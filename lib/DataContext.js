"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { ALL_COUNTRIES, ISO3_TO_ISO2 } from "@/lib/countries";

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const [region, setRegion] = useState("India");
    const [regionData, setRegionData] = useState(null); // Store full region object
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (countryObj) => {
        setLoading(true);
        setError(null);

        // Get the country object if we only have a name
        const country = typeof countryObj === "object"
            ? countryObj
            : ALL_COUNTRIES.find(c => c.name === countryObj) || ALL_COUNTRIES[0];

        try {
            const params = new URLSearchParams({
                country: country.name,
                lat: country.lat.toString(),
                lon: country.lon.toString(),
                code: country.code,
            });
            const response = await fetch(`/api/data/unified?${params}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const result = await response.json();

            // Ensure coordinates are from the selected country
            result.region = {
                ...result.region,
                country: country.name,
                countryCode: country.code,
                coordinates: { lat: country.lat, lon: country.lon },
                continent: country.region,
            };

            setData(result);
            setRegionData(country);
        } catch (err) {
            console.error("Data fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const changeRegion = (newRegion) => {
        if (typeof newRegion === "object") {
            setRegion(newRegion.name);
            setRegionData(newRegion);
            fetchData(newRegion);
        } else {
            const country = ALL_COUNTRIES.find(c => c.name === newRegion) || ALL_COUNTRIES[0];
            setRegion(newRegion);
            setRegionData(country);
            fetchData(country);
        }
    };

    // Initial fetch
    useEffect(() => {
        const initialCountry = ALL_COUNTRIES.find(c => c.name === region) || ALL_COUNTRIES[0];
        setRegionData(initialCountry);
        fetchData(initialCountry);
    }, []);

    return (
        <DataContext.Provider value={{
            region,
            regionData,
            data,
            loading,
            error,
            changeRegion,
            refetch: () => fetchData(regionData || region)
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
