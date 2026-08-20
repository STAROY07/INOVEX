import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    startups = relationship("Startup", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("MentorChatMessage", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    founder_type = Column(String(100), default="First-time Founder")  # Student, First-time Founder, Serial Entrepreneur, Professional
    experience_level = Column(String(50), default="Beginner")         # Beginner, Intermediate, Experienced
    location = Column(String(150), default="India")
    startup_interests = Column(JSON, default=list)                   # e.g. ["FinTech", "EdTech", "AI", "D2C"]
    current_startup_stage = Column(String(50), default="Idea")
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Step 1: Basic Idea
    name = Column(String(255), nullable=False)
    business_idea = Column(Text, nullable=False)
    problem_being_solved = Column(Text, nullable=False)
    product_description = Column(Text, nullable=False)
    
    # Step 2: Customer
    target_customer = Column(String(255), nullable=False)
    customer_age_group = Column(String(100), nullable=True)
    customer_location = Column(String(255), default="India")
    business_type = Column(String(50), default="B2C")  # B2B, B2C, B2B2C, D2C
    primary_customer_problem = Column(Text, nullable=True)
    
    # Step 3: Business
    industry = Column(String(100), nullable=False)
    business_model = Column(String(100), nullable=False) # Subscription, Marketplace, Freemium, Commission, Direct Sales
    expected_pricing = Column(String(150), nullable=True)
    revenue_model = Column(Text, nullable=True)
    current_competitors = Column(Text, nullable=True)
    
    # Step 4: Founder
    founder_experience = Column(String(100), nullable=True)
    team_size = Column(String(50), default="1 (Solo Founder)")
    skills = Column(JSON, default=list) # e.g. ["Coding", "Marketing", "Domain Knowledge"]
    available_budget = Column(String(100), default="< ₹50,000")
    time_commitment = Column(String(100), default="Part-time") # Full-time, Part-time, Nights & Weekends
    
    # Step 5: Startup Stage
    stage = Column(String(50), default="Idea") # Idea, Research, Validation, MVP, Early Revenue, Growth
    
    # Step 6: Goals
    goals = Column(JSON, default=list) # e.g. ["Validate idea", "Build MVP", "Get customers", "Register company"]
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="startups")
    assessment = relationship("IdeaAssessment", back_populates="startup", uselist=False, cascade="all, delete-orphan")
    roadmap_stages = relationship("RoadmapStage", back_populates="startup", cascade="all, delete-orphan", order_by="RoadmapStage.stage_order")
    roadmap_tasks = relationship("RoadmapTask", back_populates="startup", cascade="all, delete-orphan")
    daily_tasks = relationship("DailyTask", back_populates="startup", cascade="all, delete-orphan")
    validation_records = relationship("ValidationEvidence", back_populates="startup", cascade="all, delete-orphan")
    chat_messages = relationship("MentorChatMessage", back_populates="startup", cascade="all, delete-orphan")
    business_plan = relationship("BusinessPlan", back_populates="startup", uselist=False, cascade="all, delete-orphan")
    documents = relationship("BusinessDocument", back_populates="startup", cascade="all, delete-orphan")


class IdeaAssessment(Base):
    __tablename__ = "idea_assessments"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    overall_score = Column(Float, default=0.0)
    market_demand_score = Column(Float, default=0.0)
    problem_strength_score = Column(Float, default=0.0)
    feasibility_score = Column(Float, default=0.0)
    competition_score = Column(Float, default=0.0)
    business_model_score = Column(Float, default=0.0)
    revenue_potential_score = Column(Float, default=0.0)
    risk_score = Column(Float, default=0.0)  # Lower is safer, but on 0-100 scale: 100 = high stability / low risk
    scalability_score = Column(Float, default=0.0)

    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    risks = Column(JSON, default=list)
    opportunities = Column(JSON, default=list)
    missing_information = Column(JSON, default=list)
    recommended_next_action = Column(Text, nullable=False)
    detailed_verdict = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="assessment")


