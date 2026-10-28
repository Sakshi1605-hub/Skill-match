import json
import uuid
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from database.connection import get_db
from models.schemas import ResumeUploadResponse
from services.resume_parser import extract_text_from_file, parse_resume_content
from config import UPLOADS_DIR

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    filename = file.filename or "unknown_resume.txt"
    file_bytes = await file.read()
    file_size = len(file_bytes)
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""

    resume_id = f"res-{uuid.uuid4().hex[:8]}"

    # Save to disk for persistence
    safe_path = UPLOADS_DIR / f"{resume_id}_{filename}"
    try:
        with open(safe_path, "wb") as f:
            f.write(file_bytes)
    except Exception as e:
        pass

    try:
        # Extract text and parse
        raw_text = extract_text_from_file(file_bytes, filename)
        parsed_candidate = parse_resume_content(raw_text, filename)
    except ValueError as val_err:
        # Store failed resume record in DB
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO resumes (id, candidate_id, filename, file_type, file_size, raw_text, parsed_data, status, error_message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (resume_id, None, filename, ext, file_size, "", "{}", "FAILED", str(val_err)))
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as err:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO resumes (id, candidate_id, filename, file_type, file_size, raw_text, parsed_data, status, error_message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (resume_id, None, filename, ext, file_size, "", "{}", "FAILED", str(err)))
        raise HTTPException(status_code=500, detail=f"Unexpected parsing error: {str(err)}")

    # Auto-create or link candidate record
    cand_id = f"cand-{uuid.uuid4().hex[:8]}"
    cand_code = f"CAN-{uuid.uuid4().int % 9000 + 1000}"

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO candidates 
            (id, candidate_code, full_name, email, phone, location, education, degree, graduation_year, experience_years, current_role, skills, projects, certifications, completeness_percentage, avatar_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            cand_id, cand_code, parsed_candidate["full_name"], parsed_candidate["email"],
            parsed_candidate["phone"], parsed_candidate["location"], parsed_candidate["education"],
            parsed_candidate["degree"], parsed_candidate["graduation_year"],
            parsed_candidate["experience_years"], parsed_candidate["current_role"],
            json.dumps(parsed_candidate["skills"]), json.dumps(parsed_candidate["projects"]),
            json.dumps(parsed_candidate["certifications"]), parsed_candidate["completeness_percentage"],
            None
        ))

        cursor.execute("""
            INSERT INTO resumes (id, candidate_id, filename, file_type, file_size, raw_text, parsed_data, status, error_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            resume_id, cand_id, filename, ext, file_size, raw_text[:5000],
            json.dumps(parsed_candidate), "PROCESSED", None
        ))

    return ResumeUploadResponse(
        resume_id=resume_id,
        filename=filename,
        file_type=ext,
        parsed_candidate_id=cand_id,
        candidate_name=parsed_candidate["full_name"],
        detected_skills=parsed_candidate["skills"],
        status="PROCESSED",
        error_message=None
    )
