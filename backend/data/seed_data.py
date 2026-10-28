import json
import uuid
from database.connection import get_db

SEED_JOBS = [
    {
        "id": "job-python-dev-01",
        "title": "Python Developer",
        "department": "Core Platform & AI Services",
        "company": "Google",
        "location": "Mountain View / Hybrid",
        "experience_level": "Entry Level / Fresher",
        "min_years_experience": 0.0,
        "required_skills": ["Python", "Java", "SQL", "Machine Learning"],
        "preferred_skills": ["AWS", "Docker", "Git", "Communication Skills"],
        "responsibilities": [
            "Build scalable backend services and microservices supporting AI pipelines.",
            "Design normalized relational database schemas and optimize query throughput.",
            "Write modular, tested code adhering to clean architecture standards.",
            "Collaborate with senior distributed systems and machine learning engineers."
        ],
        "description": "Join Google's Core Platform & AI Services engineering team building next-generation infrastructure."
    },
    {
        "id": "job-jr-backend-meta",
        "title": "Junior Backend Engineer",
        "department": "Infrastructure Tools",
        "company": "Meta",
        "location": "Menlo Park, CA / Remote",
        "experience_level": "Entry Level",
        "min_years_experience": 0.0,
        "required_skills": ["Python", "Java", "SQL"],
        "preferred_skills": ["Git", "REST APIs", "JavaScript"],
        "responsibilities": [
            "Maintain developer productivity tooling and test harness automation.",
            "Implement internal REST APIs connecting telemetry feeds to developer portals."
        ],
        "description": "Heavy emphasis on Python, OOP (Java), and SQL schemas without ML prerequisites."
    },
    {
        "id": "job-data-analyst-stripe",
        "title": "Data Analyst Intern",
        "department": "Revenue Operations",
        "company": "Stripe",
        "location": "San Francisco, CA / Hybrid",
        "experience_level": "Intern",
        "min_years_experience": 0.0,
        "required_skills": ["SQL", "Python"],
        "preferred_skills": ["JavaScript", "HTML", "Git"],
        "responsibilities": [
            "Query and analyze payment routing telemetry across merchant cohorts.",
            "Build automated reporting dashboards and financial reconciliations."
        ],
        "description": "Directly aligns with demonstrated SQL database design and Python scripting portfolio."
    },
    {
        "id": "job-cloud-aws",
        "title": "Cloud Solutions Associate",
        "department": "Partner Support",
        "company": "Amazon Web Services",
        "location": "Seattle, WA / Hybrid",
        "experience_level": "Associate",
        "min_years_experience": 1.0,
        "required_skills": ["AWS", "Docker", "Linux"],
        "preferred_skills": ["Python", "Terraform", "Git"],
        "responsibilities": [
            "Assist enterprise customers with container migrations and VPC provisioning.",
            "Triage cloud architecture support tickets and write deployment playbooks."
        ],
        "description": "Requires active AWS and Docker certifications currently absent from fresher profiles."
    },
    {
        "id": "job-staff-cloud-architect",
        "title": "Principal Cloud Architect",
        "department": "Platform Core",
        "company": "Google Cloud",
        "location": "Sunnyvale, CA",
        "experience_level": "Senior / Staff (L5+)",
        "min_years_experience": 7.0,
        "required_skills": ["AWS", "Kubernetes", "Docker", "Python", "Go"],
        "preferred_skills": ["Terraform", "CI/CD", "PostgreSQL"],
        "responsibilities": [
            "Define enterprise multi-cloud governance and high-availability topologies."
        ],
        "description": "Architect mission-critical distributed platform foundations."
    }
]

