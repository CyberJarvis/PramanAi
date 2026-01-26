// Conflict Data - Fallback with mock/static data
// ACLED API removed - using baseline conflict indices from registry

/**
 * Get conflict data for a country
 * Uses static baseline data since ACLED requires registration
 * @param {string} country - Country name
 */
export async function getConflictData(country, yearStart, yearEnd) {
    // Static conflict indices by country (based on INFORM Risk Index)
    const conflictBaseline = {
        'Somalia': { intensity: 'Critical', index: 9.2, driver: 'Armed Conflict' },
        'Yemen': { intensity: 'Critical', index: 9.1, driver: 'Armed Conflict' },
        'Syria': { intensity: 'Critical', index: 9.0, driver: 'Armed Conflict' },
        'South Sudan': { intensity: 'Very High', index: 8.8, driver: 'Armed Conflict' },
        'Afghanistan': { intensity: 'Very High', index: 8.7, driver: 'Armed Conflict' },
        'Sudan': { intensity: 'Very High', index: 8.5, driver: 'Political Instability' },
        'DR Congo': { intensity: 'Very High', index: 8.4, driver: 'Armed Conflict' },
        'Ethiopia': { intensity: 'High', index: 7.8, driver: 'Internal Conflict' },
        'Nigeria': { intensity: 'High', index: 7.5, driver: 'Boko Haram' },
        'Myanmar': { intensity: 'High', index: 7.2, driver: 'Military Conflict' },
        'Haiti': { intensity: 'High', index: 7.0, driver: 'Gang Violence' },
        'Pakistan': { intensity: 'Medium', index: 5.5, driver: 'Regional Instability' },
        'Kenya': { intensity: 'Medium', index: 4.8, driver: 'Cross-border Tensions' },
        'Bangladesh': { intensity: 'Low', index: 3.2, driver: 'Rohingya Crisis' },
        'India': { intensity: 'Low', index: 2.8, driver: 'Regional Disputes' },
    };

    const baseline = conflictBaseline[country] || {
        intensity: 'Low',
        index: 2.0,
        driver: 'None Identified'
    };

    return {
        events: [], // No live events without API
        count: 0,
        analysis: {
            totalFatalities: 0,
            primaryDriver: baseline.driver,
            intensity: baseline.intensity,
            conflictIndex: baseline.index,
            eventsCount: 0,
            dataSource: 'Static baseline (INFORM Risk Index)'
        },
    };
}
