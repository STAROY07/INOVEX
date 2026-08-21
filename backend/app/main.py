import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("inovex.main")

load_dotenv()

from .database import engine, Base, SessionLocal
from . import auth, models
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

def init_db():
    logger.info("Initializing database tables and seed data...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema synchronized.")
    except Exception as exc:
        logger.error(f"Error creating database tables: {exc}", exc_info=True)

    try:
        db = SessionLocal()
        try:
            if db.query(models.LearningResource).count() == 0:
                logger.info("Seeding initial learning resources...")
                for item in SEED_LEARNING_RESOURCES:
                    db.add(models.LearningResource(**item))
                db.commit()
                logger.info("Initial learning resources seeded.")

            # Ensure default demo user exists
            demo_user = db.query(models.User).filter(models.User.email == "founder@inovex.ai").first()
            if not demo_user:
                logger.info("Creating default demo user (founder@inovex.ai)...")
                demo_user = models.User(
                    email="founder@inovex.ai",
                    hashed_password=auth.get_password_hash("startup123"),
                    full_name="Aarav Sharma"
                )
                db.add(demo_user)
                db.commit()
                db.refresh(demo_user)

                demo_profile = models.UserProfile(
                    user_id=demo_user.id,
                    founder_type="First-time Founder",
                    experience_level="Beginner",
                    location="India",
                    startup_interests=["Tech", "AI", "SaaS"]
                )
                db.add(demo_profile)
                db.commit()
                logger.info("Demo user seeded successfully.")
        finally:
            db.close()
    except Exception as exc:
        logger.warning(f"Database seed check encountered an issue: {exc}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("INOVEX Backend API starting up...")
    init_db()
    yield
    # Shutdown
    logger.info("INOVEX Backend API shutting down...")

app = FastAPI(
    title="INOVEX AI Startup Mentor API",
    description="Backend API engine for INOVEX — AI Startup Mentor Platform for Indian & Global Founders",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
# Allowing all origins with regex pattern ensures Netlify, localhost, and custom domains work
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=False,
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
@app.get("/api/health")
def health_check():
    db_status = "connected"
    try:
        db = SessionLocal()
        db.execute(models.User.__table__.select().limit(1))
        db.close()
    except Exception as exc:
        db_status = f"unhealthy: {str(exc)}"
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "api": "online"
    }
