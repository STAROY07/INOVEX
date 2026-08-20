from typing import List, Dict, Any

SEED_LEARNING_RESOURCES: List[Dict[str, Any]] = [
    {
        "title": "The Mom Test: How to Talk to Customers When Everyone is Lying to You",
        "category": "Idea Validation",
        "description": "Essential framework for interviewing customers without asking leading questions or getting fake positive encouragement.",
        "read_time": "6 min read",
        "difficulty": "Beginner",
        "content": "When talking to customers, never ask if they like your idea. Instead, ask about specific events in the past, how they solved the problem, and how much time/money they spent. If they haven't searched for a solution, they don't really have the problem.",
        "key_takeaways": [
            "Talk about their life and habits, not your idea.",
            "Ask about specific past actions, not hypothetical future promises.",
            "Compliments are the biggest red herring in customer discovery."
        ],
        "action_steps": [
            "Prepare 5 open-ended questions focused on past behavior.",
            "Schedule 5 discovery chats with target users this week."
        ],
        "tags": ["Validation", "Customer Discovery", "User Interviews"]
    },
    {
        "title": "Bottom-Up Market Sizing for Indian Founders (TAM, SAM, SOM)",
        "category": "Market Research",
        "description": "How to calculate realistic market sizes that investors take seriously instead of claiming a vague trillion-dollar market.",
        "read_time": "8 min read",
        "difficulty": "Intermediate",
        "content": "Top-down market sizing ('If we get 1% of China/India') is immediately dismissed by seasoned investors. Bottom-up sizing multiplies the realistic number of buyers by your expected annual contract value (ACV).",
        "key_takeaways": [
            "SOM = Reachable target accounts in Year 1-2 × Annual Price.",
            "SAM = Total addressable target market within your geographic/regulatory segment.",
            "TAM = Global theoretical ceiling if you captured 100% of the industry."
        ],
        "action_steps": [
            "Count the exact number of prospective businesses/individuals in your city/state.",
            "Multiply by your planned annual pricing to arrive at Year 1 SOM."
        ],
        "tags": ["Market Size", "Finance", "Investor Pitch"]
    },
    {
        "title": "Designing High-Margin Unit Economics & SaaS Pricing",
        "category": "Business Model",
        "description": "Calculate Customer Acquisition Cost (CAC), Lifetime Value (LTV), Payback Period, and Churn in the Indian context.",
        "read_time": "7 min read",
        "difficulty": "Intermediate",
        "content": "A healthy startup maintains an LTV to CAC ratio greater than 3:1 with a CAC payback period under 12 months. In price-sensitive markets like India, packaging value into tiers and annual pre-payments provides vital cash buffers.",
        "key_takeaways": [
            "Gross Margin should target 70%+ for software, 35%+ for hardware/D2C.",
            "Charge on a metric that expands as the customer succeeds (seats, transactions, volume).",
            "Always include annual billing with a 15-20% discount to generate upfront capital."
        ],
        "action_steps": [
            "Calculate your direct cost per active user/account per month.",
            "Set your baseline price at minimum 4x your direct cost."
        ],
        "tags": ["Pricing", "Unit Economics", "Monetization"]
    },
    {
        "title": "Zero-Dollar Organic Marketing & Cold Outbound Playbook",
        "category": "Marketing",
        "description": "How early-stage founders can acquire their first 100 customers without burning capital on paid ads.",
        "read_time": "9 min read",
        "difficulty": "Beginner",
        "content": "Direct founder outreach, programmatic SEO, and building in public consistently outperform early paid advertising. Identify where your target audience seeks solutions and contribute genuine expertise.",
        "key_takeaways": [
            "Cold outreach should be 80% about the prospect's problem and 20% about your tool.",
            "Publish tactical teardowns and case studies on LinkedIn and Twitter/X.",
            "Create free interactive tools (calculators, templates, checklists) as lead magnets."
        ],
        "action_steps": [
            "Draft a 3-sentence personalized cold email template.",
            "Send to 20 targeted prospects on LinkedIn."
        ],
        "tags": ["Growth", "Marketing", "Cold Outreach", "B2B"]
    },
    {
        "title": "Incorporating in India: Pvt Ltd vs. LLP vs. Sole Proprietorship",
        "category": "Legal Basics",
        "description": "A founder's complete guide to selecting the right entity type, SPICe+ registration, and compliance overhead.",
        "read_time": "10 min read",
        "difficulty": "Beginner",
        "content": "Choose Private Limited if you intend to raise venture capital or issue ESOPs. Choose LLP if you are bootstrapping and want limited liability protection with minimum annual audit burden.",
        "key_takeaways": [
            "Pvt Ltd is mandatory for issuing equity shares to institutional investors.",
            "LLP has no mandatory audit requirement if turnover is under ₹40 Lakhs / capital under ₹25 Lakhs.",
            "Never use Sole Proprietorship if you have legal liability or contractual risks."
        ],
        "action_steps": [
            "Decide on your 12-month funding goal.",
            "Obtain Digital Signature Certificates (DSC) for all directors."
        ],
        "tags": ["Legal", "Registration", "India", "Compliance"]
    },
    {
        "title": "Startup India Seed Fund Scheme (SISFS) & Government Grants Guide",
        "category": "Funding",
        "description": "Step-by-step process to secure up to ₹20 Lakhs grant or ₹50 Lakhs debt under DPIIT schemes.",
        "read_time": "8 min read",
        "difficulty": "Intermediate",
        "content": "The Startup India Seed Fund Scheme provides financial assistance to startups for proof of concept, prototype development, product trials, and market entry through approved incubators across India.",
        "key_takeaways": [
            "Must be a DPIIT-recognized startup incorporated less than 2 years ago.",
            "Grants up to ₹20 Lakhs are non-dilutive (no equity taken).",
            "Apply through incubators aligned with your specific technology domain."
        ],
        "action_steps": [
            "Complete DPIIT recognition on StartupIndia.gov.in.",
            "Select 3 partner incubators on the SISFS portal and submit your pitch."
        ],
        "tags": ["Government Schemes", "Grants", "Funding", "SISFS"]
    },
    {
        "title": "Building a Minimum Viable Product (MVP) in 14 Days",
        "category": "MVP Development",
        "description": "How to ruthlessly scope and ship an MVP without falling into the perfectionist feature trap.",
        "read_time": "6 min read",
        "difficulty": "Beginner",
        "content": "An MVP is not a broken product; it is a complete solution to a narrow problem. Pick the single core workflow that delivers immediate value and ignore everything else for version 1.0.",
        "key_takeaways": [
            "If you are not embarrassed by the first version of your product, you've launched too late.",
            "Use modern boilerplate and off-the-shelf APIs for auth, payments, and emailing.",
            "Deploy to a live URL and test with real users immediately."
        ],
        "action_steps": [
            "List every planned feature and strike out 70% of them.",
            "Set a hard release deadline 2 weeks from today."
        ],
        "tags": ["MVP", "Product", "Engineering"]
    },
    {
        "title": "B2B Sales for Technical Founders: From Lead to Closed Deal",
        "category": "Sales",
        "description": "Master the discovery call, enterprise objection handling, and contract negotiation in India.",
        "read_time": "11 min read",
        "difficulty": "Intermediate",
        "content": "Technical founders often over-explain product features instead of diagnosing business pain. In B2B sales, your role is that of a trusted consultant identifying ROI and implementation timelines.",
        "key_takeaways": [
            "Listen 70% of the time, speak 30% of the time on discovery calls.",
            "Always identify the economic buyer, champion, and procurement gatekeeper.",
            "Never end a call without scheduling the exact next calendar date and time."
        ],
        "action_steps": [
            "Build a 1-page sales deck highlighting customer ROI.",
            "Create a pipeline spreadsheet tracking Stage, Value, and Next Step."
        ],
        "tags": ["Sales", "B2B", "Revenue"]
    }
]

