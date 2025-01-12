import json
from fastapi import APIRouter

router = APIRouter()

# Load JSON data for courses and major requirements
with open("data/cs-courses.json") as f:
    courses = json.load(f)

with open("data/cs-major-reqs.json") as f:
    major_requirements = json.load(f)

@router.get("/courses")
async def get_courses():
    """Return all available courses."""
    return courses

@router.get("/major-requirements")
async def get_major_requirements():
    """Return major requirements."""
    return major_requirements

@router.post("/validate-prerequisite")
async def validate_prerequisite(course_id: str, completed_courses: list[str]):
    """Check if a course can be taken based on completed prerequisites."""
    # Find the requested course
    course = next((c for c in courses if c["course_id"] == course_id), None)
    if not course:
        return {"valid": False, "message": "Course not found"}

    # Check for unmet prerequisites
    unmet_prereqs = [prereq for prereq in course["prerequisites"] if prereq not in completed_courses]
    if unmet_prereqs:
        return {"valid": False, "message": f"Missing prerequisites: {', '.join(unmet_prereqs)}"}

    return {"valid": True, "message": "You can take this course"}
