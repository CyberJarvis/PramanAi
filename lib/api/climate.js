// Climate Data APIs - Open-Meteo & NASA POWER
// No API keys required for these services

/**
 * Fetch historical climate data from Open-Meteo
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 */
export async function getOpenMeteoData(lat, lon, startDate, endDate) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        start_date: startDate,
        end_date: endDate,
        daily: [
            'temperature_2m_max',
            'temperature_2m_min',
            'precipitation_sum',
            'rain_sum',
            'et0_fao_evapotranspiration',
        ].join(','),
        timezone: 'auto',
    });

    const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?${params}`
    );

    if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch NASA POWER data (solar, temperature, precipitation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude  
 * @param {string} startDate - YYYYMMDD format
 * @param {string} endDate - YYYYMMDD format
 */
export async function getNASAPowerData(lat, lon, startDate, endDate) {
    const params = new URLSearchParams({
        parameters: 'T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN',
        community: 'AG',
        longitude: lon,
        latitude: lat,
        start: startDate.replace(/-/g, ''),
        end: endDate.replace(/-/g, ''),
        format: 'JSON',
    });

    if (process.env.NASA_API_KEY) {
        params.append('api_key', process.env.NASA_API_KEY);
    }

    const response = await fetch(
        `https://power.larc.nasa.gov/api/temporal/daily/point?${params}`
    );

    if (!response.ok) {
        throw new Error(`NASA POWER API error: ${response.status}`);
    }

    return response.json();
}

/**
 * Calculate drought severity index from climate data
 * Simple implementation based on precipitation deficit
 */
export function calculateDroughtIndex(climateData) {
    if (!climateData?.daily?.precipitation_sum) {
        return null;
    }

    const precipitation = climateData.daily.precipitation_sum;
    const avgPrecip = precipitation.reduce((a, b) => a + b, 0) / precipitation.length;

    // Monthly aggregation
    const monthlyData = [];
    for (let i = 0; i < precipitation.length; i += 30) {
        const monthlyPrecip = precipitation.slice(i, i + 30).reduce((a, b) => a + b, 0);
        const deficit = Math.max(0, 100 - (monthlyPrecip / (avgPrecip * 30)) * 100);
        monthlyData.push({
            month: climateData.daily.time[i]?.substring(0, 7),
            precipitation: monthlyPrecip,
            droughtIndex: Math.min(100, deficit),
        });
    }

    return monthlyData;
}

/**
 * Get unified climate analysis for a region
 */
export async function getClimateAnalysis(lat, lon, startDate, endDate) {
    try {
        const [openMeteo, nasaPower] = await Promise.all([
            getOpenMeteoData(lat, lon, startDate, endDate),
            getNASAPowerData(lat, lon, startDate, endDate).catch(() => null),
        ]);

        const droughtTimeline = calculateDroughtIndex(openMeteo);

        return {
            source: 'Open-Meteo + NASA POWER',
            location: { lat, lon },
            period: { startDate, endDate },
            daily: openMeteo.daily,
            droughtTimeline,
            nasaPower: nasaPower?.properties?.parameter || null,
        };
    } catch (error) {
        console.error('Climate API error:', error);
        throw error;
    }
}
