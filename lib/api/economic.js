// Economic Data - World Bank API
// No API key required

const WORLD_BANK_BASE = 'https://api.worldbank.org/v2';

/**
 * Get World Bank indicator data for a country
 * @param {string} countryCode - ISO2 country code (e.g., 'ET', 'SO')
 * @param {string} indicator - World Bank indicator code
 * @param {number} yearStart - Start year
 * @param {number} yearEnd - End year
 */
export async function getWorldBankIndicator(countryCode, indicator, yearStart, yearEnd) {
    const params = new URLSearchParams({
        format: 'json',
        date: `${yearStart}:${yearEnd}`,
        per_page: 100,
    });

    const response = await fetch(
        `${WORLD_BANK_BASE}/country/${countryCode}/indicator/${indicator}?${params}`
    );

    if (!response.ok) {
        throw new Error(`World Bank API error: ${response.status}`);
    }

    const data = await response.json();
    // World Bank returns [metadata, data] array
    return data[1] || [];
}

// Key economic indicators for displacement analysis
export const INDICATORS = {
    GDP_PER_CAPITA: 'NY.GDP.PCAP.CD',
    FOOD_PRICE_INDEX: 'AG.PRD.FOOD.XD',
    AGRICULTURE_GDP: 'NV.AGR.TOTL.ZS',
    UNEMPLOYMENT: 'SL.UEM.TOTL.ZS',
    POVERTY_RATIO: 'SI.POV.NAHC',
    INFLATION: 'FP.CPI.TOTL.ZG',
    POPULATION: 'SP.POP.TOTL',
    RURAL_POPULATION: 'SP.RUR.TOTL.ZS',
};

/**
 * Get economic overview for a country
 * @param {string} countryCode - ISO2 country code
 * @param {number} yearStart - Start year
 * @param {number} yearEnd - End year
 */
export async function getEconomicOverview(countryCode, yearStart, yearEnd) {
    const indicatorPromises = Object.entries(INDICATORS).map(async ([name, code]) => {
        try {
            const data = await getWorldBankIndicator(countryCode, code, yearStart, yearEnd);
            return {
                name,
                code,
                data: data.map(d => ({
                    year: parseInt(d.date),
                    value: d.value,
                })).filter(d => d.value !== null).sort((a, b) => a.year - b.year),
            };
        } catch {
            return { name, code, data: [], error: true };
        }
    });

    const results = await Promise.all(indicatorPromises);

    return results.reduce((acc, item) => {
        acc[item.name] = item.data;
        return acc;
    }, {});
}

/**
 * Calculate economic stress index
 * Combines inflation, food prices, and GDP changes
 */
export function calculateEconomicStress(economicData) {
    const inflation = economicData.INFLATION || [];
    const gdp = economicData.GDP_PER_CAPITA || [];

    if (inflation.length === 0 || gdp.length === 0) {
        return null;
    }

    // Simple stress calculation
    const latestInflation = inflation[inflation.length - 1]?.value || 0;
    const gdpChange = gdp.length >= 2
        ? ((gdp[gdp.length - 1].value - gdp[gdp.length - 2].value) / gdp[gdp.length - 2].value) * 100
        : 0;

    // Higher inflation + lower GDP growth = higher stress
    const stressIndex = Math.min(100, Math.max(0,
        (latestInflation * 2) + (gdpChange < 0 ? Math.abs(gdpChange) * 3 : 0)
    ));

    return {
        stressIndex: Math.round(stressIndex),
        inflation: latestInflation,
        gdpChange: gdpChange.toFixed(2),
        level: stressIndex > 60 ? 'High' : stressIndex > 30 ? 'Medium' : 'Low',
    };
}

// ISO3 to ISO2 mapping for World Bank API
export const ISO3_TO_ISO2 = {
    'ETH': 'ET',
    'SOM': 'SO',
    'SDN': 'SD',
    'SSD': 'SS',
    'KEN': 'KE',
    'YEM': 'YE',
    'AFG': 'AF',
    'SYR': 'SY',
    'BGD': 'BD',
    'MMR': 'MM',
    'GTM': 'GT',
    'HND': 'HN',
    'HTI': 'HT',
    'NGA': 'NG',
    'MLI': 'ML',
    'NER': 'NE',
    'TCD': 'TD',
    'BFA': 'BF',
};