SEED_CANDIDATES = [
    {
        "id": "cand-ananya-sharma",
        "candidate_code": "CAN-8902",
        "full_name": "Ananya Sharma",
        "email": "ananya.sharma@example.com",
        "phone": "+1 (555) 234-8902",
        "location": "San Francisco, CA",
        "education": "B.Tech Computer Science · Class of 2024",
        "degree": "B.Tech Computer Science",
        "graduation_year": "2024",
        "experience_years": 0.0,
        "current_role": "Fresher / CS Graduate",
        "skills": ["Python", "Java", "SQL", "JavaScript", "HTML", "CSS", "Git"],
        "projects": [
            {
                "title": "Student Management System",
                "description": "Student Management System using Python and SQL.",
                "skills_used": ["Python", "SQL"]
            },
            {
                "title": "Weather Forecast App",
                "description": "Weather Forecast App using JavaScript and APIs.",
                "skills_used": ["JavaScript", "REST APIs"]
            }
        ],
        "certifications": ["Object-Oriented Programming in Java", "Relational Database Design"],
        "completeness_percentage": 100,
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC9zZcfP0nHLN9H8zwrAQQcWYiepuUdg-fhJCy-MBO1B1TlcszmvOPHpacGmTdxFRLPX--dzPfTwW5ZwvWMRGi9RB3PQqKEzVEZuOWyUSeR53J8atx3dpRb1z2uU68YtKKWChbR1PTE8F_WzO8ff2ncS7H7j91sQMk8QHy4yVsO5WTIVjMHEs--EWqwRN9hRy5Kio2fWyQyQ1_Pj6gAm3kpMTf3VA8RfB34vkm7A5gu98In8Zd5lFmm"
    },
    {
        "id": "cand-marcus-vance",
        "candidate_code": "CAN-8914",
        "full_name": "Marcus Vance",
        "email": "marcus.vance@example.com",
        "phone": "+1 (555) 345-8914",
        "location": "Seattle, WA",
        "education": "M.S. Distributed Systems · Class of 2018",
        "degree": "Master of Science in Distributed Systems",
        "graduation_year": "2018",
        "experience_years": 6.5,
        "current_role": "Principal Cloud Architect",
        "skills": ["AWS", "Docker", "Kubernetes", "Python", "Go", "Terraform", "Git"],
        "projects": [
            {
                "title": "Hybrid Multi-Cloud Ingress Controller",
                "description": "High-availability mesh gateway routing traffic across AWS EKS and GCP clusters.",
                "skills_used": ["Kubernetes", "AWS", "Go"]
            }
        ],
        "certifications": ["AWS Solutions Architect Professional", "CKA Kubernetes Administrator"],
        "completeness_percentage": 100,
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAyKYKBFyn2jsKarArYRJyLK5jFgC0T7pxGMD1QN4niO2nEnolu6gZfIjyel68sqP4UF7mdHynwy1lHHzfipogyZyQ41wbrTzUH_HLSxgBnODlej6wKDJyB4EJEoMLHzH_5_kvzxhEhWA65vmx0K_UklwVD6m3V3vhosiOjMJ0ZuePevrpRMn98oQQyOfnYiIc2tO_6XSwZl-jZtSmn5WBzxv-dMBT-tsGsj587epmoAkfWbkHHHJ_D"
    },
    {
        "id": "cand-elena-rostova",
        "candidate_code": "CAN-8931",
        "full_name": "Elena Rostova",
        "email": "elena.rostova@example.com",
        "phone": "+1 (555) 456-8931",
        "location": "Boston, MA",
        "education": "Ph.D. Computer Vision & Robotics · Class of 2021",
        "degree": "Ph.D. Computer Vision",
        "graduation_year": "2021",
        "experience_years": 5.0,
        "current_role": "ML Research Scientist",
        "skills": ["Python", "Machine Learning", "PyTorch", "TensorFlow", "SQL", "Docker", "Git"],
        "projects": [
            {
                "title": "Low-Latency Diffusion Model Inference",
                "description": "Quantized real-time transformer pipeline reducing inference memory footprint by 40%.",
                "skills_used": ["Machine Learning", "PyTorch", "Python"]
            }
        ],
        "certifications": ["Deep Learning Specialization", "PyTorch Advanced Developer"],
        "completeness_percentage": 100,
        "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBv2j8S-_1Fy3P4EnnKfokCI81BJ2JnspHE_2w9y6BwZ0PchVcgbE5An6Ye08bSSpy6M05kuWqUahnNsD0itoojY3cVgKQbhY81aotzCyYSoUaXluAus6OdqdNvfKpUs1BQo4EuY0SN3UEwY0K-suvicv1Poc6dsNx1R-ZSkAkiICkW8Y5Q6wrVlpvlAOOQ1YsB7Y7ufw_GwNMix4auy-Xt5CpnxYHlwqvOOSGsjDxnV7cSdUeotcVD"
    },
    {
        "id": "cand-devon-kim",
        "candidate_code": "CAN-8955",
        "full_name": "Devon Kim",
        "email": "devon.kim@example.com",
        "phone": "+1 (555) 567-8955",
        "location": "Austin, TX",
        "education": "B.S. Software Engineering · Class of 2020",
        "degree": "Bachelor of Science in Software Engineering",
        "graduation_year": "2020",
        "experience_years": 4.0,
        "current_role": "Senior Fullstack Lead",
        "skills": ["JavaScript", "React", "Node.js", "Python", "SQL", "HTML", "CSS", "Git", "Docker"],
        "projects": [
            {
                "title": "Enterprise E-Commerce Microfrontend Suite",
                "description": "High-throughput React microfrontends processing over 50,000 checkout transactions per hour.",
                "skills_used": ["React", "JavaScript", "Node.js"]
            }
        ],
        "certifications": ["React Architecture Expert", "Node.js Certified Developer"],
        "completeness_percentage": 100,
        "avatar_url": None
    }
]

def seed_database(force: bool = False):
    """Inserts initial seed jobs and candidates if table is empty or forced."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check jobs
        cursor.execute("SELECT COUNT(*) FROM jobs;")
        job_count = cursor.fetchone()[0]
        if job_count == 0 or force:
            if force:
                cursor.execute("DELETE FROM jobs;")
            for j in SEED_JOBS:
                cursor.execute("""
                    INSERT OR REPLACE INTO jobs 
                    (id, title, department, company, location, experience_level, min_years_experience, required_skills, preferred_skills, responsibilities, description)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    j["id"], j["title"], j["department"], j["company"], j["location"],
                    j["experience_level"], j["min_years_experience"],
                    json.dumps(j["required_skills"]), json.dumps(j["preferred_skills"]),
                    json.dumps(j["responsibilities"]), j["description"]
                ))

        # Check candidates
        cursor.execute("SELECT COUNT(*) FROM candidates;")
        cand_count = cursor.fetchone()[0]
        if cand_count == 0 or force:
            if force:
                cursor.execute("DELETE FROM candidates;")
            for c in SEED_CANDIDATES:
                cursor.execute("""
                    INSERT OR REPLACE INTO candidates
                    (id, candidate_code, full_name, email, phone, location, education, degree, graduation_year, experience_years, current_role, skills, projects, certifications, completeness_percentage, avatar_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                """, (
                    c["id"], c["candidate_code"], c["full_name"], c["email"], c["phone"],
                    c["location"], c["education"], c["degree"], c["graduation_year"],
                    c["experience_years"], c["current_role"],
                    json.dumps(c["skills"]), json.dumps(c["projects"]),
                    json.dumps(c["certifications"]), c["completeness_percentage"],
                    c["avatar_url"]
                ))