LEGAL_STRUCTURES_INFO = [
    {
        "name": "Private Limited Company (Pvt Ltd)",
        "ideal_for": "Founders seeking Venture Capital, Angel Investment, or issuing ESOPs to employees.",
        "pros": [
            "Separate legal identity with limited liability protection.",
            "Globally recognized standard for VC and institutional funding.",
            "Ability to create stock option pools (ESOPs) for talent attraction.",
            "Transfer of shares is clean and standardized."
        ],
        "cons": [
            "Higher statutory compliance cost (statutory audits, ROC filings).",
            "Mandatory board meetings and AGM documentation.",
            "Requires minimum 2 directors and 2 shareholders."
        ],
        "estimated_cost": "₹6,000 - ₹12,000 (Govt + Professional fees)",
        "timeline": "7 - 14 business days via SPICe+",
        "recommended": True
    },
    {
        "name": "Limited Liability Partnership (LLP)",
        "ideal_for": "Bootstrapped startups, service agencies, and consulting ventures.",
        "pros": [
            "Limited liability protection for all partners.",
            "Significantly lower compliance burden than Pvt Ltd.",
            "No mandatory statutory audit if turnover is < ₹40 Lakhs and capital is < ₹25 Lakhs.",
            "No dividend distribution tax on profit withdrawal."
        ],
        "cons": [
            "Cannot raise equity investment from VC funds or issue ESOPs.",
            "FDI (Foreign Direct Investment) rules are more restrictive.",
            "Requires minimum 2 designated partners."
        ],
        "estimated_cost": "₹4,000 - ₹8,000",
        "timeline": "10 - 15 business days",
        "recommended": False
    },
    {
        "name": "One Person Company (OPC)",
        "ideal_for": "Solo founders who want limited liability without taking immediate co-founders.",
        "pros": [
            "Single shareholder ownership with corporate legal identity.",
            "Limited liability protection for personal assets.",
            "Less operational friction than multi-director Pvt Ltd."
        ],
        "cons": [
            "Cannot issue equity shares to new investors without converting to Pvt Ltd.",
            "Mandatory nominee director requirement.",
            "Higher compliance compared to Sole Proprietorship."
        ],
        "estimated_cost": "₹6,000 - ₹10,000",
        "timeline": "7 - 12 business days",
        "recommended": False
    },
    {
        "name": "Sole Proprietorship",
        "ideal_for": "Solo freelancers, local trade testing, or ultra-early micro-experiments.",
        "pros": [
            "Zero incorporation cost; minimal regulatory compliance.",
            "Total control over all profits and operations.",
            "Can start operating immediately with GST / MSME / Shop Act."
        ],
        "cons": [
            "Unlimited personal liability (personal assets at risk for business debts).",
            "Cannot raise investment or sell equity.",
            "Lacks institutional credibility for enterprise B2B contracts."
        ],
        "estimated_cost": "₹1,000 - ₹2,500 (Basic registration)",
        "timeline": "1 - 3 business days",
        "recommended": False
    }
]

