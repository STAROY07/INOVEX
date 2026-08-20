import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lightbulb,
  Users,
  Briefcase,
  UserCheck,
  Flag,
  Target,
  Loader2
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Navbar } from '../components/Navbar';
import confetti from 'canvas-confetti';

export const OnboardingPage = () => {
  const { createStartup } = useStartup();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Step 1: Basic Idea
    name: '',
    business_idea: '',
    problem_being_solved: '',
    product_description: '',
    
    // Step 2: Customer
    target_customer: '',
    customer_age_group: '20-35 young professionals',
    customer_location: 'India (Tier 1 & 2 cities)',
    business_type: 'B2B',
    primary_customer_problem: '',
    
    // Step 3: Business
    industry: 'AI & Enterprise Software',
    business_model: 'Subscription (SaaS)',
    expected_pricing: '₹1,999 / month',
    revenue_model: 'Monthly and annual recurring SaaS subscriptions',
    current_competitors: 'Legacy manual tools, scattered spreadsheets',
    
    // Step 4: Founder
    founder_experience: 'First-time founder with technical / product domain expertise',
    team_size: 'Solo Founder (1)',
    skills: ['Product Design', 'Marketing', 'Software Development'],
    available_budget: '< ₹50,000 (Bootstrapping)',
    time_commitment: 'Full-time',
    
    // Step 5: Stage
    stage: 'Idea',
    
    // Step 6: Goals
    goals: ['Validate idea', 'Build MVP', 'Get customers', 'Create business plan']
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  const toggleGoal = (goal) => {
    setFormData(prev => {
      const goals = prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals };
    });
  };

  const handleNext = () => {
    setError('');
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.business_idea.trim() || !formData.problem_being_solved.trim()) {
        setError('Please fill in the required startup name, idea, and problem statement.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.target_customer.trim()) {
        setError('Please specify your target customer group.');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await createStartup(formData);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/assessment');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit startup details. Please try again.');
      setLoading(false);
    }
  };

  const fillExampleIdea = () => {
    setFormData({
      name: 'QuickCompliance AI',
      business_idea: 'An AI-powered automated GST filing and legal compliance co-pilot for Indian SMBs and freelance agencies.',
      problem_being_solved: 'Small business owners in India waste 15+ hours monthly and incur penalty fines due to complex GST reconciliation and confusing compliance deadlines.',
      product_description: 'A lightweight web dashboard and WhatsApp bot that automatically parses bank statements, calculates ITC (Input Tax Credit), drafts invoices, and alerts founders on filings.',
      target_customer: 'Indian SMB owners, D2C brand founders, and creative agency owners',
      customer_age_group: '25-45 business owners',
      customer_location: 'Pan-India (Tier 1 & Tier 2)',
      business_type: 'B2B',
      primary_customer_problem: 'Expensive CA retainer fees and fear of receiving tax notices due to manual bookkeeping mistakes.',
      industry: 'FinTech / SaaS / LegalTech',
      business_model: 'Subscription (SaaS)',
      expected_pricing: '₹999 / month (Starter) to ₹2,999 / month (Pro)',
      revenue_model: 'Monthly/Annual subscriptions with premium CA review add-on',
      current_competitors: 'ClearTax, Khatabook, local chartered accountants',
      founder_experience: '2 years working in SaaS product design and operations',
      team_size: '2 Co-founders',
      skills: ['Product Strategy', 'Fullstack Development', 'Growth Marketing'],
      available_budget: '₹50,000 - ₹2,00,000',
      time_commitment: 'Full-time',
      stage: 'Idea',
      goals: ['Validate idea', 'Build MVP', 'Get first 20 paying customers', 'DPIIT Recognition']
    });
  };

  const stepsHeader = [
    { num: 1, label: 'Idea', icon: Lightbulb },
    { num: 2, label: 'Customer', icon: Users },
    { num: 3, label: 'Business', icon: Briefcase },
    { num: 4, label: 'Founder', icon: UserCheck },
    { num: 5, label: 'Stage', icon: Flag },
    { num: 6, label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-primary-500 selection:text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        
        {/* Top Header & Example Prefill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
              Step {currentStep} of 6
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Tell INOVEX about your startup idea
            </h1>
          </div>

          <button
            type="button"
            onClick={fillExampleIdea}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-surface-50 hover:bg-surface-100 border border-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Prefill Example Idea</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-6 gap-2 mb-10">
          {stepsHeader.map(s => {
            const Icon = s.icon;
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <div
                key={s.num}
                className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                  isCurrent
                    ? 'bg-primary-600/20 border-primary-500/60 text-white shadow-glow-sm'
                    : isCompleted
                    ? 'bg-surface-50 border-emerald-500/40 text-emerald-400'
                    : 'bg-surface-100/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="text-[11px] font-semibold truncate hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Step Content Container */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-glow-sm">
          
          {/* STEP 1: Basic Idea */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 1 — Basic Idea</h2>
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Startup / Working Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="e.g. InnoHealth, EduBoost, FinFlow"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  The Core Business Idea <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.business_idea}
                  onChange={(e) => updateField('business_idea', e.target.value)}
                  placeholder="In 1-2 sentences, what does your startup do and how does it deliver value?"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Problem Being Solved <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.problem_being_solved}
                  onChange={(e) => updateField('problem_being_solved', e.target.value)}
                  placeholder="What is the exact pain point customers face today? Why is it urgent?"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product / Service Description
                </label>
                <textarea
                  rows={2}
                  value={formData.product_description}
                  onChange={(e) => updateField('product_description', e.target.value)}
                  placeholder="Describe the initial solution or product format (e.g. mobile app, SaaS platform, physical marketplace)."
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Customer */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 2 — Target Customer</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Who is the Target Customer? <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.target_customer}
                  onChange={(e) => updateField('target_customer', e.target.value)}
                  placeholder="e.g. College students, SMB factory owners, D2C retail founders"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Type</label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => updateField('business_type', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="B2B">B2B (Business to Business)</option>
                    <option value="B2C">B2C (Business to Consumer)</option>
                    <option value="B2B2C">B2B2C (Platform / Multi-sided)</option>
                    <option value="D2C">D2C (Direct to Consumer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Age Group</label>
                  <input
                    type="text"
                    value={formData.customer_age_group}
                    onChange={(e) => updateField('customer_age_group', e.target.value)}
                    placeholder="e.g. 18-24, 25-45, All ages"
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Location / Geography</label>
                <input
                  type="text"
                  value={formData.customer_location}
                  onChange={(e) => updateField('customer_location', e.target.value)}
                  placeholder="e.g. India (Metro cities), Global, Rural India"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Customer Problem</label>
                <textarea
                  rows={2}
                  value={formData.primary_customer_problem}
                  onChange={(e) => updateField('primary_customer_problem', e.target.value)}
                  placeholder="What workaround are they currently using that frustrates them?"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Business */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 3 — Industry & Business Model</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Industry / Domain</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="AI & Enterprise Software">AI & Enterprise Software</option>
                    <option value="FinTech & Payments">FinTech & Payments</option>
                    <option value="EdTech & Skill Development">EdTech & Skill Development</option>
                    <option value="HealthTech & Diagnostics">HealthTech & Diagnostics</option>
                    <option value="E-Commerce & D2C">E-Commerce & D2C</option>
                    <option value="AgriTech & Rural Services">AgriTech & Rural Services</option>
                    <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    <option value="CleanTech & Energy">CleanTech & Energy</option>
                    <option value="Media & Creator Economy">Media & Creator Economy</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Business Model</label>
                  <select
                    value={formData.business_model}
                    onChange={(e) => updateField('business_model', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Subscription (SaaS)">Subscription (SaaS)</option>
                    <option value="Marketplace Commission">Marketplace Commission</option>
                    <option value="Freemium + Addons">Freemium + Addons</option>
                    <option value="Direct Sales / One-time">Direct Sales / One-time</option>
                    <option value="Usage-based / API">Usage-based / API</option>
                    <option value="Advertising / Sponsorship">Advertising / Sponsorship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Pricing</label>
                <input
                  type="text"
                  value={formData.expected_pricing}
                  onChange={(e) => updateField('expected_pricing', e.target.value)}
                  placeholder="e.g. ₹499/mo, ₹2,499 one-time, 2.5% transaction fee"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Current Competitors / Alternatives</label>
                <input
                  type="text"
                  value={formData.current_competitors}
                  onChange={(e) => updateField('current_competitors', e.target.value)}
                  placeholder="Who else solves this or what alternative tools do customers use?"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Founder */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 4 — Founder & Team</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Founder Background & Experience</label>
                <input
                  type="text"
                  value={formData.founder_experience}
                  onChange={(e) => updateField('founder_experience', e.target.value)}
                  placeholder="e.g. College student, 3 yrs developer, marketing specialist"
                  className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Available Budget</label>
                  <select
                    value={formData.available_budget}
                    onChange={(e) => updateField('available_budget', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="< ₹50,000">&lt; ₹50,000 (Bootstrapping)</option>
                    <option value="₹50,000 - ₹2,00,000">₹50,000 - ₹2,00,000</option>
                    <option value="₹2,00,000 - ₹10,00,000">₹2,00,000 - ₹10,00,000</option>
                    <option value="> ₹10,00,000">&gt; ₹10,00,000 (Funded / Capital)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Commitment</label>
                  <select
                    value={formData.time_commitment}
                    onChange={(e) => updateField('time_commitment', e.target.value)}
                    className="w-full px-4 py-3 bg-surface-50 text-white text-sm rounded-xl border border-slate-700 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Nights & Weekends">Nights & Weekends</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Team Skills (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['Software Development', 'Product Design / UI', 'Marketing & Sales', 'Domain Expertise', 'Finance & Ops', 'Legal / CA'].map(skill => {
                    const selected = formData.skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selected
                            ? 'bg-primary-600 border-primary-500 text-white shadow-glow-sm'
                            : 'bg-surface-50 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Startup Stage */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 5 — Current Startup Stage</h2>
              <p className="text-xs text-slate-400">Select where you are today in your startup journey.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'Idea', label: 'Idea Stage', desc: 'Just a concept; needs structuring and feasibility check.' },
                  { key: 'Research', label: 'Research', desc: 'Analyzing competitors, market size, and customer personas.' },
                  { key: 'Validation', label: 'Validation', desc: 'Speaking with customers and testing willingness to pay.' },
                  { key: 'MVP', label: 'MVP Building', desc: 'Building prototype or initial version for beta users.' },
                  { key: 'Early Revenue', label: 'Early Revenue', desc: 'First paying users onboarded; optimizing conversions.' },
                  { key: 'Growth', label: 'Growth / Scale', desc: 'Scaling acquisition channels and preparing for funding.' }
                ].map(st => {
                  const selected = formData.stage === st.key;
                  return (
                    <div
                      key={st.key}
                      onClick={() => updateField('stage', st.key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? 'bg-primary-600/20 border-primary-500 text-white shadow-glow-sm'
                          : 'bg-surface-50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <h4 className="font-bold text-sm text-white mb-1">{st.label}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Goals */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold font-display text-white">Step 6 — What do you want help with?</h2>
              <p className="text-xs text-slate-400">Select your top priorities for INOVEX AI to focus on.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Validate idea & talk to users',
                  'Build MVP without overspending',
                  'Acquire first paying customers',
                  'Register company & compliance (India)',
                  'Apply for Startup India & Grants',
                  'Create investor business plan',
                  'Design GTM marketing strategy',
                  'Calculate unit economics & pricing'
                ].map(goal => {
                  const selected = formData.goals.includes(goal);
                  return (
                    <div
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-primary-600/20 border-primary-500 text-white shadow-glow-sm'
                          : 'bg-surface-50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-200">{goal}</span>
                      {selected ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-400" />
                      ) : (
                        <div className="w-4 h-4 rounded border border-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-surface-50 hover:bg-surface-100 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm flex items-center gap-1.5 transition-all"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-accent-cyan hover:opacity-95 text-white text-sm font-bold shadow-glow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing & Generating Assessment...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Assessment & Roadmap</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
