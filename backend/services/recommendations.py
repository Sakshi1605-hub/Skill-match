from typing import List, Dict, Any, Optional
from services.scoring import calculate_weighted_score
from services.normalization import normalize_skill

CURATED_LEARNING_CATALOG = {
    "machine learning": {
        "title": "Machine Learning Foundations",
        "priority": "HIGH PRIORITY",
        "duration_weeks": "4-6 weeks",
        "description": "Critical gap for AI Services teams. Transition from theoretical CS math into applied inference scripting.",
        "materials": [
            {"title": "Google Machine Learning Crash Course", "type": "course", "link": "https://developers.google.com/machine-learning/crash-course"},
            {"title": "PyTorch Tensors & Basic Regression Labs", "type": "lab", "link": "https://pytorch.org/tutorials"}
        ]
    },
    "aws": {
        "title": "AWS Cloud Architecture",
        "priority": "MEDIUM PRIORITY",
        "duration_weeks": "2-3 weeks",
        "description": "Cloud infrastructure operationalization. Understand distributed deployment patterns and object storage.",
        "materials": [
            {"title": "AWS Certified Cloud Practitioner", "type": "course", "link": "https://aws.amazon.com/certification/"},
            {"title": "EC2 Provisioning, IAM Roles & S3 CLI", "type": "lab", "link": "https://aws.amazon.com/training/"}
        ]
    },
    "docker": {
        "title": "Containerization & Docker",
        "priority": "MEDIUM PRIORITY",
        "duration_weeks": "1-2 weeks",
        "description": "Package Python runtime dependencies uniformly for staging and cluster deployment in production.",
        "materials": [
            {"title": "Containerizing Python Web Services", "type": "lab", "link": "https://docs.docker.com/"},
            {"title": "Multi-stage Docker Builds", "type": "course", "link": "https://docs.docker.com/develop/develop-images/multistage-build/"}
        ]
    },
    "kubernetes": {
        "title": "Kubernetes Orchestration Essentials",
        "priority": "MEDIUM PRIORITY",
        "duration_weeks": "2-4 weeks",
        "description": "Managing container pods, ingress controllers, and service meshes across cloud clusters.",
        "materials": [
            {"title": "Kubernetes Fundamentals (LFS258)", "type": "course", "link": "https://kubernetes.io/docs/tutorials/"},
            {"title": "Helm Charts & KubeConfig Practice", "type": "lab", "link": "https://helm.sh/docs/"}
        ]
    },
    "communication skills": {
        "title": "Technical Storytelling & System Design Review",
        "priority": "LOW PRIORITY",
        "duration_weeks": "1-2 weeks",
        "description": "Structuring architectural trade-offs, RFC writing, and cross-functional technical communication.",
        "materials": [
            {"title": "Effective Engineering Communication Handbook", "type": "book", "link": "#"},
            {"title": "Executive Presentation for Engineers", "type": "course", "link": "#"}
        ]
    }
}

def generate_learning_roadmap(
    missing_required: List[str],
    missing_preferred: List[str],
    req_individual_weight: float,
    pref_individual_weight: float
) -> List[Dict[str, Any]]:
    """Generates personalized learning roadmap based on missing skills."""
    roadmap = []

    # Process required missing skills first (High Priority)
    for skill in missing_required:
        key = normalize_skill(skill).lower()
        cat_info = CURATED_LEARNING_CATALOG.get(key, {
            "title": f"{skill} Mastery Sprint",
            "priority": "HIGH PRIORITY",
            "duration_weeks": "3-5 weeks",
            "description": f"Targeted technical ramp to clear {skill} qualification requirement.",
            "materials": [
                {"title": f"Complete {skill} Bootcamp", "type": "course", "link": "#"},
                {"title": f"Hands-on {skill} Project Labs", "type": "lab", "link": "#"}
            ]
        })
        roadmap.append({
            "skill_name": skill,
            "priority": "HIGH PRIORITY",
            "duration_weeks": cat_info["duration_weeks"],
            "description": cat_info["description"],
            "score_delta": req_individual_weight,
            "score_delta_display": f"+{req_individual_weight:.1f}%",
            "curated_materials": cat_info["materials"]
        })

    # Process preferred missing skills (Medium Priority)
    for skill in missing_preferred:
        key = normalize_skill(skill).lower()
        cat_info = CURATED_LEARNING_CATALOG.get(key, {
            "title": f"{skill} Practical Application",
            "priority": "MEDIUM PRIORITY",
            "duration_weeks": "1-3 weeks",
            "description": f"Differentiator skill to accelerate candidacy for competitive requisitions.",
            "materials": [
                {"title": f"{skill} Best Practices Guide", "type": "course", "link": "#"},
                {"title": f"{skill} Real-World Implementation", "type": "lab", "link": "#"}
            ]
        })
        priority = "LOW PRIORITY" if "communication" in key else "MEDIUM PRIORITY"
        roadmap.append({
            "skill_name": skill,
            "priority": priority,
            "duration_weeks": cat_info["duration_weeks"],
            "description": cat_info["description"],
            "score_delta": pref_individual_weight,
            "score_delta_display": f"+{pref_individual_weight:.1f}%",
            "curated_materials": cat_info["materials"]
        })

    return roadmap

def rank_best_fit_jobs(
    candidate_skills: List[str],
    all_jobs: List[Dict[str, Any]],
    exclude_job_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Ranks saved jobs for a candidate descending by deterministic match score.
    """
    ranked = []
    for job in all_jobs:
        if exclude_job_id and job.get("id") == exclude_job_id:
            continue
        
        req = job.get("required_skills") or []
        pref = job.get("preferred_skills") or []
        score_data = calculate_weighted_score(
            required_skills=req,
            preferred_skills=pref,
            candidate_skills=candidate_skills
        )
        
        score = score_data["final_score"]
        if score >= 80.0:
            fit_label = "HIGH FIT"
        elif score >= 65.0:
            fit_label = "MODERATE-HIGH"
        else:
            fit_label = "LOWER ALIGNMENT"

        # Generate descriptive rationale
        matched = score_data["all_matched"]
        missing = score_data["all_missing"]
        if score >= 80.0:
            rationale = f"Heavy alignment on {', '.join(matched[:3])} without blocker prerequisites."
        elif score >= 65.0:
            rationale = f"Directly aligns with demonstrated {', '.join(matched[:2])} portfolio."
        else:
            rationale = f"Requires active {', '.join(missing[:2])} certifications currently absent from profile."

        ranked.append({
            "job_id": job.get("id"),
            "title": job.get("title"),
            "company": job.get("company", "Enterprise"),
            "department": job.get("department", "Core Engineering"),
            "match_score": score,
            "fit_label": fit_label,
            "rationale": rationale,
            "matched_skills": matched,
            "missing_skills": missing
        })

    # Sort descending by match score
    ranked.sort(key=lambda x: x["match_score"], reverse=True)
    return ranked
