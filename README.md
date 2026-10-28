# RADIX Talent Match — SkillSight AI Platform v2.4

An enterprise-grade talent intelligence platform converted from **Google Stitch** exported designs into a complete, deterministic, end-to-end full-stack web application.

---

## 🏛️ System Architecture

```
stitch_radix_talent_match_skillsight_ai_platform(stitch)/
├── stitch_radix_talent_match_skillsight_ai_platform/    # Preserved original Stitch exports intact
│   ├── executive_dashboard/                            # HTML + visual design specs
│   ├── radix_enterprise_design_system/                 # DESIGN.md token specifications
│   └── skillsight_ai_workspace/                        # HTML + flagship visual specs
├── backend/                                            # Python FastAPI backend
│   ├── main.py                                         # App entrypoint, CORS, router mounting
│   ├── config.py                                       # Configuration, paths, defaults
│   ├── database/                                       # Modular database layer (SQLite -> Supabase ready)
│   │   ├── connection.py                               # DB connection manager
│   │   └── schema.py                                   # DDL: jobs, candidates, resumes, matches, roadmap
│   ├── models/                                         # Pydantic schemas for requests/responses
│   ├── services/                                       # Isolated deterministic business logic
│   │   ├── normalization.py                            # Alias mapping (JS->JavaScript, ML->Machine Learning, etc.)
│   │   ├── scoring.py                                  # Weighted scoring (70% req, 30% pref, edge cases)
│   │   ├── simulator.py                                # What-if simulator (non-mutating)
│   │   ├── recommendations.py                          # Best-fit jobs ranking & personalized roadmap
│   │   ├── jd_analyzer.py                              # Ingestion of unstructured JD text
│   │   ├── resume_parser.py                            # PDF, DOCX, TXT parser with evidence search
│   │   └── talent_checker.py                           # Explainable qualification & eligibility checks
│   ├── routers/                                        # REST API endpoints
│   ├── data/seed_data.py                               # Sample data (Ananya Sharma, Python Dev, etc.)
│   └── tests/                                          # Automated unit & integration tests (18 tests)
├── frontend/                                           # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── api/client.js                               # API fetch client
│   │   ├── components/layout/                          # Sidebar & Header matching Stitch design
│   │   ├── components/common/                          # ScoreRing SVG gauges, EmptyState, Badges
│   │   └── pages/                                      # Full module implementations
│   │       ├── Dashboard.jsx                           # Executive Dashboard (Stitch design preserved)
│   │       ├── SkillSightAI.jsx                        # Flagship Engine (Weighted scoring, What-If sandbox)
│   │       ├── JDAnalytics.jsx                         # M-01 JD ingestion & extraction
│   │       ├── ResumeParsing.jsx                       # M-02 Multi-format resume parsing
│   │       ├── ProfileBuilder.jsx                      # M-03 Candidate profile builder & completeness
│   │       ├── TalentCheck.jsx                         # M-04 Eligibility & compliance audit
│   │       ├── JobDirectory.jsx                        # Requisitions directory & search
│   │       ├── CandidateComparison.jsx                 # Side-by-side comparative analysis
│   │       └── AnalyticsReports.jsx                    # Intelligence reports & skill demand
├── requirements.txt                                    # Python dependencies
├── package.json                                        # Root scripts & configuration
└── README.md                                           # Comprehensive setup & architecture documentation
```

---

## ⚡ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Geist & JetBrains Mono typography, Material Symbols Outlined.
- **Backend:** Python 3.10+, FastAPI, Pydantic v2, Uvicorn, python-multipart.
- **Document Parsing:** `pypdf`, `python-docx`, raw text tokenizers.
- **Database:** Modular SQLite repository (`radix.db`) with clean abstraction for seamless Supabase migration.
- **Testing:** Pytest, pytest-asyncio, FastAPI TestClient.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (Node 24 tested) and npm

### 2. Backend Setup & Run

Open a terminal in the project directory:

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run backend API server
python -m uvicorn main:app --reload --port 8000
```
- API will be active at: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup & Run

Open a second terminal in the project directory:

```bash
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
- Open your browser at: `http://localhost:5173`

---

## 🧪 Automated Testing

All scoring formulas, normalization dictionaries, and REST endpoints are backed by automated tests:

```bash
cd backend
python -m pytest -v
```

**Verification Results:**
- `test_mandatory_aliases`: Passed (JS -> JavaScript, ML -> Machine Learning, ReactJS -> React, Postgres -> PostgreSQL)
- `test_prompt_sample_scoring_ananya_sharma`: Passed (**Required 75.0% * 0.70 + Preferred 25.0% * 0.30 = Exactly 60.0%**)
- `test_empty_preferred_category`: Passed (Required contributes 100%)
- `test_empty_required_category`: Passed (Preferred contributes 100%)
- `test_perfect_match`: Passed (100.0%)
- `test_zero_match`: Passed (0.0%)
- `test_what_if_simulator`: Passed (Machine Learning acquisition produces +17.5% uplift without mutating candidate profile)
- `test_api_endpoints`: All 8 REST endpoints tested and passed.

