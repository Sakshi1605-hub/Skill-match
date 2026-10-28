import json
from fastapi import APIRouter, HTTPException
from database.connection import get_db
from models.schemas import TalentCheckRequest, TalentCheckResponse, CheckItem
from services.talent_checker import evaluate_talent_eligibility

router = APIRouter(prefix="/api/talent-check", tags=["Talent Check"])

@router.post("", response_model=TalentCheckResponse)
def run_talent_check(req: TalentCheckRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM candidates WHERE id = ? OR candidate_code = ?;", (req.candidate_id, req.candidate_id))
        cand_row = cursor.fetchone()
        if not cand_row:
            raise HTTPException(status_code=404, detail=f"Candidate '{req.candidate_id}' not found.")
        
        cursor.execute("SELECT * FROM jobs WHERE id = ?;", (req.job_id,))
        job_row = cursor.fetchone()
        if not job_row:
            raise HTTPException(status_code=404, detail=f"Job '{req.job_id}' not found.")

        cand_data = {
            "id": cand_row["id"],
            "candidate_code": cand_row["candidate_code"],
            "full_name": cand_row["full_name"],
            "email": cand_row["email"],
            "experience_years": cand_row["experience_years"],
            "education": cand_row["education"],
            "degree": cand_row["degree"],
            "skills": json.loads(cand_row["skills"]),
            "completeness_percentage": cand_row["completeness_percentage"]
        }

        job_data = {
            "id": job_row["id"],
            "title": job_row["title"],
            "experience_level": job_row["experience_level"],
            "min_years_experience": job_row["min_years_experience"],
            "required_skills": json.loads(job_row["required_skills"]),
            "preferred_skills": json.loads(job_row["preferred_skills"])
        }

        eval_res = evaluate_talent_eligibility(cand_data, job_data)
        return TalentCheckResponse(
            candidate_id=eval_res["candidate_id"],
            job_id=eval_res["job_id"],
            is_eligible=eval_res["is_eligible"],
            overall_verdict=eval_res["overall_verdict"],
            checks=[CheckItem(**c) for c in eval_res["checks"]]
        )