GOVT_SCHEMES_DIRECTORY = [
    {
        "name": "Startup India Seed Fund Scheme (SISFS)",
        "department": "DPIIT, Ministry of Commerce and Industry",
        "grant_amount": "Up to ₹20 Lakhs (Grant) / Up to ₹50 Lakhs (Convertible Debenture / Debt)",
        "eligibility": "DPIIT-recognized startup incorporated within 2 years, with viable prototype or commercial traction.",
        "link": "https://seedfund.startupindia.gov.in/",
        "focus_areas": ["All Sectors", "DeepTech", "AI", "Healthcare", "Agriculture", "SaaS"],
        "stage": "Proof of Concept / Early Prototype"
    },
    {
        "name": "Credit Guarantee Scheme for Startups (CGTMSE)",
        "department": "Ministry of MSME & SIDBI",
        "grant_amount": "Collateral-free credit loans up to ₹5 Crore",
        "eligibility": "DPIIT-recognized startups with proven revenue or strong borrower rating through member lending institutions.",
        "link": "https://www.cgtmse.in/",
        "focus_areas": ["Manufacturing", "Services", "Technology", "Export"],
        "stage": "Early Revenue / Growth"
    },
    {
        "name": "MeitY TIDE 2.0 (Technology Incubation & Development of Entrepreneurs)",
        "department": "Ministry of Electronics & Information Technology (MeitY)",
        "grant_amount": "₹4 Lakhs (Entrepreneur-in-Residence) / ₹7 Lakhs (Grant) / ₹40 Lakhs (Scale-up)",
        "eligibility": "Tech startups leveraging IoT, AI, Blockchain, Cybersecurity, Robotics or Electronics.",
        "link": "https://meitystartups.in/",
        "focus_areas": ["ICT", "AI/ML", "Cybersecurity", "IoT", "Healthcare Tech"],
        "stage": "Idea / Prototype / Early Traction"
    },
    {
        "name": "BIRAC BIG (Biotechnology Ignition Grant)",
        "department": "Biotechnology Industry Research Assistance Council (BIRAC)",
        "grant_amount": "Up to ₹50 Lakhs (Non-dilutive Grant)",
        "eligibility": "Biotech, HealthTech, AgriTech, MedTech, and Bio-informatics startups under 5 years old.",
        "link": "https://birac.nic.in/big.php",
        "focus_areas": ["Biotech", "HealthTech", "Diagnostics", "Bio-Agri"],
        "stage": "Proof of Concept"
    },
    {
        "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "department": "Ministry of Finance",
        "grant_amount": "Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L)",
        "eligibility": "Non-corporate, non-farm small and micro enterprises for working capital and equipment.",
        "link": "https://www.mudra.org.in/",
        "focus_areas": ["Micro Enterprises", "Retail", "Small Services", "Manufacturing"],
        "stage": "Early Operations"
    }
]
