from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileUpdate(BaseModel):
    phone: Optional[str] = None
    founder_type: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    startup_interests: Optional[List[str]] = None
    current_startup_stage: Optional[str] = None
    bio: Optional[str] = None

class UserProfileOut(BaseModel):
    phone: Optional[str] = None
    founder_type: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    startup_interests: List[str] = []
    current_startup_stage: Optional[str] = None
    bio: Optional[str] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileOut] = None

    class Config:
        from_attributes = True

# --- Startup Onboarding Schemas ---
class StartupCreate(BaseModel):
    # Step 1: Basic Idea
    name: str = Field(..., min_length=2)
    business_idea: str = Field(..., min_length=10)
    problem_being_solved: str = Field(..., min_length=10)
    product_description: str = Field(..., min_length=10)
    
    # Step 2: Customer
    target_customer: str
    customer_age_group: Optional[str] = "All ages"
    customer_location: Optional[str] = "India"
    business_type: str = "B2C"
    primary_customer_problem: Optional[str] = None
    
    # Step 3: Business
    industry: str
    business_model: str
    expected_pricing: Optional[str] = None
    revenue_model: Optional[str] = None
    current_competitors: Optional[str] = None
    
    # Step 4: Founder
    founder_experience: Optional[str] = None
    team_size: Optional[str] = "1"
    skills: List[str] = []
    available_budget: Optional[str] = "< ₹50,000"
    time_commitment: Optional[str] = "Part-time"
    
    # Step 5: Stage
    stage: str = "Idea"
    
    # Step 6: Goals
    goals: List[str] = []

class StartupUpdate(BaseModel):
    name: Optional[str] = None
    business_idea: Optional[str] = None
    problem_being_solved: Optional[str] = None
    product_description: Optional[str] = None
    target_customer: Optional[str] = None
    customer_age_group: Optional[str] = None
    customer_location: Optional[str] = None
    business_type: Optional[str] = None
    primary_customer_problem: Optional[str] = None
    industry: Optional[str] = None
    business_model: Optional[str] = None
    expected_pricing: Optional[str] = None
    revenue_model: Optional[str] = None
    current_competitors: Optional[str] = None
    founder_experience: Optional[str] = None
    team_size: Optional[str] = None
    skills: Optional[List[str]] = None
    available_budget: Optional[str] = None
    time_commitment: Optional[str] = None
    stage: Optional[str] = None
    goals: Optional[List[str]] = None

class StartupOut(BaseModel):
    id: int
    user_id: int
    name: str
    business_idea: str
    problem_being_solved: str
    product_description: str
    target_customer: str
    customer_age_group: Optional[str] = None
    customer_location: Optional[str] = None
    business_type: str
    primary_customer_problem: Optional[str] = None
    industry: str
    business_model: str
    expected_pricing: Optional[str] = None
    revenue_model: Optional[str] = None
    current_competitors: Optional[str] = None
    founder_experience: Optional[str] = None
    team_size: Optional[str] = None
    skills: List[str] = []
    available_budget: Optional[str] = None
    time_commitment: Optional[str] = None
    stage: str
    goals: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Idea Assessment Schemas ---
class IdeaAssessmentOut(BaseModel):
    id: int
    startup_id: int
    overall_score: float
    market_demand_score: float
    problem_strength_score: float
    feasibility_score: float
    competition_score: float
    business_model_score: float
    revenue_potential_score: float
    risk_score: float
    scalability_score: float
    strengths: List[str] = []
    weaknesses: List[str] = []
    risks: List[str] = []
    opportunities: List[str] = []
    missing_information: List[str] = []
    recommended_next_action: str
    detailed_verdict: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Roadmap Schemas ---
class RoadmapTaskOut(BaseModel):
    id: int
    stage_id: int
    startup_id: int
    title: str
    description: Optional[str] = None
    why_it_matters: Optional[str] = None
    priority: str
    estimated_time: str
    resources: List[Dict[str, Any]] = []
    status: str
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class RoadmapTaskUpdate(BaseModel):
    status: str # not_started, in_progress, completed

