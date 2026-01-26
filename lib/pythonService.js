/**
 * Python Backend Service Client
 * Handles secure communication with the FastAPI microservice.
 */

const SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
const SECRET_KEY = process.env.PYTHON_SERVICE_SECRET || 'dev_secret_key_change_in_prod';

class PythonService {
    constructor() {
        this.baseUrl = SERVICE_URL;
        this.headers = {
            'Content-Type': 'application/json',
            'X-Internal-Secret': SECRET_KEY
        };
    }

    /**
     * Run simulation on Python backend
     */
    async runSimulation(country, interventionStrength, currentRain) {
        try {
            const response = await fetch(`${this.baseUrl}/api/simulation/run`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    country,
                    intervention_strength: interventionStrength,
                    current_rain: currentRain
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Python Service Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Python Service Connection Failed:', error);
            throw error; // Propagate to Next.js API route to handle
        }
    }

    /**
     * Run risk analysis on Python backend
     */
    async analyzeRisk(country, rainMm, windMs) {
        try {
            const response = await fetch(`${this.baseUrl}/api/risk/analyze`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    country,
                    rain_mm: rainMm,
                    wind_ms: windMs
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || `Python Service Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Python Service Connection Failed:', error);
            throw error;
        }
    }
}

export const pythonService = new PythonService();
