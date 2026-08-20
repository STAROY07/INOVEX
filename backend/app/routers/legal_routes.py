from fastapi import APIRouter
from typing import List, Dict, Any
from ..services.seed_data import LEGAL_STRUCTURES_INFO, GOVT_SCHEMES_DIRECTORY

router = APIRouter(prefix="/api/legal", tags=["Legal, Compliance & Funding"])

@router.get("/structures")
def get_legal_structures():
    return {
        "disclaimer": "INOVEX provides general informational guidance and is not a substitute for professional legal, tax, or financial advice.",
        "structures": LEGAL_STRUCTURES_INFO
    }

@router.get("/schemes")
def get_govt_schemes():
    return {
        "disclaimer": "Funding scheme parameters are general guidelines. Eligibility is determined by respective ministry / incubator committees.",
        "schemes": GOVT_SCHEMES_DIRECTORY
    }

@router.get("/compliance-checklist")
def get_compliance_checklist():
    return [
        {
            "category": "Pre-Incorporation & Entity Setup",
            "items": [
                {"task": "Acquire Digital Signature Certificate (DSC) for all directors", "status": "recommended", "link": "https://www.mca.gov.in"},
                {"task": "Reserve Company Name on MCA RUN portal or SPICe+ Part A", "status": "mandatory"},
                {"task": "Draft Memorandum of Association (MOA) and Articles of Association (AOA)", "status": "mandatory"},
                {"task": "Apply for DIN, PAN, TAN & EPFO via SPICe+ Part B", "status": "mandatory"}
            ]
        },
        {
            "category": "Taxation & Banking",
            "items": [
                {"task": "Open Current Bank Account with corporate internet banking & UPI", "status": "mandatory"},
                {"task": "Obtain GST Registration (if turnover > ₹20L/₹40L or inter-state sales)", "status": "critical"},
                {"task": "Register for Professional Tax (state-specific requirement)", "status": "conditional"},
                {"task": "Setup TDS / TCS bookkeeping and advance tax calendar", "status": "recommended"}
            ]
        },
        {
            "category": "Government Schemes & Incentives",
            "items": [
                {"task": "Register for MSME / Udyam Certificate (100% Free on udyamregistration.gov.in)", "status": "highly_recommended"},
                {"task": "Apply for Startup India DPIIT Recognition (Tax holiday 80-IAC + SISFS access)", "status": "highly_recommended"},
                {"task": "Register on GeM Portal (Government e-Marketplace) for public procurement tenders", "status": "optional"}
            ]
        },
        {
            "category": "Intellectual Property & Data Privacy",
            "items": [
                {"task": "Perform Trademark Search on ipindiaonline.gov.in for brand name & logo", "status": "recommended"},
                {"task": "File Trademark Application (Class 9, 35, 42 commonly for software)", "status": "recommended"},
                {"task": "Draft User Privacy Policy & Terms of Service adhering to India DPDP Act 2023", "status": "critical"}
            ]
        }
    ]
