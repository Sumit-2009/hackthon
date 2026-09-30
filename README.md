# 🌱 AgriSmart AI: Precision Agriculture & Crop Advisory Assistant

AgriSmart AI is an enterprise-grade, full-stack precision agriculture and agronomy intelligence platform. It converts farm parcel characteristics, regional micro-climate weather telemetry, soil chemical profiles, and visual plant health assessments into actionable, phased agronomic guidance.

---

## 🚀 Key Modules & Architecture

### 1. Soil & Climate Crop Recommendation Engine
- Analyzes soil Nitrogen (N), Phosphorus (P), Potassium (K) in mg/kg, pH balance, and Organic Carbon percentage.
- **Rule-based & AI Liming/Gypsum Protocols**:
  - Automatically identifies acidic soil ($pH < 5.5$) and prescribes precise agricultural limestone / dolomite ($CaCO_3 / MgCO_3$) dosages.
  - Automatically detects alkaline sodic soil ($pH > 7.8$) and prescribes agricultural gypsum ($CaSO_4 \cdot 2H_2O$) or elemental sulfur.
  - Formulates multi-split nitrogen applications for deficient soil ($N < 150 \text{ ppm}$).

### 2. Phased Phenological Crop Lifecycle Calendar
- Generates 4 localized physiological growth stages:
  1. **Seeding & Stand Establishment**
  2. **Vegetative Tillering & Canopy Architecture**
  3. **Flowering & Reproductive Anthesis**
  4. **Maturation, Grain Hardening & Harvest Window**
- Each stage provides specific:
  - **Irrigation Schedules** (drip pulse cycles vs. flood intervals)
  - **Fertilization Actions** (basal applications, top-dressing splits, foliar micro-nutrients)
  - **Pest Surveillance & Thresholds** (IPM guidelines, sticky trap densities)

### 3. Multimodal Visual Plant Pathology Diagnostician
- Powered by Google Gemini 2.5 Flash Vision (`gemini-2.5-flash`) with client-side HTML Canvas image compression (ensuring $< 10\text{MB}$ payloads).
- Instant triage of fungal lesions, bacterial blights, viral complexes, and insect vector infestations.
- Provides 3 actionable intervention channels:
  - **Synthetic Agrochemical Intervention** (with standard trade active ingredients, e.g. Mancozeb, Azoxystrobin, Chlorpyrifos)
  - **Organic & Bio-IPM Formulations** (Bacillus subtilis, Trichoderma harzianum, cold-pressed Neem extract)
  - **Cultural & Farm Implement Sanitation** (crop rotation, canopy aeration, bio-security quarantine warnings)
- Includes a **1-Click Curated Specimen Library** (Potato Early Blight, Wheat Stripe Rust, Cotton Leaf Curl Begomovirus, and Healthy Maize Foliage Control).

### 4. Market Timing & Commercial Yield Economics
- Estimates projected yields in quintals per acre.
- Calculates input costs per acre vs. gross projected revenue.
- Computes net profit margins and ROI percentages scaled to total field parcel acreage.
- Identifies peak procurement and MSP market timing windows.

### 5. Multi-Parcel Field Management & GIS Telemetry
- Field registration with acreage, soil physics classifications, irrigation setup, and GPS coordinate ingestion.
- Table and responsive grid views.

### 6. Dynamic PDF Report Export
- Print-optimized CSS (`@media print`) and PDF export formatting for agricultural extension officers and farm managers.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, TanStack Query (React Query v5), Wouter, Canvas-Confetti, Google Fonts (*Plus Jakarta Sans*, *Inter*, *JetBrains Mono*).
- **Backend**: Node.js 24 LTS, Express.js (strict JSON mode, 10MB payload limit, request logging).
- **Database & Persistence**: PostgreSQL schema with Drizzle ORM + resilient embedded persistent local data store.
- **AI Orchestration**: Official `@google/genai` SDK targeting `gemini-2.5-pro` for deep agronomy synthesis and `gemini-2.5-flash` for multimodal vision pathology triage.
- **Data Validation**: Strict Zod schemas on all client forms, API request payloads, and AI JSON responses.

---

## 🌐 Running Locally

The dev servers are running:
- **Vite Frontend Dev Server**: [http://localhost:3000](http://localhost:3000)
- **Express API & Production Bundle**: [http://localhost:5000](http://localhost:5000)

### Available NPM Scripts
- `npm run dev`: Runs both Express API and Vite dev servers concurrently.
- `npm run build`: Compiles production client bundle (`dist/`) and type-checks server.
- `npm start`: Starts production Node.js server.
