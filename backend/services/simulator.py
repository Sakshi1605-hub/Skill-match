from typing import List, Dict, Any
from services.scoring import calculate_weighted_score, build_explainability_matrix

def run_simulation(
    candidate_skills: List[str],
    simulated_skills: List[str],
    required_skills: List[str],
    preferred_skills: List[str],
    candidate_data: Dict[str, Any],
    custom_required_weight: float = 0.70,
    custom_preferred_weight: float = 0.30
) -> Dict[str, Any]:
    """
    Simulates hypothetical skill acquisition without mutating the candidate record.
    """
    # Baseline calculation
    base_calc = calculate_weighted_score(
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        candidate_skills=candidate_skills,
        custom_required_weight=custom_required_weight,
        custom_preferred_weight=custom_preferred_weight
    )

    # Combined candidate skills for simulation
    hypothetical_skills = list(set(candidate_skills + simulated_skills))

    sim_calc = calculate_weighted_score(
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        candidate_skills=hypothetical_skills,
        custom_required_weight=custom_required_weight,
        custom_preferred_weight=custom_preferred_weight
    )

    base_score = base_calc["final_score"]
    sim_score = sim_calc["final_score"]
    delta = round(sim_score - base_score, 1)

    # Generate Stitch-aligned tier label and narrative
    candidate_name = candidate_data.get("full_name", "the candidate")
    if sim_score >= 85.0:
        tier_label = "Tier 1 Top Candidate (Direct Hire)"
        narrative = f"Acquiring high-impact skills elevates {candidate_name} to the top 5% of candidate pools."
    elif sim_score >= 75.0:
        tier_label = "Tier 1 Clear Candidate"
        narrative = "Strong qualification threshold cleared. Interview recommendation authorized."
    elif sim_score > 60.0:
        tier_label = "Tier 2 Progressive Candidate"
        narrative = "Moderate uplift detected. Critical skill gaps partially or fully compensated."
    else:
        tier_label = "Baseline Tier 2 Candidate"
        narrative = f"Select learning pathways to project {candidate_name}'s placement readiness."

    # Projected matrix under simulation
    projected_matrix = build_explainability_matrix(
        required_skills=required_skills,
        preferred_skills=preferred_skills,
        candidate_data=candidate_data,
        scoring_result=sim_calc
    )

    return {
        "baseline_score": base_score,
        "simulated_score": sim_score,
        "score_delta": delta,
        "tier_label": tier_label,
        "narrative": narrative,
        "acquired_skills": simulated_skills,
        "projected_matrix": projected_matrix
    }
