import pytest
import io
from fastapi.testclient import TestClient
from main import app
from database.schema import init_db
from data.seed_data import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    init_db()
    seed_database(force=True)

@pytest.fixture
def client():
    return TestClient(app)

def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ONLINE"
    assert "SkillSight" in data["engine"]

def test_jobs_crud(client):
    # GET jobs
    res = client.get("/api/jobs")
    assert res.status_code == 200
    jobs = res.json()
    assert len(jobs) >= 1
    assert any(j["title"] == "Python Developer" for j in jobs)

    # POST new job
    new_job = {
        "title": "Senior AI Systems Engineer",
        "department": "Applied Research",
        "company": "DeepMind",
        "location": "London / Hybrid",
        "experience_level": "Senior",
        "min_years_experience": 5.0,
        "required_skills": ["Python", "PyTorch", "C++"],
        "preferred_skills": ["CUDA", "Docker"],
        "responsibilities": ["Design distributed tensor sharding pipelines."],
        "description": "High performance AI model training infrastructure."
    }
    create_res = client.post("/api/jobs", json=new_job)
    assert create_res.status_code == 200
    created = create_res.json()
    assert created["title"] == "Senior AI Systems Engineer"
    assert "Python" in created["required_skills"]

def test_candidates_crud(client):
    res = client.get("/api/candidates")
    assert res.status_code == 200
    cands = res.json()
    assert len(cands) >= 1
    assert any(c["full_name"] == "Ananya Sharma" for c in cands)

    # Fetch specific candidate
    cand_id = cands[0]["id"]
    get_res = client.get(f"/api/candidates/{cand_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == cand_id

def test_match_endpoint(client):
    match_payload = {
        "candidate_id": "cand-ananya-sharma",
        "job_id": "job-python-dev-01",
        "required_weight": 0.70,
        "preferred_weight": 0.30
    }
    res = client.post("/api/match", json=match_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["overall_score"] == 60.0
    assert data["required_score"] == 75.0
    assert data["preferred_score"] == 25.0
    assert data["fit_level"] == "MODERATE FIT"
    assert len(data["matrix"]) == 8
    assert data["explainer"]["required_weighted_score"] == 52.5
    assert data["explainer"]["preferred_weighted_score"] == 7.5

def test_simulate_endpoint(client):
    sim_payload = {
        "candidate_id": "cand-ananya-sharma",
        "job_id": "job-python-dev-01",
        "simulated_skills": ["Machine Learning", "AWS"]
    }
    res = client.post("/api/simulate", json=sim_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["baseline_score"] == 60.0
    # 60.0 + 17.5 (ML) + 7.5 (AWS) = 85.0
    assert data["simulated_score"] == 85.0
    assert data["score_delta"] == 25.0
    assert "Tier 1 Top Candidate" in data["tier_label"]

def test_recommendations_endpoint(client):
    res = client.get("/api/recommendations/cand-ananya-sharma?job_id=job-python-dev-01")
    assert res.status_code == 200
    data = res.json()
    assert data["candidate_name"] == "Ananya Sharma"
    assert len(data["learning_roadmap"]) >= 2
    assert len(data["best_fit_openings"]) >= 1

def test_talent_check_endpoint(client):
    check_payload = {
        "candidate_id": "cand-ananya-sharma",
        "job_id": "job-python-dev-01"
    }
    res = client.post("/api/talent-check", json=check_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_eligible"] is True
    assert len(data["checks"]) >= 3

def test_resume_upload_txt(client):
    fake_resume_text = """
    Marcus Vance
    Email: marcus.test@example.com
    Phone: (555) 123-4567
    Education: B.S. in Computer Science, 2022
    Experience: 2 years in Backend Engineering
    Skills: Python, SQL, Docker, AWS, Git
    Project: Cloud Microservices Gateway
    Engineered real-time API streaming service with Python and Docker.
    """
    file_bytes = io.BytesIO(fake_resume_text.encode("utf-8"))
    files = {"file": ("marcus_resume.txt", file_bytes, "text/plain")}
    res = client.post("/api/resumes/upload", files=files)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "PROCESSED"
    assert "Python" in data["detected_skills"]