class RoadmapStage(Base):
    __tablename__ = "roadmap_stages"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    stage_order = Column(Integer, nullable=False)
    stage_key = Column(String(50), nullable=False)  # idea, problem_validation, market_research, customer_validation, business_model, mvp, testing, launch, early_customers, funding, growth
    stage_name = Column(String(100), nullable=False)
    objective = Column(Text, nullable=False)
    expected_outcome = Column(Text, nullable=False)
    status = Column(String(50), default="not_started") # not_started, in_progress, completed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="roadmap_stages")
    tasks = relationship("RoadmapTask", back_populates="stage", cascade="all, delete-orphan", order_by="RoadmapTask.id")


class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"

    id = Column(Integer, primary_key=True, index=True)
    stage_id = Column(Integer, ForeignKey("roadmap_stages.id", ondelete="CASCADE"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    why_it_matters = Column(Text, nullable=True)
    priority = Column(String(50), default="Medium") # High, Medium, Low
    estimated_time = Column(String(50), default="2-3 days")
    resources = Column(JSON, default=list)
    status = Column(String(50), default="not_started") # not_started, in_progress, completed
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    stage = relationship("RoadmapStage", back_populates="tasks")
    startup = relationship("Startup", back_populates="roadmap_tasks")


class DailyTask(Base):
    __tablename__ = "daily_tasks"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String(255), nullable=False)
    why_it_matters = Column(Text, nullable=False)
    step_by_step = Column(JSON, default=list)
    expected_outcome = Column(Text, nullable=False)
    priority = Column(String(50), default="High") # High, Urgent, Medium
    estimated_time = Column(String(50), default="1-2 hours")
    status = Column(String(50), default="pending") # pending, completed
    category = Column(String(100), default="Validation")
    date_assigned = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    startup = relationship("Startup", back_populates="daily_tasks")


class ValidationEvidence(Base):
    __tablename__ = "validation_evidence"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    
    type = Column(String(100), nullable=False) # Customer Interview, Survey Results, Competitor Research, Market Experiment, MVP Test, User Feedback
    date = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    decision = Column(String(50), default="Persevere") # Persevere, Pivot, Iterate, Inconclusive
    notes = Column(Text, nullable=True)
    metrics = Column(JSON, default=dict) # e.g. {"interviews_done": 12, "pain_level_avg": 8.5}
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="validation_records")


class MentorChatMessage(Base):
    __tablename__ = "mentor_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(String(50), nullable=False) # user, assistant
    content = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="chat_messages")
    user = relationship("User", back_populates="chat_messages")


class BusinessPlan(Base):
    __tablename__ = "business_plans"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    executive_summary = Column(Text, nullable=True)
    problem = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    target_market = Column(Text, nullable=True)
    customer_persona = Column(Text, nullable=True)
    market_opportunity = Column(Text, nullable=True)
    competitor_analysis = Column(Text, nullable=True)
    business_model = Column(Text, nullable=True)
    revenue_model = Column(Text, nullable=True)
    marketing_strategy = Column(Text, nullable=True)
    operations = Column(Text, nullable=True)
    team = Column(Text, nullable=True)
    financial_overview = Column(Text, nullable=True)
    funding_requirement = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    future_growth = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="business_plan")


class BusinessDocument(Base):
    __tablename__ = "business_documents"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id", ondelete="CASCADE"), nullable=False)
    
    doc_type = Column(String(100), nullable=False) # pitch_deck, executive_summary, problem_statement, market_research, customer_persona, swot_analysis, marketing_plan, financial_projection, investor_pitch, startup_proposal
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    format = Column(String(50), default="markdown")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    startup = relationship("Startup", back_populates="documents")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # Idea Validation, Market Research, Business Model, Marketing, Finance, Legal Basics, Funding, MVP Development, Sales, Growth
    description = Column(Text, nullable=False)
    read_time = Column(String(50), default="5 min read")
    difficulty = Column(String(50), default="Beginner") # Beginner, Intermediate, Advanced
    content = Column(Text, nullable=False)
    key_takeaways = Column(JSON, default=list)
    action_steps = Column(JSON, default=list)
    tags = Column(JSON, default=list)
