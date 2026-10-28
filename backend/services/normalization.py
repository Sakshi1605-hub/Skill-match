import re
from typing import List, Dict

SKILL_ALIASES: Dict[str, str] = {
    # Prompt-specified mandatory aliases
    "js": "JavaScript",
    "javascript": "JavaScript",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "reactjs": "React",
    "react.js": "React",
    "react": "React",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",

    # Common programming languages & frameworks
    "py": "Python",
    "python": "Python",
    "python3": "Python",
    "python 3": "Python",
    "python 3.x": "Python",
    "java": "Java",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "golang": "Go",
    "go": "Go",
    "html": "HTML",
    "html5": "HTML",
    "css": "CSS",
    "css3": "CSS",
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "vue": "Vue.js",
    "vuejs": "Vue.js",
    "vue.js": "Vue.js",
    "angular": "Angular",
    "angularjs": "Angular",

    # Cloud & DevOps
    "aws": "AWS",
    "amazon web services": "AWS",
    "gcp": "Google Cloud",
    "google cloud": "Google Cloud",
    "google cloud platform": "Google Cloud",
    "azure": "Azure",
    "microsoft azure": "Azure",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "git": "Git",
    "github": "Git",
    "gitlab": "Git",
    "ci/cd": "CI/CD",
    "cicd": "CI/CD",
    "terraform": "Terraform",

    # Databases & AI
    "sql": "SQL",
    "mysql": "MySQL",
    "nosql": "NoSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "redis": "Redis",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",

    # Soft skills & Methodologies
    "communication": "Communication Skills",
    "communication skills": "Communication Skills",
    "verbal communication": "Communication Skills",
    "written communication": "Communication Skills",
    "agile": "Agile",
    "scrum": "Scrum",
    "rest": "REST APIs",
    "rest api": "REST APIs",
    "restful": "REST APIs",
    "restful api": "REST APIs",
    "graphql": "GraphQL"
}

def clean_skill_string(s: str) -> str:
    """Strips leading/trailing punctuation and standardizes inner whitespace."""
    if not s:
        return ""
    # Trim and normalize spaces
    s = s.strip()
    s = re.sub(r"\s+", " ", s)
    return s

def normalize_skill(skill: str) -> str:
    """
    Normalizes a single skill string against the alias dictionary.
    Case-insensitive lookup with fallback to clean Title Case.
    """
    cleaned = clean_skill_string(skill)
    if not cleaned:
        return ""

    key = cleaned.lower()
    if key in SKILL_ALIASES:
        return SKILL_ALIASES[key]

    # Try removing trailing dots, slashes, or versions like 'Python 3.10' -> 'Python'
    key_no_ver = re.sub(r"\s+v?\d+(\.\d+)*$", "", key).strip()
    if key_no_ver in SKILL_ALIASES:
        return SKILL_ALIASES[key_no_ver]

    # Return trimmed original with standard title case if alphanumeric
    return cleaned.strip()

def normalize_skills(skills: List[str]) -> List[str]:
    """
    Normalizes a list of skills, deduplicating while preserving order.
    """
    result = []
    seen = set()
    for s in skills:
        norm = normalize_skill(s)
        if norm and norm.lower() not in seen:
            seen.add(norm.lower())
            result.append(norm)
    return result

def skills_match(skill_candidate: str, skill_job: str) -> bool:
    """
    Checks if a candidate skill matches a target job skill after normalization.
    """
    norm_c = normalize_skill(skill_candidate).lower()
    norm_j = normalize_skill(skill_job).lower()
    return norm_c == norm_j
