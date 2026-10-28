from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# --- Job Schemas ---
class JobBase(BaseModel):
    title: str
    department: Optional[str] = "Engineering"
    company: Optional[str] = "Google"
    location: Optional[str] = "Mountain View / Hybrid"
    experience_level: Optional[str] = "Mid-Level"
    min_years_experience: Optional[float] = 0.0
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    responsibilities: Optional[List[str]] = []
    description: Optional[str] = ""

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    created_at: Optional[str] = None

class JDAnalyzeRequest(BaseModel):
    raw_text: str

class JDAnalyzeResponse(BaseModel):
    title: str
    department: str
    company: str
    location: str
    experience_level: str
    min_years_experience: float
    required_skills: List[str]
    preferred_skills: List[str]
    responsibilities: List[str]
    extracted_summary: str

# --- Candidate Schemas ---
class ProjectItem(BaseModel):
    title: str
    description: str
    skills_used: Optional[List[str]] = []

class CandidateBase(BaseModel):
    candidate_code: Optional[str] = None
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = "San Francisco, CA"
    education: Optional[str] = "B.Tech Computer Science"
    degree: Optional[str] = "Bachelor of Science"
    graduation_year: Optional[str] = "2024"
    experience_years: Optional[float] = 0.0
    current_role: Optional[str] = "Software Engineer"
    skills: List[str] = []
    projects: Optional[List[ProjectItem]] = []
    certifications: Optional[List[str]] = []
    completeness_percentage: Optional[int] = 100
    avatar_url: Optional[str] = None

class CandidateCreate(CandidateBase):
    pass

class CandidateResponse(CandidateBase):
    id: str
    created_at: Optional[str] = None

# --- Skill Comparison & Match Schemas ---
class SkillComparisonRow(BaseModel):
    skill_name: str
    classification: str # "Required" or "Preferred"
    engine_weight_percentage: float # e.g. 17.50
    engine_weight_display: str # "17.50%"
    status: str # "MATCHED", "MISSING", "NOT DETECTED"
    evidence: str
    gap_severity: str # "None (Cleared)", "Critical · High", "Medium", "Low"

class MathematicalExplainer(BaseModel):
    formula_display: str # "(Req % × 0.70) + (Pref % × 0.30) = Final"
    required_weight: float # 0.70
    preferred_weight: float # 0.30
    required_match_percentage: float # 75.0
    preferred_match_percentage: float # 25.0
    required_weighted_score: float # 52.5
    preferred_weighted_score: float # 7.5
    final_score: float # 60.0
    confidence_margin: float = 99.4

class MatchRequest(BaseModel):
    candidate_id: str
    job_id: str
    required_weight: Optional[float] = 0.70
    preferred_weight: Optional[float] = 0.30

class MatchResultResponse(BaseModel):
    id: Optional[str] = None
    candidate_id: str
    job_id: str
    candidate_name: str
    candidate_code: str
    job_title: str
    company: str
    overall_score: float
    required_score: float
    preferred_score: float
    required_hits_count: int
    required_total_count: int
    preferred_hits_count: int
    preferred_total_count: int
    fit_tier: str # "Tier 1 Top Candidate", "Tier 2 Progressive Candidate", etc.
    fit_level: str # "HIGH FIT", "MODERATE FIT", "LOWER ALIGNMENT"
    matched_skills: List[str]
    missing_skills: List[str]
    matrix: List[SkillComparisonRow]
    explainer: MathematicalExplainer
    summary_persona: Dict[str, Any]
    created_at: Optional[str] = None

# --- Simulation Schemas ---
class SimulateRequest(BaseModel):
    candidate_id: str
    job_id: str
    simulated_skills: List[str] # skills candidate hypothetically acquires

class SimulateResponse(BaseModel):
    candidate_id: str
    job_id: str
    baseline_score: float
    simulated_score: float
    score_delta: float
    tier_label: str
    narrative: str
    acquired_skills: List[str]
    projected_matrix: List[SkillComparisonRow]

# --- Recommendations & Roadmap Schemas ---
class CuratedResource(BaseModel):
    title: str
    type: str # "course", "lab", "book", "docs"
    link: Optional[str] = None

class LearningRoadmapItem(BaseModel):
    skill_name: str
    priority: str # "HIGH PRIORITY", "MEDIUM PRIORITY"
    duration_weeks: str # "4-6 weeks"
    description: str
    score_delta: float
    score_delta_display: str # "+17.5%"
    curated_materials: List[CuratedResource]

class BestFitJobOpening(BaseModel):
    job_id: str
    title: str
    company: str
    department: str
    match_score: float
    fit_label: str # "HIGH FIT", "MODERATE-HIGH", "LOWER ALIGNMENT"
    rationale: str
    matched_skills: List[str]
    missing_skills: List[str]

class CandidateRecommendationsResponse(BaseModel):
    candidate_id: str
    candidate_name: str
    target_job_id: Optional[str] = None
    target_job_title: Optional[str] = None
    estimated_ramp: str
    learning_roadmap: List[LearningRoadmapItem]
    best_fit_openings: List[BestFitJobOpening]

# --- Talent Check Schemas ---
class CheckItem(BaseModel):
    criterion: str
    status: str # "PASS", "WARNING", "FAIL"
    explanation: str

class TalentCheckRequest(BaseModel):
    candidate_id: str
    job_id: str

class TalentCheckResponse(BaseModel):
    candidate_id: str
    job_id: str
    is_eligible: bool
    overall_verdict: str
    checks: List[CheckItem]

# --- Resume Upload Schemas ---
class ResumeUploadResponse(BaseModel):
    resume_id: str
    filename: str
    file_type: str
    parsed_candidate_id: Optional[str] = None
    candidate_name: Optional[str] = None
    detected_skills: List[str] = []
    status: str
    error_message: Optional[str] = None

# --- Dashboard & Health Schemas ---
class DashboardStatsResponse(BaseModel):
    total_jds_analyzed: int
    resumes_processed: int
    candidates_evaluated: int
    high_fit_shortlists: int
    active_model_version: str = "SkillSight Model v4.2 Active"
    system_latency_ms: int = 38
    tech_stacks: List[Dict[str, Any]]
    recent_matches: List[Dict[str, Any]]
    recent_activities: List[Dict[str, Any]]
    critical_skills: List[Dict[str, Any]]

class HealthResponse(BaseModel):
    status: str
    version: str = "2.4.0"
    engine: str = "SkillSight AI Deterministic Engine"
