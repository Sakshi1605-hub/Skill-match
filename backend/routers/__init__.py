from routers.jobs import router as jobs_router
from routers.candidates import router as candidates_router
from routers.resumes import router as resumes_router
from routers.matching import router as matching_router
from routers.recommendations import router as recommendations_router
from routers.talent_check import router as talent_check_router
from routers.dashboard import router as dashboard_router

__all__ = [
    "jobs_router",
    "candidates_router",
    "resumes_router",
    "matching_router",
    "recommendations_router",
    "talent_check_router",
    "dashboard_router"
]
