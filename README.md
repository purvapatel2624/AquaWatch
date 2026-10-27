# 🌊 AquaWatch — Marine & River Plastic Pollution Monitoring Website

> **Empowering researchers, students, environmental organizations, and coastal communities with verifiable data on aquatic plastic pollution.**

[![React 19](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

**AquaWatch** is an open environmental science web platform that tracks, visualizes, and analyzes plastic pollution across global marine environments, coastlines, estuaries, and river systems. 

Unlike platforms that present artificial or simulated "live sensor" readings without proof, **AquaWatch champions absolute data integrity**:
- Every observation carries an explicit **provenance badge** (*Agency Verified*, *Peer-Reviewed Research*, *Historical NGO Baseline*, or *Citizen Report*).
- An objective **0–100 Data Confidence Index** scores observations based on source authority, temporal freshness, and methodology rigor.
- An **integrated Grounded AI Assistant** answers environmental questions strictly using verifiable dataset metrics, preventing hallucinations.

---

## ✨ Core Features

### 1. 🗺️ Interactive Pollution Map
- **Global Visualization**: Powered by Leaflet and CartoDB Voyager tiles.
- **Severity-Coded Markers**: Color-coded markers for `Low` (Emerald), `Moderate` (Amber), `High` (Orange), and `Critical` (Rose with glowing pulse animation).
- **Multi-Parameter Filtering**: Search by location name, filter by country, waterway type (*River*, *Beach*, *Coastline*, *Estuary*, *Ocean Gyre*), severity, or toggle **Hotspots Only**.
- **Location Dossier Modal**: Click any point to view comprehensive coordinates, measured values, measurement units, sampling methodologies, and 5-year historical trends.

### 2. 📊 Environmental Analytics Dashboard
- **Key Performance Indicators (KPIs)**: Total analyzed sites, critical hotspots, stress ratios, and mean confidence scores.
- **Debris Composition Breakdown**: Recharts-powered donut chart illustrating the distribution of consumer packaging, PET bottles & caps, plastic bags, derelict fishing gear (ghost nets), and microplastics (<5mm).
- **Standardized Hotspot Ranking**: Horizontal bar chart identifying high-stress waterways (e.g., Pasig River, Citarum River, Great Pacific Garbage Patch).
- **Longitudinal Trend Analysis**: Interactive multi-site line chart tracking 2019–2023 observation shifts.
- **Side-by-Side Location Comparator**: Select two locations to compare abundance, primary debris type, and comparative category share.

### 3. 🤖 AI-Powered Grounded Environmental Insights
- **Zero-Fabrication Guard**: The AI reasoning engine synthesizes findings strictly using active visible data points.
- **Instant Local Engine**: Provides structured environmental summaries, hotspot prioritizations, and science-backed mitigation actions without requiring external API keys.
- **Optional Gemini 2.0 Flash Integration**: Connect your Google Gemini API key for free-form conversational queries with strict grounding instructions.
- **Transparent Caveats**: Explicitly articulates scientific uncertainties, methodology discrepancies, and geographic data gaps.

### 4. 👥 Citizen Science & Community Reporting
- **Geo-Referenced Submissions**: Submit reports with GPS coordinates (auto-detect or manual), date, time, plastic type, and estimated item counts.
- **Photo Evidence Preview**: In-browser image upload with client-side preview.
- **Anti-Spam & Privacy Safeguards**: Explicit user confirmations and email anonymization.
- **Moderator Review Queue**: View pending community submissions with a one-click review workflow to upgrade observation rigor.

### 5. 📚 Educational Section: River-to-Sea Journey
- **4-Stage Transport Infographic**: Trace plastics from inland towns through stormwater runoff, river tributaries, coastal mangrove estuaries, and open-ocean gyres.
- **Ecological Impact Analysis**: Detailed breakdowns of entanglement, microplastic ingestion, chemical leaching, and invasive species transport.
- **Actionable Solutions**: Practical steps for students, municipalities, and corporations (e.g., river interception booms, Extended Producer Responsibility, deposit-return schemes).

### 6. 🛡️ Data Sources & Transparency Matrix
- Detailed documentation of authentic baselines:
  - **NOAA Marine Debris Monitoring & Assessment Project (MDMAP)**
  - **UNEP Global Partnership on Marine Litter (GPML)**
  - **Ocean Conservancy International Coastal Cleanup (ICC)**
  - **Lebreton et al. River Plastic Inputs (Nature Communications)**
- Open Data Exports: One-click export of visible data to **CSV** and **GeoJSON**.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React 19 & TypeScript | Component architecture and type-safe state management |
| **Build Tool** | Vite 8 | Ultra-fast HMR and bundle optimization |
| **Styling** | Tailwind CSS v3.4 | Ocean and marine color system, glassmorphism, responsive utilities |
| **Mapping** | Leaflet & OpenStreetMap | High-performance interactive geospatial mapping |
| **Visualizations**| Recharts | Composable, responsive SVG analytics charts |
| **Icons** | Lucide React | Modern, consistent environmental iconography |
| **Celebration**| Canvas Confetti | Gamified community reporting feedback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.x or v22.x LTS recommended)
- npm (v10.x or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/aquawatch.git
cd aquawatch

# Install dependencies
npm install --legacy-peer-deps

# Start the local development server
npm run dev
```

The application will be live at:
```
http://localhost:5173/
```

### Production Build
```bash
npm run build
```
The compiled, production-ready static assets will be located in the `dist/` directory.

---

## 📁 Project Structure (First-Year CSE Friendly)

```
SITE/
├── public/
│   └── favicon.svg              # Brand droplet and wave SVG favicon
├── src/
│   ├── types/
│   │   └── pollution.ts         # TypeScript interfaces (Observations, Filters, Reports)
│   ├── data/
│   │   ├── authenticDatasets.ts # Authentic baseline data from NOAA, UNEP & field studies
│   │   └── methodologyInfo.ts   # Data source metadata and licensing info
│   ├── utils/
│   │   ├── confidenceScore.ts   # Scientific 0-100 reliability scoring formula
│   │   ├── exportUtils.ts       # CSV and GeoJSON dataset generators
│   │   └── aiReasoning.ts       # Grounded environmental reasoning engine + Gemini API
│   ├── context/
│   │   └── PollutionContext.tsx # Centralized state for filters, locations, and reports
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx       # Brand header, navigation, and export dropdown
│   │   │   ├── Footer.tsx       # Scientific disclaimers and pitch deck trigger
│   │   │   ├── Badge.tsx        # Severity, provenance, and waterbody badges
│   │   │   └── HackathonModal.tsx # 5-slide hackathon presentation pitch deck
│   │   ├── map/
│   │   │   ├── PollutionMap.tsx # Leaflet map with pulsing severity markers
│   │   │   └── LocationDetailModal.tsx # Scientific dossier with trend chart
│   │   ├── dashboard/
│   │   │   └── PollutionDashboard.tsx # KPIs, category charts, and comparator
│   │   ├── insights/
│   │   │   └── AIInsightsPanel.tsx # Grounded AI Q&A and reduction actions
│   │   ├── report/
│   │   │   └── CommunityReportModal.tsx # Citizen reporting & moderation queue
│   │   ├── educational/
│   │   │   └── LearnSection.tsx # River-to-sea transport and wildlife impacts
│   │   └── sources/
│   │       └── MethodologySection.tsx # Transparency page and scoring matrix
│   ├── App.tsx                  # Root layout and tab routing
│   ├── index.css                # Tailwind directives and custom animation styles
│   └── main.tsx                 # React entrypoint
├── tailwind.config.js           # Custom ocean/marine color palette
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and build scripts
```

---

## 🏆 Hackathon Presentation Summary

### 1. The Problem
Aquatic plastic monitoring is hindered by fragmented scientific silos, artificial "live" data claims, and public neglect of inland river corridors where over 80% of ocean debris originates.

### 2. The Solution
AquaWatch combines verified historical baselines (NOAA, UNEP, Nature studies) with an interactive geospatial map, a transparent 0–100 Data Confidence Index, an anti-hallucination AI assistant, and a crowdsourced citizen science verification pipeline.

### 3. Limitations & Ethics
AquaWatch is an environmental monitoring and awareness platform, **not an automated IoT real-time sensor network**. We transparently disclose data gaps in the Global South, metric discrepancies between shoreline transects and river mass models, and temporal delays.

### 4. Future Roadmap
- **Phase 1**: Satellite remote sensing integration (ESA Sentinel-2 plastic anomaly index).
- **Phase 2**: Municipal sanitation portal with predictive flood-surge trash warnings.
- **Phase 3**: Global university peer-review network via Supabase cloud storage.

---

## 📜 License
This project is open-source under the [MIT License](LICENSE). Authentic baseline datasets remain the property of their respective originating bodies (NOAA, UNEP, Ocean Conservancy, Nature Portfolio).
