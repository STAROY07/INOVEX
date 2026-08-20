import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_flow():
    print("\n--- Starting INOVEX Backend Automated Flow Test ---")

    # 1. Health Check
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("[OK] Root endpoint online:", res.json()["tagline"])

    # 2. Signup
    signup_data = {
        "email": "testfounder@inovex.ai",
        "password": "strongpassword123",
        "full_name": "Rohan Mehta"
    }
    res = client.post("/api/auth/signup", json=signup_data)
    if res.status_code == 400:
        # User already created, login instead
        res = client.post("/api/auth/login", json={"email": signup_data["email"], "password": signup_data["password"]})
    assert res.status_code == 200, f"Auth failed: {res.text}"
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[OK] Auth signup/login succeeded. Token acquired.")

    # 3. Create Startup (Onboarding)
    startup_data = {
        "name": "AutoGST Pro",
        "business_idea": "AI copilot for Indian SMB GST invoice reconciliation and automated tax filing.",
        "problem_being_solved": "Small business owners spend 15+ hours monthly matching invoices with supplier GSTR-2B filings.",
        "product_description": "A cloud dashboard and WhatsApp bot that ingests bank statements and drafts GST returns.",
        "target_customer": "Indian SMB Retailers & Agencies",
        "customer_age_group": "25-50",
        "customer_location": "India (Tier 1 & 2)",
        "business_type": "B2B",
        "primary_customer_problem": "High CA monthly retainers and fear of GST demand notices.",
        "industry": "FinTech / SaaS",
        "business_model": "Subscription (SaaS)",
        "expected_pricing": "Rs 1,499 / month",
        "revenue_model": "SaaS recurring subscription",
        "current_competitors": "ClearTax, Masters India, manual Excel sheets",
        "founder_experience": "3 years product engineer",
        "team_size": "2 Co-founders",
        "skills": ["Coding", "Product", "Sales"],
        "available_budget": "Rs 1,00,000",
        "time_commitment": "Full-time",
        "stage": "Idea",
        "goals": ["Validate idea", "Build MVP", "Get first 20 paying customers"]
    }

    res = client.post("/api/startups", json=startup_data, headers=headers)
    assert res.status_code == 200, f"Startup creation failed: {res.text}"
    startup = res.json()
    startup_id = startup["id"]
    print(f"[OK] Startup '{startup['name']}' created successfully with ID: {startup_id}")

    # 4. Check AI Assessment
    res = client.get(f"/api/startups/{startup_id}/assessment", headers=headers)
    assert res.status_code == 200, f"Assessment failed: {res.text}"
    assessment = res.json()
    print(f"[OK] AI Assessment verified. Overall score: {assessment['overall_score']}/100. Next action: {assessment['recommended_next_action'][:60]}...")

    # 5. Check 11-Stage Roadmap
    res = client.get(f"/api/startups/{startup_id}/roadmap", headers=headers)
    assert res.status_code == 200, f"Roadmap failed: {res.text}"
    stages = res.json()
    assert len(stages) == 11, f"Expected 11 stages, got {len(stages)}"
    print(f"[OK] 11-Stage Roadmap verified. First stage: {stages[0]['stage_name']} ({len(stages[0]['tasks'])} tasks)")

    # Toggle a roadmap task
    first_task = stages[0]["tasks"][0]
    res = client.put(f"/api/startups/{startup_id}/roadmap/tasks/{first_task['id']}", json={"status": "completed"}, headers=headers)
    assert res.status_code == 200, f"Task toggle failed: {res.text}"
    assert res.json()["status"] == "completed"
    print(f"[OK] Roadmap task status toggled to completed.")

    # 6. Check Next Actions
    res = client.get(f"/api/startups/{startup_id}/actions", headers=headers)
    assert res.status_code == 200, f"Actions failed: {res.text}"
    actions = res.json()
    assert len(actions) > 0, "No actions generated"
    print(f"[OK] Prioritised actions verified ({len(actions)} actions in queue).")

    # 7. Test AI Mentor Chat
    chat_res = client.post(
        f"/api/startups/{startup_id}/mentor/chat",
        json={"content": "How should I price my SaaS product for Indian SMB retailers?"},
        headers=headers
    )
    assert chat_res.status_code == 200, f"Mentor chat failed: {chat_res.text}"
    mentor_msg = chat_res.json()
    assert len(mentor_msg["content"]) > 50, "Mentor answer too short"
    assert mentor_msg["recommended_action"] is not None
    print(f"[OK] AI Mentor responded with actionable guidance & next action: {mentor_msg['recommended_action'][:50]}...")

    # 8. Test Validation Evidence Workspace
    val_data = {
        "type": "Customer Interview",
        "date": "2026-08-20",
        "title": "Interview with Textile Merchant in Surat",
        "description": "Tested GST reconciliation pain and pricing willingness.",
        "result": "Merchant spends 4 hours every week matching E-way bills and GSTR-1.",
        "evidence": "I would pay Rs 2,000 immediately if it eliminated my CA filing delays.",
        "decision": "Persevere",
        "notes": "Follow up for beta pilot next month."
    }
    val_res = client.post(f"/api/startups/{startup_id}/validation", json=val_data, headers=headers)
    assert val_res.status_code == 200, f"Validation save failed: {val_res.text}"
    print(f"[OK] Validation Evidence record created with ID: {val_res.json()['id']}")

    # 9. Test Business Plan (16 Sections)
    bp_res = client.get(f"/api/startups/{startup_id}/bizplan", headers=headers)
    assert bp_res.status_code == 200, f"Business plan failed: {bp_res.text}"
    bp = bp_res.json()
    assert bp["executive_summary"] is not None
    assert bp["financial_overview"] is not None
    print("[OK] 16-Section Business Plan generated and verified.")

    # 10. Test Document Generation (Pitch Deck)
    doc_res = client.post(
        f"/api/startups/{startup_id}/documents/generate",
        json={"doc_type": "swot_analysis", "custom_instructions": "Focus on Indian FinTech regulations"},
        headers=headers
    )
    assert doc_res.status_code == 200, f"Doc generation failed: {doc_res.text}"
    print(f"[OK] Business Document '{doc_res.json()['title']}' generated successfully.")

    # 11. Test Legal & Compliance
    legal_res = client.get("/api/legal/structures")
    assert legal_res.status_code == 200
    assert len(legal_res.json()["structures"]) >= 4
    print("[OK] Legal structures & SPICe+ entity comparison verified.")

    print("\n=======================================================")
    print(" ALL 11 INOVEX BACKEND FLOWS PASSED SUCCESSFULLY! ")
    print("=======================================================\n")

if __name__ == "__main__":
    test_full_flow()
