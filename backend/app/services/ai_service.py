import os
import json
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

genai_client = None
if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        genai_client = genai.GenerativeModel("gemini-1.5-flash")
        logger.info("Google Gemini AI client successfully initialized.")
    except Exception as e:
        logger.warning(f"Failed to initialize Gemini client: {e}")

class AIService:
    @staticmethod
    def _call_gemini_json(prompt: str) -> Optional[Dict[str, Any]]:
        if not genai_client:
            return None
        try:
            response = genai_client.generate_content(
                f"You are the INOVEX AI Startup Engine. Respond ONLY with valid JSON. Do not include markdown code block formatting like ```json ... ``` if possible, or ensure it is strictly parseable JSON.\n\n{prompt}"
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            if raw_text.startswith("```"):
                raw_text = raw_text[3:]
            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]
            return json.loads(raw_text.strip())
        except Exception as e:
            logger.warning(f"Gemini JSON generation failed, falling back to heuristic engine: {e}")
            return None

    @staticmethod
    def _call_gemini_text(prompt: str) -> Optional[str]:
        if not genai_client:
            return None
        try:
            response = genai_client.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.warning(f"Gemini text generation failed, falling back to heuristic engine: {e}")
            return None

    @classmethod
    def generate_idea_assessment(cls, startup: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates an honest, multi-dimensional assessment of the startup idea.
        Scores: 0-100 for Market Demand, Problem Strength, Feasibility, Competition,
        Business Model, Revenue Potential, Risk (100 = low risk/safe), Scalability.
        """
        prompt = f"""
        Analyze this startup idea objectively and honestly for the Indian & global market:
        Startup Name: {startup.get('name')}
        Idea: {startup.get('business_idea')}
        Problem: {startup.get('problem_being_solved')}
        Product/Service: {startup.get('product_description')}
        Target Customer: {startup.get('target_customer')} ({startup.get('business_type')}) in {startup.get('customer_location')}
        Industry: {startup.get('industry')}
        Business Model: {startup.get('business_model')}
        Expected Pricing: {startup.get('expected_pricing')}
        Competitors: {startup.get('current_competitors')}
        Founder Experience: {startup.get('founder_experience')}
        Team Size: {startup.get('team_size')}
        Budget: {startup.get('available_budget')}
        Time Commitment: {startup.get('time_commitment')}
        Stage: {startup.get('stage')}
        Goals: {startup.get('goals')}

        Return a JSON object with:
        {{
            "overall_score": float (0-100),
            "market_demand_score": float (0-100),
            "problem_strength_score": float (0-100),
            "feasibility_score": float (0-100),
            "competition_score": float (0-100),
            "business_model_score": float (0-100),
            "revenue_potential_score": float (0-100),
            "risk_score": float (0-100, where 100 means low risk),
            "scalability_score": float (0-100),
            "strengths": [list of 3-5 specific strengths],
            "weaknesses": [list of 3-5 critical, honest weaknesses],
            "risks": [list of 3-4 market, regulatory or execution risks],
            "opportunities": [list of 3-4 expansion or differentiation opportunities],
            "missing_information": [list of 2-3 blindspots or untested assumptions],
            "recommended_next_action": "One concrete next action the founder must take this week.",
            "detailed_verdict": "2-3 paragraphs providing an honest executive summary of feasibility and hurdles."
        }}
        """
        gemini_result = cls._call_gemini_json(prompt)
        if gemini_result and "overall_score" in gemini_result:
            return gemini_result

        # Heuristic Generator: Realistic, custom, and nuanced assessment based on startup inputs
        name = startup.get("name", "Your Startup")
        industry = startup.get("industry", "Technology")
        model = startup.get("business_model", "Subscription")
        btype = startup.get("business_type", "B2C")
        budget = startup.get("available_budget", "< ₹50,000")
        target_cust = startup.get("target_customer", "Consumers")
        stage = startup.get("stage", "Idea")

        # Dynamic score calibration
        base_demand = 74.0 if btype in ["B2B", "B2B2C"] else 68.0
        if "AI" in industry or "FinTech" in industry or "Health" in industry or "SaaS" in industry:
            base_demand += 8.0
        
        prob_score = 78.0 if len(startup.get("problem_being_solved", "")) > 40 else 62.0
        feas_score = 72.0 if "50,000" not in budget or btype == "B2C" else 65.0
        comp_score = 60.0 # Competition is fierce in modern markets
        biz_score = 75.0 if model in ["Subscription", "Commission", "Direct Sales"] else 68.0
        rev_score = 73.0
        risk_score = 62.0 # Higher risk for early stage ideas
        scale_score = 80.0 if btype in ["B2B", "B2B2C"] or "Platform" in model or "SaaS" in industry else 70.0
        
        overall = round((base_demand + prob_score + feas_score + comp_score + biz_score + rev_score + risk_score + scale_score) / 8.0, 1)

        strengths = [
            f"Clear target segment identified ({target_cust}) with specific operational focus in {industry}.",
            f"Selected business model ({model}) offers predictable recurring cash flow if unit economics hold.",
            f"High market expansion potential across Tier-1 and Tier-2 Indian cities as digital adoption matures.",
            f"Initial focus on solving a defined pain point rather than building an overly broad tool."
        ]

        weaknesses = [
            f"Customer acquisition cost (CAC) in {industry} could rapidly outpace initial lifetime value (LTV) without organic viral loops.",
            f"Current budget ({budget}) requires extreme frugality; custom tech development must be deferred in favor of no-code / MVP validation.",
            "Lack of documented primary customer interviews; value proposition is currently based on founder assumptions.",
            f"Competitive defensibility (moat) against incumbent players in {industry} is currently low."
        ]

        risks = [
            f"High switching cost friction: {target_cust} may prefer their existing informal/manual habits over adopting new software.",
            "Regulatory & Compliance risk: Indian GST registration, DPDP Act (data protection) adherence, and payment gateway compliance required prior to commercial launch.",
            "Execution bottleneck: Building without early pre-orders or letters of intent (LOIs) risks building features users won't pay for."
        ]

        opportunities = [
            f"Target niche sub-segments within {target_cust} that are underserved by large generic legacy players.",
            "Leverage WhatsApp Business API and UPI integration for zero-friction user onboarding in India.",
            "Apply for government incentives like Startup India Seed Fund Scheme (SISFS) and MSME CGTMSE collateral-free loans once validation is proven."
        ]

        missing_info = [
            f"Willingness-to-pay benchmark: How much do {target_cust} currently spend to solve this pain point?",
            "Exact unit economics breakdown (Cost per Acquisition vs. Net Margin per transaction).",
            "Customer retention/churn hypotheses over a 30-day and 90-day window."
        ]

        next_action = f"Conduct 10 structured 15-minute customer problem interviews with target {target_cust} within the next 5 days. Ask about their current workaround and do NOT pitch your solution until they confirm the pain point is top-3 for them."

        verdict = f"{name} presents a compelling initial thesis in the {industry} sector with promising market timing. However, entering as a {stage}-stage venture with a {budget} budget means premature coding or marketing spend will be fatal. The immediate priority is not building software, but rigorously validating problem resonance and willingness to pay among {target_cust}. If you prove 5+ customers are actively seeking a solution, your feasibility score will surge into the 85+ range."

        return {
            "overall_score": overall,
            "market_demand_score": base_demand,
            "problem_strength_score": prob_score,
            "feasibility_score": feas_score,
            "competition_score": comp_score,
            "business_model_score": biz_score,
            "revenue_potential_score": rev_score,
            "risk_score": risk_score,
            "scalability_score": scale_score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "risks": risks,
            "opportunities": opportunities,
            "missing_information": missing_info,
            "recommended_next_action": next_action,
            "detailed_verdict": verdict
        }

    @classmethod
    def generate_startup_roadmap(cls, startup: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates the 11-stage personalized startup roadmap.
        Stages:
        1. Idea
        2. Problem Validation
        3. Market Research
        4. Customer Validation
        5. Business Model
        6. MVP
        7. Testing
        8. Launch
        9. Early Customers
        10. Funding
        11. Growth
        """
        name = startup.get("name", "Startup")
        industry = startup.get("industry", "Tech")
        target_cust = startup.get("target_customer", "Target Customers")
        btype = startup.get("business_type", "B2C")
        current_stage = startup.get("stage", "Idea").lower()

        stages_template = [
            {
                "stage_order": 1,
                "stage_key": "idea",
                "stage_name": "Idea Clarification & Scoping",
                "objective": "Articulate the core value proposition, problem boundaries, and unique angle.",
                "expected_outcome": "A single-page Lean Canvas and a clear elevator pitch.",
                "tasks": [
                    {
                        "title": f"Complete Lean Canvas for {name}",
                        "description": "Map out problem, solution, unique value proposition, unfair advantage, customer segments, channels, revenue streams, and cost structure.",
                        "why_it_matters": "Prevents building blind and exposes critical operational assumptions early.",
                        "priority": "High",
                        "estimated_time": "1-2 days",
                        "resources": [{"name": "Lean Canvas Template", "url": "https://leanstack.com/lean-canvas"}]
                    },
                    {
                        "title": "Define 3 Core Hypotheses to Disprove",
                        "description": "Write down the 3 assumptions that, if wrong, will kill your business idea.",
                        "why_it_matters": "Startups fail by confirming biases. Actively search for fatal flaws before spending money.",
                        "priority": "High",
                        "estimated_time": "3 hours",
                        "resources": [{"name": "The Mom Test Summary", "url": "http://momtestbook.com"}]
                    }
                ]
            },
            {
                "stage_order": 2,
                "stage_key": "problem_validation",
                "stage_name": "Problem Validation & Discovery",
                "objective": f"Verify that {target_cust} actively suffer from this problem and urgently want a solution.",
                "expected_outcome": "10-15 recorded problem interviews with identified common pain patterns.",
                "tasks": [
                    {
                        "title": f"Interview 10 {target_cust} without pitching",
                        "description": "Use Mom Test framework: Ask about past behavior ('When was the last time you faced X?') rather than future opinions ('Would you buy this?').",
                        "why_it_matters": "Guarantees you are solving a genuine hair-on-fire problem.",
                        "priority": "High",
                        "estimated_time": "4-6 days",
                        "resources": [{"name": "Customer Discovery Interview Guide", "url": "https://www.ycombinator.com/library"}]
                    },
                    {
                        "title": "Document Existing Workarounds & Budgets",
                        "description": "Find out what tools, spreadsheets, or manual methods they currently spend money/time on.",
                        "why_it_matters": "If they aren't currently spending time or money solving it, the problem is not painful enough.",
                        "priority": "Medium",
                        "estimated_time": "2 days",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 3,
                "stage_key": "market_research",
                "stage_name": "Market Sizing & Competitor Intelligence",
                "objective": "Calculate TAM/SAM/SOM for India/Global and analyze direct & indirect competitors.",
                "expected_outcome": "Competitor teardown matrix and bottom-up market size estimate.",
                "tasks": [
                    {
                        "title": f"Build Competitor Teardown Matrix for {industry}",
                        "description": "List top 4 competitors, their pricing models, user reviews, 1-star complaints, and feature gaps.",
                        "why_it_matters": "Competitor 1-star reviews are your roadmap for differentiation.",
                        "priority": "High",
                        "estimated_time": "2 days",
                        "resources": [{"name": "G2 / Capterra / PlayStore Reviews", "url": "https://www.g2.com"}]
                    },
                    {
                        "title": "Calculate Bottom-Up Market Size (SOM in India)",
                        "description": "Formula: Number of target customers you can realistically reach in Year 1 × Annual Price.",
                        "why_it_matters": "Avoids fake trillion-dollar top-down figures; grounds your financial model.",
                        "priority": "Medium",
                        "estimated_time": "1 day",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 4,
                "stage_key": "customer_validation",
                "stage_name": "Customer & Offer Validation",
                "objective": "Validate willingness to pay through pre-orders, letters of intent, or waiting list signups.",
                "expected_outcome": "At least 25 waitlist signups or 3 letters of intent (LOIs) with pricing commitments.",
                "tasks": [
                    {
                        "title": "Launch a High-Converting Smoke-Test Landing Page",
                        "description": f"Create a simple one-page site with your value proposition for {name} and a 'Request Early Access' email capture.",
                        "why_it_matters": "Measures actual conversion intent rather than polite verbal encouragement.",
                        "priority": "High",
                        "estimated_time": "2-3 days",
                        "resources": [{"name": "Landing Page Optimization", "url": "https://cxl.com"}]
                    },
                    {
                        "title": "Drive 100 Targeted Visitors via Organic Communities",
                        "description": "Post insights (not spam) in niche LinkedIn groups, Reddit subreddits, or WhatsApp entrepreneur groups.",
                        "why_it_matters": "Tests if your headline and messaging resonate with real prospects.",
                        "priority": "High",
                        "estimated_time": "3-4 days",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 5,
                "stage_key": "business_model",
                "stage_name": "Unit Economics & Business Architecture",
                "objective": "Define pricing tiers, cost of goods/services, customer acquisition channels, and margins.",
                "expected_outcome": "Validated pricing sheet and gross margin projection > 65%.",
                "tasks": [
                    {
                        "title": f"Establish Pricing Structure ({startup.get('business_model', 'Subscription')})",
                        "description": "Design Starter, Pro, and Enterprise tiers or commission brackets based on value metric.",
                        "why_it_matters": "Pricing is your fastest lever for profitability and cash-flow health.",
                        "priority": "High",
                        "estimated_time": "2 days",
                        "resources": [{"name": "Price Intelligently SaaS Pricing Guide", "url": "https://www.paddle.com"}]
                    },
                    {
                        "title": "Map Customer Acquisition Channels (CAC Plan)",
                        "description": "Identify primary channel: Cold Outbound (B2B), Content/SEO, Meta/Google Ads, or Channel Partnerships.",
                        "why_it_matters": "A great product without a repeatable distribution channel will die.",
                        "priority": "Medium",
                        "estimated_time": "2 days",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 6,
                "stage_key": "mvp",
                "stage_name": "Minimum Viable Product (MVP) Build",
                "objective": "Build the smallest possible functional product that solves the #1 primary pain point.",
                "expected_outcome": "A working MVP ready for pilot testing with 5-10 friendly users.",
                "tasks": [
                    {
                        "title": "Define MVP Feature Cut (Must-Have vs. Nice-to-Have)",
                        "description": "Strip away 70% of planned features. Keep only the single workflow that delivers the core 'Aha!' moment.",
                        "why_it_matters": "Shortens time-to-market from months to weeks and protects precious founder capital.",
                        "priority": "High",
                        "estimated_time": "1 day",
                        "resources": []
                    },
                    {
                        "title": "Build Functional Prototype / No-Code MVP",
                        "description": "Develop core flow using React/FastAPI or No-Code tools (Airtable, Bubble, WhatsApp bot) to start testing immediately.",
                        "why_it_matters": "Gets real software into users' hands for instant feedback.",
                        "priority": "High",
                        "estimated_time": "2-3 weeks",
                        "resources": [{"name": "MVP Building Strategies", "url": "https://www.ycombinator.com"}]
                    }
                ]
            },
            {
                "stage_order": 7,
                "stage_key": "testing",
                "stage_name": "Closed Beta & Usability Testing",
                "objective": "Conduct end-to-end user tests with 10 beta testers and eliminate onboarding friction.",
                "expected_outcome": "Recorded usability sessions and 0 critical blockers remaining.",
                "tasks": [
                    {
                        "title": "Onboard 5-10 Beta Testers 1-on-1 on Google Meet",
                        "description": "Watch them sign up and use the product without giving hints. Note where they hesitate or get confused.",
                        "why_it_matters": "Reveals UX blindspots that analytics dashboards never show.",
                        "priority": "High",
                        "estimated_time": "1 week",
                        "resources": []
                    },
                    {
                        "title": "Establish Bug Tracking & Feedback Mechanism",
                        "description": "Integrate in-app feedback (Crisp, Tawk.to or simple Google Form) for instant bug reports.",
                        "why_it_matters": "Ensures early bugs are squashed before public release.",
                        "priority": "Medium",
                        "estimated_time": "1 day",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 8,
                "stage_key": "launch",
                "stage_name": "Public Launch & Legal Setup (India)",
                "objective": "Launch publicly, setup legal entity (LLP/Pvt Ltd), GST, and announce across channels.",
                "expected_outcome": "Registered business entity, live payment gateway, and public launch campaign executed.",
                "tasks": [
                    {
                        "title": "Incorporate Entity (LLP or Pvt Ltd) & Open Current Bank Account",
                        "description": "Use SPICe+ on MCA portal or legal service; obtain PAN, TAN, and current account with UPI integration.",
                        "why_it_matters": "Enables legal contracts, invoicing, liability protection, and payment gateway activation.",
                        "priority": "High",
                        "estimated_time": "7-10 days",
                        "resources": [{"name": "MCA SPICe+ Portal", "url": "https://www.mca.gov.in"}]
                    },
                    {
                        "title": "Integrate Indian Payment Gateway (Razorpay / Cashfree / Stripe India)",
                        "description": "Complete KYC, integrate checkout flow, and configure webhook listeners for automated billing.",
                        "why_it_matters": "Enables frictionless collection of payments via UPI, Cards, NetBanking, and EMIs.",
                        "priority": "High",
                        "estimated_time": "3 days",
                        "resources": [{"name": "Razorpay Docs", "url": "https://razorpay.com/docs"}]
                    },
                    {
                        "title": "Launch on Product Hunt, LinkedIn & Founder Networks",
                        "description": "Coordinate a launch day push with clear value screenshots, a founder video story, and introductory pricing.",
                        "why_it_matters": "Generates initial traffic spike and early social proof.",
                        "priority": "Medium",
                        "estimated_time": "3 days",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 9,
                "stage_key": "early_customers",
                "stage_name": "Early Customers & Retention Mastery",
                "objective": "Acquire first 50 paying customers and achieve >40% 30-day retention / NPS > 50.",
                "expected_outcome": "Consistent paying customer base and positive testimonials.",
                "tasks": [
                    {
                        "title": "Concierge Onboarding for First 25 Customers",
                        "description": "Personally assist every new paying customer to ensure they achieve immediate success with your product.",
                        "why_it_matters": "High touch creates passionate brand advocates and reduces early churn to near zero.",
                        "priority": "High",
                        "estimated_time": "2 weeks",
                        "resources": [{"name": "Do Things That Don't Scale (Paul Graham)", "url": "http://paulgraham.com/ds.html"}]
                    },
                    {
                        "title": "Collect 5 In-Depth Video/Text Testimonials",
                        "description": "Interview happy customers about their before-and-after results and feature them on your website.",
                        "why_it_matters": "Social proof dramatically lowers CAC for future prospects.",
                        "priority": "High",
                        "estimated_time": "1 week",
                        "resources": []
                    }
                ]
            },
            {
                "stage_order": 10,
                "stage_key": "funding",
                "stage_name": "DPIIT Recognition & Funding Strategy",
                "objective": "Apply for Startup India DPIIT recognition, SISFS grant, or raise Angel round.",
                "expected_outcome": "DPIIT Certificate, pitch deck, and investor pipeline tracker.",
                "tasks": [
                    {
                        "title": "Register on Startup India Portal for DPIIT Recognition",
                        "description": "Avail 3-year income tax exemption (80-IAC eligibility), fast-track patent review, and access to SISFS seed grants.",
                        "why_it_matters": "Unlocks official government startup benefits and tax exemptions in India.",
                        "priority": "High",
                        "estimated_time": "3-5 days",
                        "resources": [{"name": "Startup India Portal", "url": "https://www.startupindia.gov.in"}]
                    },
                    {
                        "title": "Prepare 12-Slide Seed Pitch Deck & Data Room",
                        "description": "Include Traction, Unit Economics, Team, Market Opportunity, Financial Forecast, and Use of Funds.",
                        "why_it_matters": "Professional investor communication is mandatory for institutional capital.",
                        "priority": "High",
                        "estimated_time": "1 week",
                        "resources": [{"name": "Sequoia Capital Pitch Deck Template", "url": "https://www.sequoiacap.com"}]
                    }
                ]
            },
            {
                "stage_order": 11,
                "stage_key": "growth",
                "stage_name": "Scale Channels & Team Expansion",
                "objective": "Scale profitable acquisition channels, optimize funnel, and hire core functional leads.",
                "expected_outcome": "Month-on-Month growth > 15% and predictable flywheel.",
                "tasks": [
                    {
                        "title": "Double Down on #1 Performing Distribution Channel",
                        "description": "Reinvest profits into the single channel yielding lowest CAC and highest LTV.",
                        "why_it_matters": "Focus wins in growth; avoid spreading marketing budget across too many experiments.",
                        "priority": "High",
                        "estimated_time": "Ongoing",
                        "resources": []
                    },
                    {
                        "title": "Setup Automated Weekly KPI Dashboard",
                        "description": "Track MRR/ARR, Net Retention, CAC Payback Period, Churn Rate, and Runway monthly.",
                        "why_it_matters": "Data-driven governance keeps the company solvent and investor-ready.",
                        "priority": "High",
                        "estimated_time": "2 days",
                        "resources": []
                    }
                ]
            }
        ]

        return stages_template

    @classmethod
    def answer_mentor_query(cls, startup: Dict[str, Any], conversation_history: List[Dict[str, str]], query: str) -> Dict[str, str]:
        """
        AI Startup Mentor answer. Contextualized to the startup, stage, industry, and goals.
        Includes a mandatory 'recommended_action' field.
        """
        name = startup.get("name", "your startup")
        industry = startup.get("industry", "Technology")
        model = startup.get("business_model", "Subscription")
        stage = startup.get("stage", "Idea")
        target_cust = startup.get("target_customer", "target users")
        budget = startup.get("available_budget", "< ₹50,000")

        history_context = "\n".join([f"{msg.get('role', 'user').upper()}: {msg.get('content', '')}" for msg in conversation_history[-6:]])

        prompt = f"""
        You are INOVEX AI Startup Mentor, a world-class startup advisor specifically mentoring Indian and global early-stage founders.
        Startup Context:
        - Name: {name}
        - Industry: {industry}
        - Target Customer: {target_cust} ({startup.get('business_type')})
        - Business Model: {model}
        - Current Stage: {stage}
        - Available Budget: {budget}
        - Primary Problem Solved: {startup.get('problem_being_solved')}
        - Goals: {startup.get('goals')}

        Conversation History:
        {history_context}

        Founder Query: {query}

        Provide a structured, deeply practical, actionable answer tailored specifically to {name}.
        Do NOT give vague textbook generalities. Give concrete numbers, exact Indian context (e.g. UPI, GST, Razorpay, MCA, DPDP Act, Tier-1/2 dynamics) where relevant.
        At the end, you MUST provide a single high-priority 'recommended_action' for this week.

        Return JSON format:
        {{
            "answer": "Markdown formatted comprehensive answer with bullet points, bold key terms, and step-by-step guidance.",
            "recommended_action": "One specific, concise action the founder should take immediately."
        }}
        """

        gemini_result = cls._call_gemini_json(prompt)
        if gemini_result and "answer" in gemini_result:
            return {
                "answer": gemini_result["answer"],
                "recommended_action": gemini_result.get("recommended_action", "Review your customer interview notes and update your value proposition.")
            }

        # Dynamic Fallback Heuristic Generator for Mentor
        q_lower = query.lower()
        
        if "price" in q_lower or "pricing" in q_lower or "cost" in q_lower or "charge" in q_lower:
            answer = f"""### Pricing Strategy for **{name}** ({model} Model)

When pricing in the **{industry}** sector in India, early-stage founders frequently make the mistake of undercharging out of fear. Here is how to structure your pricing:

1. **Value-Metric Alignment**:
   - Charge based on the value metric that scales with customer success (e.g., *per active user*, *per transaction volume*, or *per monthly workflow completed*).
   - For **{target_cust}**, avoid complicated multi-tier matrices initially. Offer a straightforward **Single Plan** or a simple **2-Tier Structure (Starter & Pro)**.

2. **Price Anchoring & Indian Market Dynamics**:
   - If selling **B2B in India**, pricing below ₹1,000/month often triggers skepticism about reliability, while pricing above ₹10,000/month requires multi-stakeholder procurement approval.
   - Ideal Sweet Spot: **₹1,499 to ₹4,999/month** for SMBs; for consumer apps (B2C), micro-pricing via UPI AutoPay at **₹199 to ₹499/month** reduces checkout friction.

3. **Annual Pre-pay Incentive**:
   - Offer 2 months free (e.g. ₹9,999/year) to collect upfront cash flow, helping finance operations without giving away equity.

4. **Grandfathering Early Adopters**:
   - Offer your first 10 beta users a *"Founder's Club Lifetime 40% Discount"* in exchange for weekly feedback and a video testimonial."""
            rec_action = f"Draft your 2 pricing tiers on a simple PDF or notion doc and present it to the next 3 {target_cust} you speak with to test willingness to pay."

        elif "first customer" in q_lower or "customer" in q_lower or "get user" in q_lower or "marketing" in q_lower:
            answer = f"""### Acquiring Your First 10–50 Customers for **{name}**

At the **{stage}** stage with a **{budget}** budget, **do not waste money on generic Facebook or Google ads**. Paid ads without a validated funnel burn cash. Instead, execute high-leverage organic distribution:

1. **Direct Outreach (The Non-Scalable Way)**:
   - Identify 50 high-probability {target_cust} on LinkedIn or relevant industry directories.
   - Reach out with personalized value: *"Hey [Name], I noticed you deal with [specific problem]. We're building a lightweight tool for {industry} founders and wanted to give you free early access in exchange for 10 minutes of feedback."*

2. **Watering Hole Strategy**:
   - Where do {target_cust} hang out online in India? (Niche WhatsApp groups, Slack/Discord communities, Twitter/X tech circles, Reddit r/developersIndia / r/StartUpIndia).
   - Share actionable teardowns and solutions to their common problems—position yourself as a domain expert first.

3. **Incentivized Referral Loops**:
   - Give existing users extended premium access or credits when they invite a colleague."""
            rec_action = f"Send 15 direct personalized LinkedIn/Email outreach messages to target {target_cust} today."

        elif "mvp" in q_lower or "build" in q_lower or "develop" in q_lower or "tech" in q_lower:
            answer = f"""### Building an MVP for **{name}** Without Over-Engineering

Your goal is to reach the **'Aha!' moment** in the fewest number of clicks possible.

1. **Ruthless Feature Elimination**:
   - Strip away nice-to-have items like dark mode, complex role permissions, social logins, or multi-language support.
   - Focus exclusively on the primary job-to-be-done for {target_cust}.

2. **Tech Stack Recommendation**:
   - **Frontend**: React + Tailwind CSS (fast, modern, responsive).
   - **Backend**: FastAPI (Python) or Node.js with SQLite / PostgreSQL.
   - **Authentication**: JWT tokens or Supabase Auth.
   - **Payments**: Razorpay Standard Checkout (supports UPI, NetBanking, Cards).

3. **Timebox to 14 Days**:
   - If an MVP takes longer than 3 weeks to deploy to staging, the scope is too broad. Build the bare essential workflow and test live."""
            rec_action = "Write down the exact 3 screens required for your core MVP workflow and discard everything else for V1."

        elif "register" in q_lower or "legal" in q_lower or "company" in q_lower or "llp" in q_lower or "pvt ltd" in q_lower:
            answer = f"""### Legal & Entity Guidance for **{name}** in India

*Disclaimer: INOVEX provides general informational guidance and is not a substitute for professional legal, tax, or chartered accountant advice.*

1. **Which Entity Structure Fits Best?**
   - **Private Limited Company (Pvt Ltd)**: Best if you plan to raise venture capital or angel investment, issue ESOPs to employees, or have multiple co-founders.
   - **Limited Liability Partnership (LLP)**: Best for bootstrap founders seeking limited liability with significantly lower annual compliance burden and no minimum capital requirement.
   - **Sole Proprietorship**: Quickest to start for solo testing, but carries unlimited personal liability.

2. **Key Registrations Checklist**:
   - **SPICe+ Form** on MCA portal (incorporates name, PAN, TAN, EPFO, ESIC in one go).
   - **GST Registration**: Mandatory if turnover exceeds ₹40 Lakhs (goods) or ₹20 Lakhs (services), or for inter-state e-commerce / software sales.
   - **MSME / Udyam Certificate**: Free government portal, provides access to priority bank lending and collateral-free credit schemes.
   - **DPIIT Startup India Recognition**: Grants Section 80-IAC tax holiday eligibility and access to SISFS grants."""
            rec_action = "Assess whether you plan to raise equity funding within 12 months (choose Pvt Ltd) or bootstrap (choose LLP)."

        else:
            answer = f"""### Strategic Guidance for **{name}**

Based on your current status (**{stage}** stage in **{industry}**):

1. **Core Focus**:
   - Your number one job right now is reducing uncertainty. Every startup is a bundle of unproven assumptions until real customers validate them with time or money.

2. **Action Plan for {target_cust}**:
   - Clarify the value proposition: What is the 10x improvement you offer over their current alternative?
   - Focus on retention over top-of-funnel vanity metrics. 10 users who love your product are vastly superior to 1,000 who log in once and abandon.

3. **Execution Guardrails**:
   - Keep monthly burn near zero until you achieve demonstrable product-market signal.
   - Review your validation records weekly and adapt your roadmap tasks accordingly."""
            rec_action = f"Identify the single biggest bottleneck preventing {name} from getting its next paying customer."

        return {
            "answer": answer,
            "recommended_action": rec_action
        }

    @classmethod
    def generate_business_plan(cls, startup: Dict[str, Any]) -> Dict[str, str]:
        """
        Generates a comprehensive 16-section Business Plan.
        """
        name = startup.get("name", "Startup")
        idea = startup.get("business_idea", "Business Idea")
        problem = startup.get("problem_being_solved", "Problem Statement")
        product = startup.get("product_description", "Product Description")
        target_cust = startup.get("target_customer", "Target Customers")
        industry = startup.get("industry", "Technology")
        model = startup.get("business_model", "Subscription")
        pricing = startup.get("expected_pricing", "Tiered pricing")
        btype = startup.get("business_type", "B2C")
        budget = startup.get("available_budget", "Seed")

        prompt = f"""
        Generate a complete, professional, investor-grade 16-section Business Plan for:
        Startup Name: {name}
        Industry: {industry}
        Business Idea: {idea}
        Problem: {problem}
        Product/Service: {product}
        Target Customer: {target_cust} ({btype})
        Business Model: {model}
        Expected Pricing: {pricing}
        Budget: {budget}

        Return a JSON object containing strings for each of the 16 sections:
        {{
            "executive_summary": "...",
            "problem": "...",
            "solution": "...",
            "target_market": "...",
            "customer_persona": "...",
            "market_opportunity": "...",
            "competitor_analysis": "...",
            "business_model": "...",
            "revenue_model": "...",
            "marketing_strategy": "...",
            "operations": "...",
            "team": "...",
            "financial_overview": "...",
            "funding_requirement": "...",
            "risks": "...",
            "future_growth": "..."
        }}
        """

        gemini_result = cls._call_gemini_json(prompt)
        if gemini_result and "executive_summary" in gemini_result:
            return gemini_result

        # Structured Business Plan Generator
        return {
            "executive_summary": f"**{name}** is an innovative {industry} venture founded to solve critical friction for {target_cust}. By offering {product}, the company replaces fragmented, inefficient alternatives with a streamlined, scalable digital solution. Operating on a robust {model} model, {name} is positioned to capture substantial market share across India and emerging global markets through high capital efficiency and organic distribution channels.",
            
            "problem": f"Current solutions in the {industry} sector suffer from high costs, steep learning curves, and lack of integration. Specifically, {target_cust} face: 1) {problem}; 2) Heavy reliance on disjointed manual workarounds; 3) Prohibitive pricing from legacy enterprise incumbents that exclude SMBs and modern digital natives.",
            
            "solution": f"{name} introduces a modern, end-to-end platform tailored specifically for {target_cust}. Key differentiators include: 1) {product}; 2) Intuitive zero-configuration onboarding; 3) Seamless local ecosystem integrations (UPI, GST compliance, localized workflows); 4) High-velocity execution ensuring superior customer ROI within the first 30 days.",
            
            "target_market": f"The primary addressable market consists of {target_cust} operating in India's rapidly modernizing digital economy. The market spans early adopters across Tier-1 metropolitan hubs (Bengaluru, Mumbai, Delhi-NCR, Hyderabad) expanding into fast-growing Tier-2 urban clusters with burgeoning digital consumption.",
            
            "customer_persona": f"**Primary Persona**: 'The Driven Operator' — Age 22–45, tech-literate professional or founder in {industry}. Goals: Eliminate operational chaos, increase revenue throughput, and automate repetitive tasks. Pain points: Lack of time, fear of non-compliance, and frustration with bloated legacy software.",
            
            "market_opportunity": f"The overall {industry} market in India is expanding at a CAGR exceeding 22%, driven by widespread digital infrastructure (Jio, UPI, ONDC, cloud adoption). Total Addressable Market (TAM) is estimated at $4.2B nationally, with a Serviceable Addressable Market (SAM) of $650M and a Year 1-2 Serviceable Obtainable Market (SOM) of $12M.",
            
            "competitor_analysis": f"Competitor landscape consists of: 1) Traditional Legacy Tools (expensive, rigid, slow support); 2) Global SaaS Platforms (lack Indian payment & regulatory compliance, priced in USD); 3) Informal Spreadsheets/Manual processes. **{name}'s Unfair Advantage**: Hyper-localized features, 4x faster implementation, and accessible Indian-rupee pricing.",
            
            "business_model": f"The company monetizes via a {model} architecture. Tiered plans incentivize organic expansion as client workload increases. High gross margins (>75%) enable strong cash-flow reinvestment into product development and targeted customer acquisition.",
            
            "revenue_model": f"Primary Revenue Streams: 1) Recurring monthly/annual subscription fees ({pricing}); 2) Value-added premium add-ons and analytics modules; 3) Enterprise customization and dedicated support tiers for high-volume enterprise accounts.",
            
            "marketing_strategy": f"Multi-channel Go-To-Market (GTM) strategy: 1) Product-Led Growth (PLG) with frictionless trial tiers; 2) Founder-led thought leadership and community building on LinkedIn/YouTube; 3) Strategic B2B partnerships and micro-influencer co-marketing; 4) Programmatic SEO targeting high-intent long-tail search terms.",
            
            "operations": f"Lightweight, cloud-native architecture hosted on secure cloud infrastructure ensuring 99.9% uptime, end-to-end data encryption, and DPDP Act compliance. Agile 2-week sprint cycles with continuous customer feedback loops.",
            
            "team": f"Led by founder(s) with deep passion and hands-on skills in {industry}. The operational roadmap includes hiring a senior full-stack lead, a product marketer, and dedicated customer success onboarding specialists within the next 6-12 months.",
            
            "financial_overview": f"Year 1 Projections: Focus on reaching break-even with 250 active paying customers, achieving Annual Recurring Revenue (ARR) of ₹45 Lakhs with gross margins exceeding 70%. Year 2 Target: ₹1.8 Cr ARR driven by referral flywheels and expanded enterprise tiers.",
            
            "funding_requirement": f"Currently seeking initial seed/angel investment of ₹25 Lakhs to ₹50 Lakhs (or non-dilutive grant capital via Startup India SISFS). Allocation: 50% Product Engineering & AI infrastructure, 30% Growth & Customer Acquisition, 20% Working Capital & Regulatory Compliance.",
            
            "risks": f"1) **Adoption Inertia**: Mitigated by providing 1-click migration and concierge onboarding; 2) **Incumbent Replication**: Mitigated by high product velocity and proprietary customer data moats; 3) **Regulatory Evolution**: Mitigated by retaining proactive chartered accountancy and legal counsel.",
            
            "future_growth": f"Phase 1 (Months 1–6): Validate core MVP and establish repeatable sales funnel. Phase 2 (Months 7–18): Expand product footprint across Southeast Asia & MENA markets. Phase 3 (Year 2+): Launch developer API ecosystem and marketplace integrations."
        }

    @classmethod
    def regenerate_business_plan_section(cls, startup: Dict[str, Any], current_plan: Dict[str, Any], section_name: str, additional_prompt: Optional[str] = None) -> str:
        prompt = f"""
        Regenerate the '{section_name}' section for the business plan of {startup.get('name')}.
        Context:
        Startup Idea: {startup.get('business_idea')}
        Industry: {startup.get('industry')}
        Target Customer: {startup.get('target_customer')}
        Additional Instructions: {additional_prompt or 'Make it detailed, realistic, investor-ready and tailored to India/global market.'}

        Return ONLY the regenerated section text in clear markdown format.
        """
        gemini_result = cls._call_gemini_text(prompt)
        if gemini_result:
            return gemini_result
        
        # Fallback to regenerated section
        full_plan = cls.generate_business_plan(startup)
        base_text = full_plan.get(section_name, f"Updated detailed strategy for {section_name} of {startup.get('name')}.")
        if additional_prompt:
            base_text += f"\n\n*Updated with special focus on*: {additional_prompt}"
        return base_text

    @classmethod
    def generate_document(cls, startup: Dict[str, Any], doc_type: str, custom_instructions: Optional[str] = None) -> Dict[str, str]:
        """
        Generates startup documents: pitch_deck, executive_summary, problem_statement,
        market_research, customer_persona, swot_analysis, marketing_plan, financial_projection.
        """
        name = startup.get("name", "Startup")
        idea = startup.get("business_idea", "Idea")
        industry = startup.get("industry", "Tech")
        target_cust = startup.get("target_customer", "Users")
        btype = startup.get("business_type", "B2C")

        doc_titles = {
            "pitch_deck": f"{name} — 10-Slide Investor Pitch Deck",
            "executive_summary": f"{name} — Executive Summary One-Pager",
            "problem_statement": f"{name} — Comprehensive Problem Statement & Market Friction",
            "market_research": f"{name} — Market Research & Competitor Landscape Report",
            "customer_persona": f"{name} — Detailed Buyer Persona & ICP Blueprint",
            "swot_analysis": f"{name} — Strategic SWOT Matrix & Defense Plan",
            "marketing_plan": f"{name} — 90-Day Go-To-Market (GTM) Strategy",
            "financial_projection": f"{name} — 3-Year Financial Forecast & Unit Economics Model",
            "startup_proposal": f"{name} — Institutional Partnership & Commercial Proposal"
        }

        title = doc_titles.get(doc_type, f"{name} — {doc_type.replace('_', ' ').title()}")

        prompt = f"""
        Create a complete, beautifully structured, professional markdown document for:
        Document Type: {doc_type}
        Title: {title}
        Startup: {name}
        Industry: {industry}
        Idea: {idea}
        Target Customer: {target_cust} ({btype})
        Custom Instructions: {custom_instructions or 'Provide comprehensive depth, markdown tables, headers, and bullet points.'}

        Return JSON with:
        {{
            "title": "{title}",
            "content": "Full markdown content..."
        }}
        """

        gemini_result = cls._call_gemini_json(prompt)
        if gemini_result and "content" in gemini_result:
            return gemini_result

        # Comprehensive markdown templates
        if doc_type == "pitch_deck":
            content = f"""# {name} — Investor Pitch Deck
*The Next Generation {industry} Platform*

---

## Slide 1: Title & Vision
- **Company**: {name}
- **Tagline**: Revolutionizing {industry} for {target_cust}.
- **Presenter**: Founder & Founding Team

---

## Slide 2: The Problem
- **Current Reality**: {startup.get('problem_being_solved', 'Significant operational inefficiencies and high costs.')}
- **Pain Points**:
  - Inefficient legacy workflows costing hours of wasted effort weekly.
  - Opaque pricing and high setup barriers.
  - Zero localized compliance or native Indian payment experiences.

---

## Slide 3: The Solution
- **Product**: {startup.get('product_description', 'All-in-one platform engineered for modern founders.')}
- **Key Value Drivers**:
  - 10x faster execution speed.
  - Seamless automated workflows.
  - Transparent, accessible pricing model.

---

## Slide 4: Market Size (TAM / SAM / SOM)
| Metric | Scope | Estimated Valuation |
| :--- | :--- | :--- |
| **TAM** | Global/National {industry} Market | $4.2 Billion |
| **SAM** | Target {btype} Segment in India | $650 Million |
| **SOM** | Attainable Year 1–2 Capture | $12 Million |

---

## Slide 5: Business Model & Monetization
- **Model**: {startup.get('business_model', 'Subscription (SaaS)')}
- **Pricing Strategy**: {startup.get('expected_pricing', 'Tiered subscription starting at accessible founder pricing.')}
- **Gross Margins**: Projected at **75%+**.

---

## Slide 6: Competitive Landscape
- **Incumbents**: High price, slow support, heavy setup.
- **{name}'s Moat**: Superior UX, localized Indian integration (UPI, GST), and rapid product iteration velocity.

---

## Slide 7: Go-To-Market (GTM) Strategy
- **Inbound**: Product-led growth with free trial tiers and programmatic SEO.
- **Outbound**: Targeted direct outreach to high-intent {target_cust}.
- **Community**: Co-marketing and strategic channel partnerships.

---

## Slide 8: Financial Traction & Projections
- **Year 1 Target**: 250 paying accounts | ₹45 Lakhs ARR.
- **Year 2 Target**: 1,200 paying accounts | ₹1.80 Cr ARR.
- **Break-Even**: Month 9 post-commercial launch.

---

## Slide 9: The Team
- Experienced operators with deep technical, marketing, and domain expertise in {industry}.

---

## Slide 10: The Ask & Use of Funds
- **Raising**: ₹50 Lakhs (Seed Round)
- **Capital Deployment**:
  - 50% Engineering & Product Velocity
  - 30% Growth & Channel Acquisition
  - 20% Working Capital, Compliance & Reserve
"""
        elif doc_type == "swot_analysis":
            content = f"""# {name} — Strategic SWOT Analysis

---

### 1. Strengths (Internal Advantages)
- **Agile Architecture**: Modern tech stack enables rapid deployment of user-requested features.
- **Clear Value Proposition**: Direct solution targeting explicit pain points of {target_cust}.
- **Lean Operating Model**: Minimal overhead allows profitability at lower customer volumes.
- **Localized Alignment**: Built-in support for Indian compliance, GST, and payment ecosystems.

---

### 2. Weaknesses (Internal Challenges)
- **Early Brand Recognition**: Need to establish credibility against legacy competitors.
- **Resource Constraints**: Limited initial marketing budget ({startup.get('available_budget', '< ₹50,000')}).
- **Single-Founder Dependency**: Critical need to expand operational and engineering bandwidth.

---

### 3. Opportunities (External Tailwinds)
- **Digital India Acceleration**: Rapid expansion of digital payments and cloud adoption across Tier-2/3 cities.
- **Government Backing**: Eligibility for Startup India Seed Fund Scheme (SISFS) and MSME credit support.
- **Fragmented Competitors**: Opportunity to consolidate users frustrated by poor legacy customer support.

---

### 4. Threats (External Risks)
- **Copycat Market Entry**: Low barriers to entry require establishing strong customer data moats.
- **Macro Volatility**: Budget tightening among early-stage customers during economic downturns.
- **Platform Dependency**: Dependency on third-party APIs and payment gateway compliance policies.

---

### Strategic Action Plan
1. **SO Strategy**: Leverage agile speed to secure early market dominance in underserved niches before incumbents react.
2. **WT Strategy**: Protect runway by keeping burn low, focusing strictly on high-retention paying customers.
"""
        else:
            content = f"""# {title}

## Overview for {name}
- **Industry**: {industry}
- **Target Customer**: {target_cust} ({btype})
- **Business Model**: {startup.get('business_model', 'Subscription')}
- **Current Stage**: {startup.get('stage', 'Idea')}

---

## Strategic Objectives
1. **Validation & De-Risking**: Prove customer demand and willingness to pay before committing heavy capital.
2. **Unit Economics Optimization**: Ensure Customer Lifetime Value (LTV) is at least 3x Customer Acquisition Cost (CAC).
3. **Execution Velocity**: Ship updates on a weekly cadence based on real customer feedback.

---

## Tactical Implementation
- **Phase 1**: Direct customer discovery interviews and smoke-test landing page validation.
- **Phase 2**: Closed beta launch with 10–20 engaged pilot users.
- **Phase 3**: Public release, payment gateway activation, and launch campaigns.
"""

        return {
            "title": title,
            "content": content
        }

    @classmethod
    def generate_daily_tasks(cls, startup: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Generates 3-5 prioritized daily startup actions based on current stage and goals.
        """
        name = startup.get("name", "Startup")
        target_cust = startup.get("target_customer", "Target Customers")
        stage = startup.get("stage", "Idea")
        industry = startup.get("industry", "Tech")

        return [
            {
                "title": f"Conduct 3 Customer Problem Discovery Interviews with {target_cust}",
                "why_it_matters": "Your biggest current risk is assuming customer priorities without verified direct dialogue.",
                "step_by_step": [
                    "Identify 3 prospects on LinkedIn or your personal network.",
                    "Ask: 'What is the hardest part about managing [problem] today?'",
                    "Record the exact words and phrases they use to describe their pain."
                ],
                "expected_outcome": "3 interview summaries with documented recurring pain points.",
                "priority": "Urgent",
                "estimated_time": "1.5 hours",
                "category": "Customer Discovery"
            },
            {
                "title": f"Perform Competitor Pricing & Feature Audit in {industry}",
                "why_it_matters": "Understanding what competitors charge helps anchor your pricing and identify feature gaps.",
                "step_by_step": [
                    "Select top 3 competitors in your niche.",
                    "Review their pricing pages and check 1-star reviews on G2/PlayStore.",
                    "Note what features users complain are missing or broken."
                ],
                "expected_outcome": "A comparison sheet with 3 differentiation opportunities.",
                "priority": "High",
                "estimated_time": "45 mins",
                "category": "Market Intelligence"
            },
            {
                "title": "Define Core Value Metric & Draft Landing Page Headline",
                "why_it_matters": "Clear, punchy messaging increases conversion rates on early access signups.",
                "step_by_step": [
                    "Write 3 variations of your value proposition headline.",
                    "Ensure it answers: What is it? Who is it for? What is the main outcome?",
                    "Test it by asking 2 peers if they understand what {name} does in 5 seconds."
                ],
                "expected_outcome": "Validated headline and subheadline for your website.",
                "priority": "Medium",
                "estimated_time": "30 mins",
                "category": "Marketing & Copy"
            }
        ]
