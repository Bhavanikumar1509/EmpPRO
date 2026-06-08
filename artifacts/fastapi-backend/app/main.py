from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.routers import auth, employees, departments, projects, tasks, timesheets, attendance, performance, notifications, analytics

import app.models  # noqa: F401 — ensures all models are registered before create_all

app = FastAPI(title="EMP Pro API", version="1.0.0", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(departments.router)
app.include_router(projects.router)
app.include_router(tasks.router)
app.include_router(timesheets.router)
app.include_router(attendance.router)
app.include_router(performance.router)
app.include_router(notifications.router)
app.include_router(analytics.router)


@app.get("/healthz")
def health_check():
    return {"status": "ok"}
