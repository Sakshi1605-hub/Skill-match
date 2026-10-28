import json
import uuid
from fastapi import APIRouter, HTTPException
from database.connection import get_db
from models.schemas import (
    MatchRequest, MatchResultResponse, SkillComparisonRow,
    MathematicalExplainer, SimulateRequest, SimulateResponse
)
from services.scoring import calculate_weighted_score, build_explainability_matrix
from services.simulator import run_simulation
from services.normalization import normalize_skills

router = APIRouter(prefix="/api", tags=["SkillSight AI"])

@router.post("/match", response_model=MatchResultResponse)
def execute_match(req: MatchRequest):
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Load candidate
        cursor.execute("SELECT * FROM candidates WHERE id = ? OR candidate_code = ?;", (req.candidate_id, req.candidate_id))
        cand_row = cursor.fetchone()
        if not cand_row:
            raise HTTPException(status_code=404, detail=f"Candidate '{req.candidate_id}' not found.")
        
        # Load job
        cursor.execute("SELECT * FROM jobs WHERE id = ?;", (req.job_id,))
        job_row = cursor.fetchone()
        if not job_row:
            raise HTTPException(status_code=404, detail=f"Job '{req.job_id}' not found.")

        cand_data = {
            "id": cand_row["id"],
            "candidate_code": cand_row["candidate_code"],
            "full_name": cand_row["full_name"],
            "skills": json.loads(cand_row["skills"]),
            "projects": json.loads(cand_row["projects"] or "[]"),
            "education": cand_row["education"],
            "degree": cand_row["degree"]
        }

        job_data = {
            "id": job_row["id"],
            "title": job_row["title"],
            "company": job_row["company"],
            "required_skills": json.loads(job_row["required_skills"]),
            "preferred_skills": json.loads(job_row["preferred_skills"])
        }

        # Deterministic scoring
        req_w = req.required_weight if req.required_weight is not None else 0.70
        pref_w = req.preferred_weight if req.preferred_weight is not None else 0.30

        score_res = calculate_weighted_score(
            required_skills=job_data["required_skills"],
            preferred_skills=job_data["preferred_skills"],
            candidate_skills=cand_data["skills"],
            custom_required_weight=req_w,
            custom_preferred_weight=pref_w
        )

        matrix = build_explainability_matrix(
            required_skills=job_data["required_skills"],
            preferred_skills=job_data["preferred_skills"],
            candidate_data=cand_data,
            scoring_result=score_res
        )

        explainer = MathematicalExplainer(
            formula_display=f"(Req % × {score_res['effective_required_weight']:.2f}) + (Pref % × {score_res['effective_preferred_weight']:.2f}) = Final",
            required_weight=score_res["effective_required_weight"],
            preferred_weight=score_res["effective_preferred_weight"],
            required_match_percentage=score_res["required_match_percentage"],
            preferred_match_percentage=score_res["preferred_match_percentage"],
            required_weighted_score=score_res["required_weighted_score"],
            preferred_weighted_score=score_res["preferred_weighted_score"],
            final_score=score_res["final_score"],
            confidence_margin=99.4
        )

        summary_persona = {
            "headline": "High Upskill Potential" if score_res["final_score"] < 75 else "Strong Production Ready Profile",
            "academic_profile": "CS Graduate" if "computer" in (cand_data["degree"] or "").lower() else "Technical Specialist",
            "learning_velocity": "Top 15th Pct." if len(cand_data["skills"]) >= 5 else "Steady Pace",
            "primary_blocker": score_res["missing_required"][0] if score_res["missing_required"] else (score_res["missing_preferred"][0] if score_res["missing_preferred"] else "None (Fully Cleared)"),
            "recommendation": "Fast-track to technical screening with junior onboarding support package." if score_res["final_score"] >= 60 else "Enroll in targeted upskill sprint before technical round."
        }

        match_id = f"mat-{uuid.uuid4().hex[:8]}"
        cursor.execute("""
            INSERT OR REPLACE INTO match_results 
            (id, candidate_id, job_id, overall_score, required_score, preferred_score, required_weight, preferred_weight, matched_skills, missing_skills, evidence_map, fit_tier, explainability_breakdown)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            match_id, cand_data["id"], job_data["id"], score_res["final_score"],
            score_res["required_match_percentage"], score_res["preferred_match_percentage"],
            score_res["effective_required_weight"], score_res["effective_preferred_weight"],
            json.dumps(score_res["all_matched"]), json.dumps(score_res["all_missing"]),
            json.dumps({m["skill_name"]: m["evidence"] for m in matrix}),
            score_res["fit_tier"], json.dumps(explainer.model_dump())
        ))

        return MatchResultResponse(
            id=match_id,
            candidate_id=cand_data["id"],
            job_id=job_data["id"],
            candidate_name=cand_data["full_name"],
            candidate_code=cand_data["candidate_code"],
            job_title=job_data["title"],
            company=job_data["company"],
            overall_score=score_res["final_score"],
            required_score=score_res["required_match_percentage"],
            preferred_score=score_res["preferred_match_percentage"],
            required_hits_count=score_res["required_hits"],
            required_total_count=score_res["required_total"],
            preferred_hits_count=score_res["preferred_hits"],
            preferred_total_count=score_res["preferred_total"],
            fit_tier=score_res["fit_tier"],
            fit_level=score_res["fit_level"],
            matched_skills=score_res["all_matched"],
            missing_skills=score_res["all_missing"],
            matrix=[SkillComparisonRow(**m) for m in matrix],
            explainer=explainer,
            summary_persona=summary_persona
        )

@router.post("/simulate", response_model=SimulateResponse)
def execute_simulation(req: SimulateRequest):
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
            "skills": json.loads(cand_row["skills"]),
            "projects": json.loads(cand_row["projects"] or "[]"),
            "degree": cand_row["degree"]
        }

        req_skills = json.loads(job_row["required_skills"])
        pref_skills = json.loads(job_row["preferred_skills"])

        # Run simulation without modifying database record
        sim_res = run_simulation(
            candidate_skills=cand_data["skills"],
            simulated_skills=req.simulated_skills,
            required_skills=req_skills,
            preferred_skills=pref_skills,
            candidate_data=cand_data
        )

        return SimulateResponse(
            candidate_id=cand_data["id"],
            job_id=job_row["id"],
            baseline_score=sim_res["baseline_score"],
            simulated_score=sim_res["simulated_score"],
            score_delta=sim_res["score_delta"],
            tier_label=sim_res["tier_label"],
            narrative=sim_res["narrative"],
            acquired_skills=sim_res["acquired_skills"],
            projected_matrix=[SkillComparisonRow(**m) for m in sim_res["projected_matrix"]]
        )
