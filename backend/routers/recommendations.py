import json
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from database.connection import get_db
from models.schemas import CandidateRecommendationsResponse, LearningRoadmapItem, BestFitJobOpening
from services.scoring import calculate_weighted_score
from services.recommendations import generate_learning_roadmap, rank_best_fit_jobs

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/{candidate_id}", response_model=CandidateRecommendationsResponse)
def get_candidate_recommendations(
    candidate_id: str,
    job_id: Optional[str] = Query(None, description="Optional target job ID to analyze gaps against")
):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Load candidate
        cursor.execute("SELECT * FROM candidates WHERE id = ? OR candidate_code = ?;", (candidate_id, candidate_id))
        cand_row = cursor.fetchone()
        if not cand_row:
            raise HTTPException(status_code=404, detail=f"Candidate '{candidate_id}' not found.")
        
        cand_skills = json.loads(cand_row["skills"])
        cand_name = cand_row["full_name"]

        # Load all jobs
        cursor.execute("SELECT * FROM jobs ORDER BY created_at DESC;")
        all_jobs_rows = cursor.fetchall()
        all_jobs = [
            {
                "id": r["id"],
                "title": r["title"],
                "company": r["company"],
                "department": r["department"],
                "required_skills": json.loads(r["required_skills"]),
                "preferred_skills": json.loads(r["preferred_skills"])
            }
            for r in all_jobs_rows
        ]

        # Determine target job
        target_job = None
        if job_id:
            target_job = next((j for j in all_jobs if j["id"] == job_id), None)
        if not target_job and all_jobs:
            target_job = all_jobs[0]

        target_job_id = target_job["id"] if target_job else None
        target_job_title = target_job["title"] if target_job else None

        # Calculate gaps against target job
        learning_roadmap = []
        ramp_weeks = "2-4 Weeks"
        if target_job:
            score_data = calculate_weighted_score(
                required_skills=target_job["required_skills"],
                preferred_skills=target_job["preferred_skills"],
                candidate_skills=cand_skills
            )
            learning_roadmap = generate_learning_roadmap(
                missing_required=score_data["missing_required"],
                missing_preferred=score_data["missing_preferred"],
                req_individual_weight=score_data["req_individual_weight"],
                pref_individual_weight=score_data["pref_individual_weight"]
            )
            # Estimate total ramp
            total_missing = len(score_data["all_missing"])
            if total_missing >= 3:
                ramp_weeks = "7-11 Weeks"
            elif total_missing >= 1:
                ramp_weeks = "3-6 Weeks"
            else:
                ramp_weeks = "1-2 Weeks (Fully Qualified)"

        # Rank all other jobs
        best_fit_openings = rank_best_fit_jobs(
            candidate_skills=cand_skills,
            all_jobs=all_jobs,
            exclude_job_id=target_job_id
        )

        return CandidateRecommendationsResponse(
            candidate_id=cand_row["id"],
            candidate_name=cand_name,
            target_job_id=target_job_id,
            target_job_title=target_job_title,
            estimated_ramp=f"Estimated Ramp: {ramp_weeks}",
            learning_roadmap=[LearningRoadmapItem(**r) for r in learning_roadmap],
            best_fit_openings=[BestFitJobOpening(**b) for b in best_fit_openings]
        )
