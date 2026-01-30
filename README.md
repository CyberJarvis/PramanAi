# PRAMAN.AI 🌍

**Policy-Ready Analytics for Migration & Adaptation Needs**

> A Causal AI System for predicting and analyzing climate shock-driven population displacement.


## 🚀 Overview

**PRAMAN AI** is a cutting-edge decision support system designed for policymakers, humanitarian agencies, and researchers. It leverages **Causal AI** to disentangle the complex web of factors driving climate-induced migration—separating direct climate impacts (like droughts) from economic mediators (inflation) and contextual factors (conflict).

Unlike traditional correlation-based models, PRAMAN AI enables **counterfactual analysis** ("What if rainfall drops by 20%?"), providing actionable intelligence for proactive intervention.

## ✨ Key Features

### 🗺️ Interactive Risk Map
- **Real-time Visualization**: dynamic heatmaps of displacement risk across regions.
- **Drill-down Analytics**: Click on any region (e.g., Ethiopia, Sudan) to view detailed risk profiles.
- **Geospatial Intelligence**: Powered by Leaflet for precise, interactive mapping.

### 📊 Causal Attribution Engine
- **Factor Breakdown**: Quantifies the contribution of **Climate Stress**, **Economic Mediators**, and **Contextual Factors** to displacement.
- **Dynamic Pathways**: Identifies active causal chains (e.g., *Drought → Crop Failure → Food Prices → Displacement*).
- **Transparency**: Clear visualization of model confidence and data sources.

### 🧪 Scenario Simulation
- **"What-If" Analysis**: adjust sliders for Rainfall, Temperature, and Conflict to simulate future scenarios.
- **Impact Prediction**: Instantly see how policy interventions or climate shocks would alter displacement figures.
- **Strategic Planning**: Test adaptation strategies before implementation.

### ⚡ Quick Risk Assessment
- **Instant Estimates**: Rapidly assess risk for specific countries based on key parameters (Daily Rainfall, Wind Speed).
- **Actionable Output**: Immediate risk index and displacement predictions.

### 🛡️ Admin & RBAC
- **Role-Based Access**: Secure dashboards for Admins, Analysts, and Viewers.
- **User Management**: Comprehensive admin tools for managing user access and permissions.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Architecture**: React 19, Tailwind CSS v4
- **Visualization**: Recharts (Charts), React-Leaflet (Maps)
- **State Management**: React Context API

### Backend & Data
- **API**: Python (FastAPI/Flask integration)
- **Database**: MongoDB (via Mongoose)
- **Auth**: JWT & JOSE (Stateless authentication)
- **AI/ML**: Structural Causal Models (Python core)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/praman-ai.git
   cd praman-ai
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
├── app/                  # Next.js App Router
│   ├── admin/            # Admin dashboard routes
│   ├── api/              # API routes (Next.js serverless)
│   ├── dashboard/        # Main user dashboard (Map, Scenarios, Attribution)
│   ├── login/            # Authentication pages
│   └── layout.js         # Root layout
├── backend/              # Python AI Core
│   ├── app/              # Python application logic
│   └── requirements.txt  # Python dependencies
├── components/           # Reusable UI Components
│   ├── InteractiveRiskMap.js
│   ├── AttributionBreakdown.js
│   └── ...
├── lib/                  # Utilities and Context
│   ├── DataContext.js    # Global state
│   └── ...
└── models/               # Mongoose Schemas (User, etc.)
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**PRAMAN AI** — *Predict. Prepare. Protect.*
