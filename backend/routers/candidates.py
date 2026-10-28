import json
import uuid
import random
from typing import List
from fastapi import APIRouter, HTTPException
from database.connection import get_db
from models.schemas import CandidateCreate, CandidateResponse
from services.normalization import normalize_skills

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

@router.post("", response_model=CandidateResponse)
def create_candidate(cand_in: CandidateCreate):
    cand_id = f"cand-{uuid.uuid4().hex[:8]}"
    code_num = random.randint(1000, 9999)
    candidate_code = cand_in.candidate_code or f"CAN-{code_num}"
    norm_skills = normalize_skills(cand_in.skills)

    # Compute completeness if not set
    completeness = cand_in.completeness_percentage or 80
    if len(norm_skills) >= 4 and cand_in.projects and cand_in.education:
        completeness = 100

    proj_json = json.dumps([p.model_dump() if hasattr(p, "model_dump") else p for p in (cand_in.projects or [])])
    cert_json = json.dumps(cand_in.certifications or [])

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO candidates 
            (id, candidate_code, full_name, email, phone, location, education, degree, graduation_year, experience_years, current_role, skills, projects, certifications, completeness_percentage, avatar_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            cand_id, candidate_code, cand_in.full_name, cand_in.email, cand_in.phone,
            cand_in.location, cand_in.education, cand_in.degree, cand_in.graduation_year,
            cand_in.experience_years, cand_in.current_role,
            json.dumps(norm_skills), proj_json, cert_json, completeness, cand_in.avatar_url
        ))

        cursor.execute("SELECT * FROM candidates WHERE id = ?;", (cand_id,))
        row = cursor.fetchone()
        return CandidateResponse(
            id=row["id"],
            candidate_code=row["candidate_code"],
            full_name=row["full_name"],
            email=row["email"],
            phone=row["phone"],
            location=row["location"],
            education=row["education"],
            degree=row["degree"],
            graduation_year=row["graduation_year"],
            experience_years=row["experience_years"],
            current_role=row["current_role"],
            skills=json.loads(row["skills"]),
            projects=json.loads(row["projects"] or "[]"),
            certifications=json.loads(row["certifications"] or "[]"),
            completeness_percentage=row["completeness_percentage"],
            avatar_url=row["avatar_url"],
            created_at=row["created_at"]
        )

@router.get("", response_model=List[CandidateResponse])
def list_candidates():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM candidates ORDER BY created_at ASC;")
        rows = cursor.fetchall()
        return [
            CandidateResponse(
                id=row["id"],
                candidate_code=row["candidate_code"],
                full_name=row["full_name"],
                email=row["email"],
                phone=row["phone"],
                location=row["location"],
                education=row["education"],
                degree=row["degree"],
                graduation_year=row["graduation_year"],
                experience_years=row["experience_years"],
                current_role=row["current_role"],
                skills=json.loads(row["skills"]),
                projects=json.loads(row["projects"] or "[]"),
                certifications=json.loads(row["certifications"] or "[]"),
                completeness_percentage=row["completeness_percentage"],
                avatar_url=row["avatar_url"],
                created_at=row["created_at"]
            )
            for row in rows
        ]

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: str):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM candidates WHERE id = ? OR candidate_code = ?;", (candidate_id, candidate_id))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Candidate with ID '{candidate_id}' not found.")
        return CandidateResponse(
            id=row["id"],
            candidate_code=row["candidate_code"],
            full_name=row["full_name"],
            email=row["email"],
            phone=row["phone"],
            location=row["location"],
            education=row["education"],
            degree=row["degree"],
            graduation_year=row["graduation_year"],
            experience_years=row["experience_years"],
            current_role=row["current_role"],
            skills=json.loads(row["skills"]),
            projects=json.loads(row["projects"] or "[]"),
            certifications=json.loads(row["certifications"] or "[]"),
            completeness_percentage=row["completeness_percentage"],
            avatar_url=row["avatar_url"],
            created_at=row["created_at"]
        )