---

## 🔬 Core Functionality: SkillSight AI

### 1. Skill Normalization
Alias lookup with fallback title-casing:
- `JS` / `js` ➔ `JavaScript`
- `ML` / `ml` ➔ `Machine Learning`
- `ReactJS` / `react.js` ➔ `React`
- `Postgres` / `postgresql` ➔ `PostgreSQL`
- `TS` ➔ `TypeScript`, `py` ➔ `Python`, `aws` ➔ `AWS`, `k8s` ➔ `Kubernetes`, `git` ➔ `Git`

### 2. Deterministic Weighted Scoring
Zero opaque heuristics. Grounded pure Python arithmetic:
$$\text{Final Score} = (\text{Required Match } \% \times 0.70) + (\text{Preferred Match } \% \times 0.30)$$

*Edge Case Rule:* If either category is empty, the available category contributes 100%.

### 3. Sample Verification: Ananya Sharma vs Python Developer
- **Target Job:** Python Developer
  - **Required (70% Weight):** Python, Java, SQL, Machine Learning
  - **Preferred (30% Weight):** AWS, Docker, Git, Communication Skills
- **Candidate:** Ananya Sharma
  - **Skills:** Python, Java, SQL, JavaScript, HTML, CSS, Git
- **Scoring Results:**
  - Required Match = 3/4 = **75.0%** (Contribution: $75\% \times 0.70 = 52.5\%$)
  - Preferred Match = 1/4 = **25.0%** (Contribution: $25\% \times 0.30 = 7.5\%$)
  - **Final Score = $52.5\% + 7.5\% = \mathbf{60.0\%}$**

### 4. Interactive What-If Simulator Sandbox
- Recalculates projected score in real-time when missing skills are selected.
- Each required skill is worth $70\% / 4 = 17.50\%$.
- Each preferred skill is worth $30\% / 4 = 7.50\%$.
- Toggling **Machine Learning** elevates Ananya's score from **60.0%** to **77.5%** (*Tier 1 Clear Candidate*).
- Candidate record in the database is **never modified** during simulations.

### 5. Explainable Evidence Matrix
Every matched skill displays grounded evidence extracted from the candidate's portfolio:
- **Python:** *"Student Management System using Python and SQL"*
- **Java:** *"Coursework & Object-Oriented Programming labs"*
- **SQL:** *"Student Management System database schema design"*
- **Git:** *"Git version control for open-source project submissions"*
- **Machine Learning (Missing):** *"No project records or academic credits found"* (Gap Severity: *Critical · High*)

### 6. Personalized Learning Roadmap & Alternative Openings
- **High Priority Sprint:** Machine Learning Foundations (4-6 weeks, PyTorch labs, +17.5% delta).
- **Medium Priority Sprint:** AWS Cloud Architecture (2-3 weeks, +7.5% delta).
- **Alternative Job Openings:** Ranks candidate profile across all other saved JDs:
  - Junior Backend Engineer at Meta: **82.0% (HIGH FIT)**
  - Data Analyst Intern at Stripe: **78.0% (MODERATE-HIGH)**
  - Cloud Solutions Associate at AWS: **52.0% (LOWER ALIGNMENT)**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & engine telemetry |
| `GET` | `/api/dashboard/stats` | Aggregated metrics, recent matches, and skills demand |
| `GET` | `/api/jobs` | Retrieve all saved job requisitions |
| `POST` | `/api/jobs` | Save new job requisition with required/preferred skills |
| `POST` | `/api/jobs/analyze` | Ingest raw unstructured JD text and extract competencies |
| `GET` | `/api/candidates` | List all candidate profiles |
| `POST` | `/api/candidates` | Create/update structured candidate profile |
| `POST` | `/api/resumes/upload` | Upload PDF/DOCX/TXT resume and extract profile |
| `POST` | `/api/match` | Deterministic weighted skill match & matrix |
| `POST` | `/api/simulate` | Non-mutating what-if hypothetical score simulation |
| `GET` | `/api/recommendations/{candidate_id}` | Learning roadmap & best-fit alternative job rankings |
| `POST` | `/api/talent-check` | Academic, career tier, and compliance eligibility check |

---

## 🎨 Design System Preservation

This application strictly preserves the Google Stitch design tokens:
- **Palette:** Deep indigo-slate structure (`#131B2E`), Electric Violet primary action (`#4F46E5` / `#6366F1`), Cyan telemetry (`#4CD7F6`), Canvas (`#F8F9FF`).
- **Typography:** Geist UI font for enterprise hierarchy, JetBrains Mono for tabular metrics and telemetry.
- **Visual Artifacts:** Radial dual-arc SVG score rings, micro-badges, and hairline partitions.
