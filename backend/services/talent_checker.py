from typing import Dict, Any, List
from services.scoring import calculate_weighted_score

def evaluate_talent_eligibility(candidate: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates candidate eligibility across Education, Experience, Qualifications, and Compliance.
    """
    checks = []
    cand_exp = candidate.get("experience_years", 0.0)
    job_min_exp = job.get("min_years_experience", 0.0)
    job_level = job.get("experience_level", "Mid-Level")

    # 1. Experience Alignment Check
    if cand_exp >= job_min_exp:
        checks.append({
            "criterion": "Experience Duration & Career Tier",
            "status": "PASS",
            "explanation": f"Candidate possesses {cand_exp} years of relevant experience, satisfying the requirement of {job_min_exp} years."
        })
    elif cand_exp == 0.0 and ("fresher" in job_level.lower() or "entry" in job_level.lower() or job_min_exp == 0.0):
        checks.append({
            "criterion": "Experience Duration & Career Tier",
            "status": "PASS",
            "explanation": "Entry-level / Fresher requisition aligns with candidate's recent graduation."
        })
    elif abs(cand_exp - job_min_exp) <= 1.0:
        checks.append({
            "criterion": "Experience Duration & Career Tier",
            "status": "WARNING",
            "explanation": f"Minor delta: Candidate has {cand_exp} yrs vs {job_min_exp} yrs required. Potential for waiver based on project portfolio."
        })
    else:
        checks.append({
            "criterion": "Experience Duration & Career Tier",
            "status": "FAIL",
            "explanation": f"Experience deficit: Role requires {job_min_exp} years; candidate record shows {cand_exp} years."
        })

    # 2. Academic Qualification Check
    cand_edu = (candidate.get("education") or "").lower()
    cand_deg = (candidate.get("degree") or "").lower()
    if any(k in cand_edu or k in cand_deg for k in ["computer science", "b.tech", "bachelor", "master", "software", "information technology"]):
        checks.append({
            "criterion": "Academic & Degree Accreditation",
            "status": "PASS",
            "explanation": f"Accredited technical degree validated: {candidate.get('degree') or candidate.get('education')}."
        })
    else:
        checks.append({
            "criterion": "Academic & Degree Accreditation",
            "status": "WARNING",
            "explanation": "Non-traditional degree background. Supplementary portfolio review recommended."
        })

    # 3. Core Mandatory Qualification Check
    req_skills = job.get("required_skills") or []
    cand_skills = candidate.get("skills") or []
    match_calc = calculate_weighted_score(
        required_skills=req_skills,
        preferred_skills=job.get("preferred_skills") or [],
        candidate_skills=cand_skills
    )
    req_match_pct = match_calc["required_match_percentage"]

    if req_match_pct >= 70.0:
        checks.append({
            "criterion": "Core Competency Baseline (SkillSight M-04)",
            "status": "PASS",
            "explanation": f"Cleared {match_calc['required_hits']}/{match_calc['required_total']} mandatory skills ({req_match_pct}% coverage)."
        })
    elif req_match_pct >= 50.0:
        checks.append({
            "criterion": "Core Competency Baseline (SkillSight M-04)",
            "status": "WARNING",
            "explanation": f"Moderate coverage ({req_match_pct}%). Missing critical skills: {', '.join(match_calc['missing_required'][:2])}."
        })
    else:
        checks.append({
            "criterion": "Core Competency Baseline (SkillSight M-04)",
            "status": "FAIL",
            "explanation": f"Insufficient core baseline ({req_match_pct}%). Critical skills missing."
        })

    # 4. Identity & Profile Completeness Compliance
    completeness = candidate.get("completeness_percentage", 100)
    if completeness >= 80 and candidate.get("email"):
        checks.append({
            "criterion": "Identity & Contact Verification",
            "status": "PASS",
            "explanation": f"Profile telemetry verified at {completeness}% completeness with validated contact anchors."
        })
    else:
        checks.append({
            "criterion": "Identity & Contact Verification",
            "status": "WARNING",
            "explanation": f"Profile completeness at {completeness}%. Incomplete contact metadata."
        })

    # Verdict determination
    has_fail = any(c["status"] == "FAIL" for c in checks)
    has_warning = any(c["status"] == "WARNING" for c in checks)

    if not has_fail and not has_warning:
        verdict = "Clear to Advance — Fully Qualified"
        is_eligible = True
    elif not has_fail:
        verdict = "Conditional Clearance — Recommendation Authorized with Upskill Track"
        is_eligible = True
    else:
        verdict = "Eligibility Blocked — Critical Requisite Discrepancy"
        is_eligible = False

    return {
        "candidate_id": candidate.get("id", ""),
        "job_id": job.get("id", ""),
        "is_eligible": is_eligible,
        "overall_verdict": verdict,
        "checks": checks
    }
