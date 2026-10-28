import os
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import CORS_ORIGINS, UPLOADS_DIR
from database.schema import init_db
from database.connection import get_db
from data.seed_data import seed_database
from services.scoring import calculate_weighted_score, build_explainability_matrix
from routers import (
    jobs_router,
    candidates_router,
    resumes_router,
    matching_router,
    recommendations_router,
    talent_check_router,
    dashboard_router
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()
    # Seed initial sample data
    seed_database()
    
    # Pre-populate sample match records so dashboard table has entries immediately
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM match_results;")
        if cursor.fetchone()[0] == 0:
            cursor.execute("SELECT * FROM candidates WHERE id = 'cand-ananya-sharma';")
            ananya = cursor.fetchone()
            cursor.execute("SELECT * FROM jobs WHERE id = 'job-python-dev-01';")
            job_py = cursor.fetchone()

            if ananya and job_py:
                cand_data = {
                    "id": ananya["id"],
                    "candidate_code": ananya["candidate_code"],
                    "full_name": ananya["full_name"],
                    "skills": json.loads(ananya["skills"]),
                    "projects": json.loads(ananya["projects"] or "[]"),
                    "education": ananya["education"],
                    "degree": ananya["degree"]
                }
                req_skills = json.loads(job_py["required_skills"])
                pref_skills = json.loads(job_py["preferred_skills"])

                score_res = calculate_weighted_score(
                    required_skills=req_skills,
                    preferred_skills=pref_skills,
                    candidate_skills=cand_data["skills"],
                    custom_required_weight=0.70,
                    custom_preferred_weight=0.30
                )
                matrix = build_explainability_matrix(
                    required_skills=req_skills,
                    preferred_skills=pref_skills,
                    candidate_data=cand_data,
                    scoring_result=score_res
                )
                cursor.execute("""
                    INSERT INTO match_results 
                    (id, candidate_id, job_id, overall_score, required_score, preferred_score, required_weight, preferred_weight, matched_skills, missing_skills, evidence_map, fit_tier, explainability_breakdown)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    "mat-ananya-python-dev", ananya["id"], job_py["id"],
                    score_res["final_score"], score_res["required_match_percentage"],
                    score_res["preferred_match_percentage"], 0.70, 0.30,
                    json.dumps(score_res["all_matched"]), json.dumps(score_res["all_missing"]),
                    json.dumps({m["skill_name"]: m["evidence"] for m in matrix}),
                    score_res["fit_tier"], "{}"
                ))

    yield

app = FastAPI(
    title="RADIX Talent Match — SkillSight AI Platform API",
    description="Deterministic Semantic Skill Matching, Explainable AI Scoring, and Enterprise Telemetry.",
    version="2.4.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include Routers
app.include_router(jobs_router)
app.include_router(candidates_router)
app.include_router(resumes_router)
app.include_router(matching_router)
app.include_router(recommendations_router)
app.include_router(talent_check_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "platform": "RADIX Talent Match",
        "version": "2.4.0",
        "engine": "SkillSight AI",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
