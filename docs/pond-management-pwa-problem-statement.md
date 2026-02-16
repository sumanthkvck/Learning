# Problem Statement: Pond Management Progressive Web App for Fish Farming

## Name
**Pond management progressive web app for fish farming**

## Background
Small and medium fish farmers across **Asia, Latin America, and Africa** often manage production records manually (paper notebooks, messaging apps, or spreadsheets). This creates gaps in visibility, delayed decisions, and inconsistent farm performance—especially when farmers operate mixed systems such as **pond-based** and **cage-based** aquaculture.

## Core Problem
Farmers and farm managers lack an affordable, mobile-first, low-connectivity digital tool that helps them monitor, plan, and improve daily fish farm operations across both pond and cage farming models.

## Target Users
- Small and mid-size fish farmers
- Farm supervisors managing multiple sites
- Cluster/cooperative coordinators and extension officers

## Geographic Focus
- **Asia** (e.g., Indonesia, Philippines, Vietnam, India)
- **Latin America** (e.g., Brazil, Colombia, Ecuador)
- **Africa** (e.g., Egypt, Ghana, Kenya, Nigeria)

## Species Focus
Initial support should include species commonly farmed in these regions:
- **Tilapia**
- **Sea bass**
- Optional next wave: catfish, pangasius, carp, shrimp, and region-specific native species where relevant

## Farming System Coverage
The app must support workflows specific to:
1. **Pond-based farming** (earthen, lined, concrete ponds)
2. **Cage-based farming** (reservoir, lake, river, nearshore systems)

## Key Operational Challenges to Address
1. **Fragmented records** for stocking, mortality, feeding, and treatments
2. **Weak performance tracking** (growth rate, FCR, survival, biomass)
3. **Inconsistent water quality monitoring** and poor response timing
4. **Feed cost pressure** and limited forecasting
5. **Unstructured harvest planning** and market readiness uncertainty
6. **Poor offline capability** in low-connectivity rural areas

## Product Goal
Build a **Progressive Web App (PWA)** that enables fish farmers to run core farm operations from low-cost smartphones, with offline-first behavior and simple analytics that improve productivity, survival, and profitability.

## Scope of the Initial Problem Definition (MVP)
The PWA should enable farmers to:
- Register farm sites, units, and production cycles for ponds and cages
- Track species, stocking date, initial count/weight, and source
- Log daily feed and estimate feed conversion performance
- Record mortality and auto-calculate survival
- Capture key water parameters (temperature, DO, pH, salinity where needed)
- Monitor growth sampling and biomass projection
- Receive basic alerts for out-of-range water values and feed anomalies
- Generate cycle-level summaries for harvest readiness and cost/yield visibility

## Future-Ready Extension Areas (Post-MVP)
To ensure flexibility for future features, the product should be designed to support modular add-ons such as:
- **Image-based fish fry counting** from smartphone photos/videos
- **Image-based disease analysis** (lesions, fin damage, discoloration, behavior anomalies)
- Sensor/device integrations (DO meters, auto-feeders, IoT gateways)
- Cooperative dashboards and benchmark analytics across farms
- Credit/insurance readiness reports based on farm performance history

## Extensibility Requirements
The architecture should be built with long-term flexibility:
- Use a **modular domain model** (Farm, Unit, Cycle, Stocking, Feed, WaterQuality, Health, Harvest)
- Maintain a **versioned API contract** to avoid breaking older app clients
- Add a **feature-flag mechanism** to enable premium or pilot features by region
- Support **asynchronous job processing** for ML/image tasks that take longer than normal requests
- Store images/media in object storage with metadata linked to cycle events
- Keep analytics and ML services optional so core record-keeping always works offline

## Constraints
- Must run well on entry-level Android devices
- Must work reliably with intermittent or no internet (store-and-sync model)
- Must minimize data-entry complexity for first-time digital users
- Must support local units, multiple languages, and practical farm terminology
- Must remain usable even when advanced AI/ML services are unavailable

## Recommended Tech Stack (Based on Your Background: C, Java, Python, Databases)
A practical stack that is easy to build and scale:

### Frontend (PWA)
- **React + TypeScript + Vite**
- **Material UI** (or Tailwind) for fast UI delivery
- **PWA support** via service workers and installable app manifest
- **IndexedDB** for offline local storage (with sync queue)

### Backend API
- **Java (Spring Boot)** for core transactional APIs
  - Good fit with your Java knowledge
  - Strong ecosystem for auth, validation, and enterprise-style scaling

### Data & Storage
- **PostgreSQL** for relational production data (farms, cycles, feed, mortality, costs)
- **Redis** for caching/session/rate limiting and quick alert computations
- **S3-compatible object storage** for images (fry counting/disease analysis inputs)

### AI/ML Services (Optional, add later)
- **Python FastAPI microservice** for computer vision endpoints
  - `/fry-count` for count estimation
  - `/disease-screen` for preliminary disease risk scoring
- Model stack can start with PyTorch/OpenCV and evolve later

### Messaging & Background Jobs
- **RabbitMQ** (or Kafka later) for async tasks between Java API and Python ML services
- **Worker jobs** for image processing and report generation

### Auth & Security
- JWT-based auth with refresh tokens
- Role-based access (farmer, supervisor, advisor, admin)
- Audit logs for cycle edits and treatment events

### DevOps / Deployment
- Containerized services using Docker
- Start simple on one cloud VM; move to Kubernetes only after growth
- Observability: Prometheus + Grafana + centralized logs

## Suggested Implementation Phases
1. **Phase 1 (MVP):** offline-first records, core KPIs, alerts, cycle summaries
2. **Phase 2:** multi-farm dashboards, cooperative benchmarking, richer economics
3. **Phase 3:** image-based fry counting and disease analysis modules
4. **Phase 4:** sensor/IoT integrations and advanced forecasting

## Success Criteria
- Faster and more consistent daily record keeping
- Improved survival rate and feed efficiency trends
- Better planning confidence for harvest timing and sales
- Higher adoption in mixed pond + cage operations across target regions
- Clean expansion path for ML-based features without re-architecting core workflows