class RoadmapStageOut(BaseModel):
    id: int
    startup_id: int
    stage_order: int
    stage_key: str
    stage_name: str
    objective: str
    expected_outcome: str
    status: str
    tasks: List[RoadmapTaskOut] = []

    class Config:
        from_attributes = True

# --- Daily Tasks / Next Actions Schemas ---
class DailyTaskCreate(BaseModel):
    title: str
    why_it_matters: str
    step_by_step: List[str] = []
    expected_outcome: str
    priority: str = "High"
    estimated_time: str = "1-2 hours"
    category: str = "Validation"

class DailyTaskUpdate(BaseModel):
    status: Optional[str] = None # pending, completed

class DailyTaskOut(BaseModel):
    id: int
    startup_id: int
    title: str
    why_it_matters: str
    step_by_step: List[str] = []
    expected_outcome: str
    priority: str
    estimated_time: str
    status: str
    category: str
    date_assigned: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Validation Evidence Schemas ---
class ValidationEvidenceCreate(BaseModel):
    type: str # Customer Interview, Survey Results, Competitor Research, Market Experiment, MVP Test, User Feedback
    date: str
    title: str
    description: str
    result: str
    evidence: str
    decision: str = "Persevere"
    notes: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None

class ValidationEvidenceOut(BaseModel):
    id: int
    startup_id: int
    type: str
    date: str
    title: str
    description: str
    result: str
    evidence: str
    decision: str
    notes: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Mentor Chat Schemas ---
class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageOut(BaseModel):
    id: int
    startup_id: int
    user_id: int
    role: str
    content: str
    recommended_action: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

# --- Business Plan Schemas ---
class BusinessPlanUpdate(BaseModel):
    executive_summary: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    target_market: Optional[str] = None
    customer_persona: Optional[str] = None
    market_opportunity: Optional[str] = None
    competitor_analysis: Optional[str] = None
    business_model: Optional[str] = None
    revenue_model: Optional[str] = None
    marketing_strategy: Optional[str] = None
    operations: Optional[str] = None
    team: Optional[str] = None
    financial_overview: Optional[str] = None
    funding_requirement: Optional[str] = None
    risks: Optional[str] = None
    future_growth: Optional[str] = None

class BusinessPlanOut(BaseModel):
    id: int
    startup_id: int
    executive_summary: Optional[str] = None
    problem: Optional[str] = None
    solution: Optional[str] = None
    target_market: Optional[str] = None
    customer_persona: Optional[str] = None
    market_opportunity: Optional[str] = None
    competitor_analysis: Optional[str] = None
    business_model: Optional[str] = None
    revenue_model: Optional[str] = None
    marketing_strategy: Optional[str] = None
    operations: Optional[str] = None
    team: Optional[str] = None
    financial_overview: Optional[str] = None
    funding_requirement: Optional[str] = None
    risks: Optional[str] = None
    future_growth: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SectionRegenerateRequest(BaseModel):
    section_name: str
    additional_prompt: Optional[str] = None

# --- Business Document Schemas ---
class BusinessDocumentCreate(BaseModel):
    doc_type: str # pitch_deck, executive_summary, problem_statement, market_research, customer_persona, swot_analysis, marketing_plan, financial_projection, investor_pitch, startup_proposal
    custom_instructions: Optional[str] = None

class BusinessDocumentOut(BaseModel):
    id: int
    startup_id: int
    doc_type: str
    title: str
    content: str
    format: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class BusinessDocumentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

# --- Learning Resources & Legal Schemas ---
class LearningResourceOut(BaseModel):
    id: int
    title: str
    category: str
    description: str
    read_time: str
    difficulty: str
    content: str
    key_takeaways: List[str] = []
    action_steps: List[str] = []
    tags: List[str] = []

    class Config:
        from_attributes = True
