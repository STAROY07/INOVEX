import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .database import engine, Base, SessionLocal
from . import models
from .services.seed_data import SEED_LEARNING_RESOURCES
from .routers import (
    auth_routes,
    startup_routes,
    assessment_routes,
    mentor_routes,
    roadmap_routes,
    action_routes,
    validation_routes,
    bizplan_routes,
    document_routes,
    legal_routes,
    resource_routes
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

# Seed initial learning resources if not present
def init_db():
    db = SessionLocal()
    try:
        if db.query(models.LearningResource).count() == 0:
            for item in SEED_LEARNING_RESOURCES:
                db.add(models.LearningResource(**item))
            db.commit()
    finally:
        db.close()

init_db()

app = FastAPI(
    title="INOVEX AI Startup Mentor API",
    description="Backend API engine for INOVEX — AI Startup Mentor Platform for Indian & Global Founders",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth_routes.router)
app.include_router(startup_routes.router)
app.include_router(assessment_routes.router)
app.include_router(mentor_routes.router)
app.include_router(roadmap_routes.router)
app.include_router(action_routes.router)
app.include_router(validation_routes.router)
app.include_router(bizplan_routes.router)
app.include_router(document_routes.router)
app.include_router(legal_routes.router)
app.include_router(resource_routes.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "INOVEX — AI Startup Mentor Platform",
        "version": "1.0.0",
        "tagline": "You have the idea. INOVEX gives you the next step."
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
