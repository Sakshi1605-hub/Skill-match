import json
import uuid
from typing import List
from fastapi import APIRouter, HTTPException, Depends
from database.connection import get_db
from models.schemas import JobCreate, JobResponse, JDAnalyzeRequest, JDAnalyzeResponse
from services.jd_analyzer import analyze_job_description
from services.normalization import normalize_skills

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.post("", response_model=JobResponse)
def create_job(job_in: JobCreate):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    req_skills = normalize_skills(job_in.required_skills)
    pref_skills = normalize_skills(job_in.preferred_skills)

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO jobs (id, title, department, company, location, experience_level, min_years_experience, required_skills, preferred_skills, responsibilities, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            job_id, job_in.title, job_in.department, job_in.company, job_in.location,
            job_in.experience_level, job_in.min_years_experience,
            json.dumps(req_skills), json.dumps(pref_skills),
            json.dumps(job_in.responsibilities or []), job_in.description or ""
        ))
        
        cursor.execute("SELECT * FROM jobs WHERE id = ?;", (job_id,))
        row = cursor.fetchone()
        return JobResponse(
            id=row["id"],
            title=row["title"],
            department=row["department"],
            company=row["company"],
            location=row["location"],
            experience_level=row["experience_level"],
            min_years_experience=row["min_years_experience"],
            required_skills=json.loads(row["required_skills"]),
            preferred_skills=json.loads(row["preferred_skills"]),
            responsibilities=json.loads(row["responsibilities"] or "[]"),
            description=row["description"],
            created_at=row["created_at"]
        )

@router.get("", response_model=List[JobResponse])
def list_jobs():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC;")
        rows = cursor.fetchall()
        return [
            JobResponse(
                id=row["id"],
                title=row["title"],
                department=row["department"],
                company=row["company"],
                location=row["location"],
                experience_level=row["experience_level"],
                min_years_experience=row["min_years_experience"],
                required_skills=json.loads(row["required_skills"]),
                preferred_skills=json.loads(row["preferred_skills"]),
                responsibilities=json.loads(row["responsibilities"] or "[]"),
                description=row["description"],
                created_at=row["created_at"]
            )
            for row in rows
        ]

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM jobs WHERE id = ?;", (job_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Job with ID '{job_id}' not found.")
        return JobResponse(
            id=row["id"],
            title=row["title"],
            department=row["department"],
            company=row["company"],
            location=row["location"],
            experience_level=row["experience_level"],
            min_years_experience=row["min_years_experience"],
            required_skills=json.loads(row["required_skills"]),
            preferred_skills=json.loads(row["preferred_skills"]),
            responsibilities=json.loads(row["responsibilities"] or "[]"),
            description=row["description"],
            created_at=row["created_at"]
        )

@router.post("/analyze", response_model=JDAnalyzeResponse)
def analyze_jd(req: JDAnalyzeRequest):
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")
    parsed = analyze_job_description(req.raw_text)
    return JDAnalyzeResponse(**parsed)
