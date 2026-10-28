from database.connection import get_db

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    company TEXT DEFAULT 'Google',
    location TEXT DEFAULT 'Mountain View / Hybrid',
    experience_level TEXT DEFAULT 'Mid-Level',
    min_years_experience REAL DEFAULT 0.0,
    required_skills TEXT NOT NULL, -- JSON array
    preferred_skills TEXT NOT NULL, -- JSON array
    responsibilities TEXT, -- JSON array
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
    id TEXT PRIMARY KEY,
    candidate_code TEXT UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    location TEXT,
    education TEXT,
    degree TEXT,
    graduation_year TEXT,
    experience_years REAL DEFAULT 0.0,
    current_role TEXT,
    skills TEXT NOT NULL, -- JSON array
    projects TEXT, -- JSON array
    certifications TEXT, -- JSON array
    completeness_percentage INTEGER DEFAULT 100,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    candidate_id TEXT,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    raw_text TEXT,
    parsed_data TEXT, -- JSON object
    status TEXT DEFAULT 'PROCESSED', -- 'PROCESSED', 'FAILED', 'PENDING'
    error_message TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS match_results (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    job_id TEXT NOT NULL,
    overall_score REAL NOT NULL,
    required_score REAL NOT NULL,
    preferred_score REAL NOT NULL,
    required_weight REAL DEFAULT 0.70,
    preferred_weight REAL DEFAULT 0.30,
    matched_skills TEXT NOT NULL, -- JSON array
    missing_skills TEXT NOT NULL, -- JSON array
    evidence_map TEXT NOT NULL, -- JSON object {skill: evidence}
    fit_tier TEXT NOT NULL,
    explainability_breakdown TEXT NOT NULL, -- JSON object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_recommendations (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    priority TEXT NOT NULL, -- 'HIGH PRIORITY', 'MEDIUM PRIORITY', 'LOW'
    duration_weeks TEXT NOT NULL,
    description TEXT NOT NULL,
    resources TEXT NOT NULL, -- JSON array of {title, type, link}
    score_delta REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_match_results_candidate ON match_results(candidate_id);
CREATE INDEX IF NOT EXISTS idx_match_results_job ON match_results(job_id);
CREATE INDEX IF NOT EXISTS idx_learning_candidate ON learning_recommendations(candidate_id);
"""

def init_db():
    """Initializes tables and indexes."""
    with get_db() as conn:
        conn.executescript(SCHEMA_SQL)
