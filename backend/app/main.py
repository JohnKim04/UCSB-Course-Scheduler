from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import courses

app = FastAPI()

# Enable CORS (if you're planning to use a frontend like React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to restrict specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the routes for courses
app.include_router(courses.router, prefix="/api")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Welcome to the UCSB Course Planner Backend"}
