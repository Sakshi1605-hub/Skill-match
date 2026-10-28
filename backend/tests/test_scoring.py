import pytest
from services.scoring import calculate_weighted_score, build_explainability_matrix
from services.simulator import run_simulation

def test_prompt_sample_scoring_ananya_sharma():
    """
    User prompt sample verification:
    Job: Python Developer
    Required: Python, Java, SQL, Machine Learning (4)
    Preferred: AWS, Docker, Git, Communication Skills (4)
    Candidate: Ananya Sharma
    Skills: Python, Java, SQL, JavaScript, HTML, CSS, Git

    Expected:
    Required = 3/4 = 75%
    Preferred = 1/4 = 25%
    Final = (75 * 0.70) + (25 * 0.30) = 52.5 + 7.5 = 60.0%
    """
    job_required = ["Python", "Java", "SQL", "Machine Learning"]
    job_preferred = ["AWS", "Docker", "Git", "Communication Skills"]
    candidate_skills = ["Python", "Java", "SQL", "JavaScript", "HTML", "CSS", "Git"]

    res = calculate_weighted_score(
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_skills=candidate_skills,
        custom_required_weight=0.70,
        custom_preferred_weight=0.30
    )

    assert res["required_hits"] == 3
    assert res["required_total"] == 4
    assert res["required_match_percentage"] == 75.0

    assert res["preferred_hits"] == 1
    assert res["preferred_total"] == 4
    assert res["preferred_match_percentage"] == 25.0

    assert res["required_weighted_score"] == 52.5
    assert res["preferred_weighted_score"] == 7.5
    assert res["final_score"] == 60.0

    assert "Machine Learning" in res["missing_required"]
    assert "Python" in res["matched_required"]
    assert "Git" in res["matched_preferred"]
    assert "AWS" in res["missing_preferred"]

def test_empty_preferred_category():
    """If preferred skills category is empty, required should contribute 100%."""
    job_required = ["Python", "SQL"]
    job_preferred = []
    candidate_skills = ["Python"]

    res = calculate_weighted_score(
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_skills=candidate_skills
    )

    assert res["required_match_percentage"] == 50.0
    assert res["effective_required_weight"] == 1.0
    assert res["effective_preferred_weight"] == 0.0
    assert res["final_score"] == 50.0

def test_empty_required_category():
    """If required skills category is empty, preferred should contribute 100%."""
    job_required = []
    job_preferred = ["AWS", "Docker"]
    candidate_skills = ["AWS"]

    res = calculate_weighted_score(
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_skills=candidate_skills
    )

    assert res["preferred_match_percentage"] == 50.0
    assert res["effective_required_weight"] == 0.0
    assert res["effective_preferred_weight"] == 1.0
    assert res["final_score"] == 50.0

def test_perfect_match():
    job_required = ["Python", "Java"]
    job_preferred = ["AWS", "Docker"]
    candidate_skills = ["Python", "Java", "AWS", "Docker"]

    res = calculate_weighted_score(
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_skills=candidate_skills
    )

    assert res["final_score"] == 100.0
    assert res["fit_level"] == "HIGH FIT"

def test_zero_match():
    job_required = ["Rust", "Solidity"]
    job_preferred = ["Go"]
    candidate_skills = ["Python", "SQL"]

    res = calculate_weighted_score(
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_skills=candidate_skills
    )

    assert res["final_score"] == 0.0

def test_what_if_simulator():
    """
    When Ananya hypothetically acquires Machine Learning:
    Required goes from 3/4 (75%) to 4/4 (100%).
    New Required contribution = 100% * 0.70 = 70.0%
    Preferred contribution = 25% * 0.30 = 7.5%
    New score = 70.0 + 7.5 = 77.5% (+17.5% uplift)
    """
    job_required = ["Python", "Java", "SQL", "Machine Learning"]
    job_preferred = ["AWS", "Docker", "Git", "Communication Skills"]
    candidate_skills = ["Python", "Java", "SQL", "JavaScript", "HTML", "CSS", "Git"]
    cand_data = {"full_name": "Ananya Sharma", "projects": []}

    sim = run_simulation(
        candidate_skills=candidate_skills,
        simulated_skills=["Machine Learning"],
        required_skills=job_required,
        preferred_skills=job_preferred,
        candidate_data=cand_data
    )

    assert sim["baseline_score"] == 60.0
    assert sim["simulated_score"] == 77.5
    assert sim["score_delta"] == 17.5
    assert "Tier 1 Clear Candidate" in sim["tier_label"]
