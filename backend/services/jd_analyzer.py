import re
from typing import Dict, Any, List
from services.normalization import normalize_skills, normalize_skill, SKILL_ALIASES

KNOWN_TECH_KEYWORDS = list(SKILL_ALIASES.keys()) + [
    "python", "java", "sql", "javascript", "react", "c++", "c#", "go", "rust",
    "machine learning", "deep learning", "pytorch", "tensorflow", "aws", "gcp",
    "azure", "docker", "kubernetes", "git", "linux", "html", "css", "postgresql",
    "mysql", "mongodb", "redis", "fastapi", "django", "flask", "node.js",
    "communication skills", "agile", "scrum", "ci/cd", "rest apis", "graphql"
]

def analyze_job_description(raw_text: str) -> Dict[str, Any]:
    """
    Deterministically parses raw job description text into structured data.
    """
    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    full_text_lower = raw_text.lower()

    # 1. Title Extraction
    title = "Software Engineer"
    for line in lines[:5]:
        title_match = re.search(r"(?:job\s*title|role|position)[\s:]+(.+)$", line, re.I)
        if title_match:
            title = title_match.group(1).strip()
            break
        elif any(k in line.lower() for k in ["engineer", "developer", "architect", "lead", "scientist", "analyst"]):
            title = re.sub(r"^[#*\-\s]+", "", line).strip()
            break

    # 2. Company & Department
    company = "Google"
    department = "Core Platform & AI Services"
    comp_match = re.search(r"(?:company|organization|employer)[\s:]+(.+)$", raw_text, re.I | re.M)
    if comp_match:
        company = comp_match.group(1).strip()
    
    dept_match = re.search(r"(?:department|team|division)[\s:]+(.+)$", raw_text, re.I | re.M)
    if dept_match:
        department = dept_match.group(1).strip()

    # 3. Location
    location = "Mountain View / Hybrid"
    loc_match = re.search(r"(?:location)[\s:]+(.+)$", raw_text, re.I | re.M)
    if loc_match:
        location = loc_match.group(1).strip()

    # 4. Experience Level & Min Years
    exp_years = 0.0
    exp_level = "Mid-Level"
    years_match = re.search(r"(\d+(?:\.\d+)?)\+?\s*(?:-\s*\d+)?\s*(?:years|yrs)", full_text_lower)
    if years_match:
        exp_years = float(years_match.group(1))

    if exp_years == 0 or "fresher" in full_text_lower or "entry level" in full_text_lower or "intern" in full_text_lower:
        exp_level = "Entry Level / Fresher"
        exp_years = 0.0
    elif exp_years >= 6 or "staff" in title.lower() or "principal" in title.lower():
        exp_level = "Senior / Staff (L5+)"
    elif exp_years >= 3:
        exp_level = "Mid-Level (L3-L4)"

    # 5. Section Extraction for Required vs Preferred vs Responsibilities
    required_skills = []
    preferred_skills = []
    responsibilities = []

    current_section = None
    for line in lines:
        line_clean = re.sub(r"^[#*\-\d.\s]+", "", line).strip()
        lower_line = line.lower()

        # Check section headers
        if any(h in lower_line for h in ["required skill", "minimum qualification", "requirements:", "must have", "what you need:"]):
            current_section = "REQUIRED"
            continue
        elif any(h in lower_line for h in ["preferred skill", "nice to have", "bonus", "preferred qualification", "good to have:"]):
            current_section = "PREFERRED"
            continue
        elif any(h in lower_line for h in ["responsibilities", "what you'll do", "role overview", "duties"]):
            current_section = "RESPONSIBILITIES"
            continue

        if not line_clean:
            continue

        if current_section == "REQUIRED":
            # Extract skills listed in this bullet or comma-separated
            skills_in_line = extract_skills_from_text(line_clean)
            if skills_in_line:
                required_skills.extend(skills_in_line)
            elif len(line_clean) < 60:
                required_skills.append(line_clean)
        elif current_section == "PREFERRED":
            skills_in_line = extract_skills_from_text(line_clean)
            if skills_in_line:
                preferred_skills.extend(skills_in_line)
            elif len(line_clean) < 60:
                preferred_skills.append(line_clean)
        elif current_section == "RESPONSIBILITIES":
            if len(line_clean) > 10:
                responsibilities.append(line_clean)

    # Fallback keyword scanning if specific sections weren't explicitly partitioned
    if not required_skills and not preferred_skills:
        all_found = extract_skills_from_text(raw_text)
        if all_found:
            mid = max(1, len(all_found) // 2)
            required_skills = all_found[:mid]
            preferred_skills = all_found[mid:]

    # Default fallback for empty sections
    if not required_skills:
        required_skills = ["Python", "SQL"]
    if not preferred_skills:
        preferred_skills = ["Git", "Docker"]
    if not responsibilities:
        responsibilities = [
            "Architect and maintain high-throughput backend services and data pipelines.",
            "Collaborate with cross-functional product and infrastructure engineering teams.",
            "Ensure adherence to software engineering standards, testing, and continuous delivery."
        ]

    normalized_req = normalize_skills(required_skills)
    normalized_pref = normalize_skills(preferred_skills)

    # Avoid overlaps between required and preferred
    req_set = set(s.lower() for s in normalized_req)
    normalized_pref = [s for s in normalized_pref if s.lower() not in req_set]

    return {
        "title": title,
        "department": department,
        "company": company,
        "location": location,
        "experience_level": exp_level,
        "min_years_experience": exp_years,
        "required_skills": normalized_req,
        "preferred_skills": normalized_pref,
        "responsibilities": responsibilities[:6],
        "extracted_summary": f"Extracted {len(normalized_req)} required and {len(normalized_pref)} preferred competencies."
    }

def extract_skills_from_text(text: str) -> List[str]:
    """Finds known technical skills inside a sentence or clause."""
    found = []
    # Tokenize words while preserving phrases like "machine learning" or "c++"
    text_lower = text.lower()
    for kw in KNOWN_TECH_KEYWORDS:
        pattern = r"\b" + re.escape(kw) + r"\b" if re.match(r"^\w", kw) else re.escape(kw)
        if re.search(pattern, text_lower):
            norm = normalize_skill(kw)
            if norm and norm not in found:
                found.append(norm)
    return found
