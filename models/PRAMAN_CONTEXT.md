# PRAMAN.AI Python Model Context (`models/praman.py`)

This file is a comprehensive **Streamlit prototype** for the PRAMAN.AI Migration Analytics Platform. It serves as the reference logic for the Next.js application.

## Core Capabilities

### 1. Data Intelligence
- **Global Intelligence Registry**: Hardcoded database (`COUNTRY_REGISTRY`) of ~20 countries with:
  - ISO Codes & Coordinates
  - Baseline Risk (Inform Index)
  - Conflict Index
  - Governance Index
  - Climate Vulnerability Score
- **NASA POWER API**: Real-time climate data fetching (Precipitation & Wind Speed) used to calculate "Weather Shock".
- **Risk Calculation Engine**: `calculate_unified_risk()` combines baseline structural risk (60%) with real-time weather shock (40%) to predict displacement numbers and status (CRITICAL, SEVERE, etc.).

### 2. Deep Intelligence (Tab 1)
- **RAG System**: Ingests PDF reports, creates vector embeddings (FAISS + HuggingFace), and allows querying via Groq LLM (`llama-3.3-70b`).
- **Analyst Personas**: 5 distinct AI personas (UN Crisis Coordinator, Climate Data Scientist, etc.) for varied analysis.
- **Interactive Map**: Plotly choropleth map summarizing global risk.
- **Deterministic Charting**: Generates reproducible trend charts based on country queries without needing a database.

### 3. Causal Simulator (Tab 2)
- **Causal DAG**: Visualizes displacement pathways (Climate/Conflict -> Stress -> Displacement) using NetworkX + Plotly.
- **Counterfactual Engine**: `CausalDeepLearningEngine` class simulates 12-week displacement trajectories comparing "Baseline" vs "Intervention" scenarios (Logistic growth model with decay).
- **Intervention Slider**: Allows users to test policy strength (None to High) and see prevented displacement metrics.

### 4. Situation Room (Tab 3)
- **Multi-Stakeholder Council**: Simulates a debate between an Economist, Human Rights Expert, and Security Analyst on two user-defined policy scenarios.
- **Synthesis Verdict**: Generates a final policy recommendation and a radar chart comparing scenarios across ROI, Ethics, Stability, Speed, and Feasibility.

## Migration Roadmap (Python -> Next.js)

To fully port this to the web app, we need to:

1. [x] **Maps**: Leaflet/Mapbox integration (Done via Leaflet).
2. [x] **Data**: Unified Data API with NASA/UNHCR (Done).
3. [ ] **Causal Simulator**: Port `CausalDeepLearningEngine` logic to JavaScript/Python backend.
4. [ ] **Situation Room**: Implement the multi-persona LLM debate using Vercel AI SDK or direct Groq calls.
5. [ ] **RAG**: Implement document upload and vector search (e.g., using Pinecone/Supabase pgvector).
