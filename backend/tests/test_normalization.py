import pytest
from services.normalization import normalize_skill, normalize_skills, skills_match

def test_mandatory_aliases():
    assert normalize_skill("JS") == "JavaScript"
    assert normalize_skill("js") == "JavaScript"
    assert normalize_skill("ML") == "Machine Learning"
    assert normalize_skill("ml") == "Machine Learning"
    assert normalize_skill("ReactJS") == "React"
    assert normalize_skill("react.js") == "React"
    assert normalize_skill("Postgres") == "PostgreSQL"
    assert normalize_skill("postgresql") == "PostgreSQL"

def test_additional_tech_aliases():
    assert normalize_skill("py") == "Python"
    assert normalize_skill("python 3") == "Python"
    assert normalize_skill("TS") == "TypeScript"
    assert normalize_skill("k8s") == "Kubernetes"
    assert normalize_skill("aws") == "AWS"
    assert normalize_skill("docker") == "Docker"
    assert normalize_skill("git") == "Git"
    assert normalize_skill("communication") == "Communication Skills"

def test_normalize_skills_list():
    raw_list = ["JS", "reactjs", "ML", "Python", "ml", "POSTGRES"]
    normalized = normalize_skills(raw_list)
    assert normalized == ["JavaScript", "React", "Machine Learning", "Python", "PostgreSQL"]

def test_skills_match():
    assert skills_match("JS", "JavaScript") is True
    assert skills_match("reactjs", "React") is True
    assert skills_match("ML", "Machine Learning") is True
    assert skills_match("postgres", "PostgreSQL") is True
    assert skills_match("Python", "Java") is False
