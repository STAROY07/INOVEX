import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Award,
  Milestone,
  CheckSquare,
  Bot,
  FileText,
  FlaskConical,
  ChevronDown,
  Building2,
  Receipt,
  GraduationCap,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/onboarding');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  const faqs = [
    {
      q: "Is INOVEX free to start?",
      a: "Yes! You can sign up, create your startup profile, receive your complete AI idea assessment, generate your 11-stage personalized roadmap, and use the AI Mentor without any subscription fees."
    },
    {
      q: "Is this legal or financial advice?",
      a: "No. INOVEX provides AI-assisted general informational guidance specifically designed to educate founders on compliance, company structures, and startup strategies. It does not replace professional advice from chartered accountants, lawyers, or SEBI-registered advisors."
    },
    {
      q: "Do I need a finished idea?",
      a: "Not at all! Whether you just have a rough 2-sentence concept or already have initial prototype traction, INOVEX helps you pressure-test your assumptions, identify risks, and guide your exact next validation steps."
    },
    {
      q: "Who is INOVEX built for?",
      a: "INOVEX is tailored specifically for students, first-time founders, indie hackers, and young entrepreneurs in India seeking a structured, honest roadmap to build, launch, register, and fund their startups."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-36 overflow-hidden">
        {/* Glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-hero-glow pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-50/80 border border-primary-500/30 text-xs font-semibold text-primary-300 mb-8 shadow-glow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
            Built for founders in India & emerging markets
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
            You have the idea.{' '}
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-primary-300 to-accent-cyan">
              INOVEX gives you the next step.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            An AI-assisted innovation platform that takes your startup idea from validation and assessment to a personalised roadmap and the actions to execute this week.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-base shadow-glow-md hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start with my idea</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-surface-100 hover:bg-surface-50 border border-slate-700/80 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>See how it works</span>
            </a>
          </div>

          {/* Feature Strip Indicators */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3">
              <p className="text-2xl font-bold text-white font-display">8-Dimension</p>
              <p className="text-xs text-slate-400 mt-0.5">Honest AI Idea Scoring</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-primary-400 font-display">11-Stage</p>
              <p className="text-xs text-slate-400 mt-0.5">Execution Roadmap</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-accent-cyan font-display">16-Section</p>
              <p className="text-xs text-slate-400 mt-0.5">Investor Business Plan</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-accent-emerald font-display">India-First</p>
              <p className="text-xs text-slate-400 mt-0.5">GST, DPIIT & Schemes</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid: Everything between idea and action */}
      <section id="features" className="py-24 bg-surface-200/40 border-y border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-400 uppercase">
              Core Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
              Everything between idea and action
            </p>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Stop wandering through conflicting advice. INOVEX structures your journey into validated, actionable milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Idea assessment</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                An honest, scored review of market demand, feasibility, competitive intensity, and risk factors. No fake praise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 border border-cyan-500/30 flex items-center justify-center text-accent-cyan mb-5">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Prioritised actions</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The three to five things to do next, complete with step-by-step instructions and tangible expected outcomes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Startup roadmap</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                From idea to validation, MVP, launch, and funding — guided stage by stage with completion gates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/20 border border-emerald-500/30 flex items-center justify-center text-accent-emerald mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">AI startup mentor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ask anything about pricing, customer discovery, marketing, or compliance with startup context injected.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Business plan</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                A structured 16-section plan you can edit, regenerate section-by-section, and share with investors or mentors.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-panel rounded-2xl p-7 glass-panel-hover">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-white mb-2">Validation evidence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Record interviews, surveys, and experiments so that every strategic pivot rests on concrete proof.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-400 uppercase">
              Methodology
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
              How it works
            </p>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Four clear steps from initial spark to commercial growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative group">
              <span className="font-display font-black text-4xl text-primary-600/40 group-hover:text-primary-400 transition-colors">
                01
              </span>
              <h3 className="text-lg font-bold font-display text-white mt-3 mb-2">
                Describe your idea
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Problem, customer, stage, budget, and goals — five minutes in our guided onboarding is enough.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative group">
              <span className="font-display font-black text-4xl text-accent-cyan/40 group-hover:text-accent-cyan transition-colors">
                02
              </span>
              <h3 className="text-lg font-bold font-display text-white mt-3 mb-2">
                Get assessed
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                INOVEX scores your idea across 8 dimensions and points out hidden blindspots, unit economics, and risks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative group">
              <span className="font-display font-black text-4xl text-purple-500/40 group-hover:text-purple-400 transition-colors">
                03
              </span>
              <h3 className="text-lg font-bold font-display text-white mt-3 mb-2">
                Follow the roadmap
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Work through prioritized daily actions and stage-based tasks tailored to your specific industry.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative group">
              <span className="font-display font-black text-4xl text-emerald-500/40 group-hover:text-accent-emerald transition-colors">
                04
              </span>
              <h3 className="text-lg font-bold font-display text-white mt-3 mb-2">
                Validate and build
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Capture evidence, refine the business plan, register compliant entity, and move towards launch and funding.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* India-First Guidance Section */}
      <section id="india-first" className="py-24 bg-surface-200/50 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-accent-emerald">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tailored for India's Ecosystem
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white leading-tight">
                India-first guidance for modern entrepreneurs
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Structure and registration options, GST basics, Startup India DPIIT recognition, MSME schemes, government grants (SISFS, TIDE 2.0, MUDRA), and a practical compliance checklist — written specifically for founders starting up in India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-100 border border-slate-800">
                  <Building2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Entity Matrix</h4>
                    <p className="text-[11px] text-slate-400">Pvt Ltd vs LLP vs OPC</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-100 border border-slate-800">
                  <Receipt className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Tax & GST Rules</h4>
                    <p className="text-[11px] text-slate-400">₹20L/₹40L Thresholds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-100 border border-slate-800">
                  <GraduationCap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">DPIIT & SISFS</h4>
                    <p className="text-[11px] text-slate-400">Up to ₹20L Non-dilutive</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-100 border border-slate-800">
                  <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">MSME / Udyam</h4>
                    <p className="text-[11px] text-slate-400">Collateral-free loans</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-700/80 shadow-glow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Interactive Preview
                  </span>
                  <span className="text-xs font-semibold text-accent-emerald bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    Verified Checklist
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-surface-50 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">1. DSC & SPICe+ Company Incorporation</span>
                    <span className="text-[10px] text-primary-400 font-bold bg-primary-950 px-2 py-0.5 rounded">MCA Portal</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-50 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">2. PAN, TAN & EPFO Automatic Allocation</span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">CBDT</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-50 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">3. MSME Udyam Registration (100% Free)</span>
                    <span className="text-[10px] text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded">Udyam</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface-50 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-200">4. Startup India DPIIT Recognition & Tax Exemption</span>
                    <span className="text-[10px] text-purple-400 font-bold bg-purple-950 px-2 py-0.5 rounded">Section 80-IAC</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mt-5 italic">
                  *INOVEX provides general informational guidance and is not a substitute for professional legal, tax or financial advice.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-400 uppercase">
              Frequently Asked Questions
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-2">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-white hover:text-primary-300 transition-colors"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-primary-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 bg-surface-100/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-900/60 via-surface-100 to-surface-100 border border-primary-500/30 p-8 sm:p-14 text-center relative overflow-hidden shadow-glow-md">
            
            <div className="max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
                Stop wondering what to do next
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Add your idea and get an assessment, personalized roadmap and prioritized action list in minutes.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleStart}
                  className="px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-base shadow-glow-md hover:shadow-glow-lg transition-all inline-flex items-center gap-2"
                >
                  <span>Get started free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-surface-300 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-white text-sm">INOVEX</span>
            <span className="text-slate-500">— AI Startup Mentor Platform</span>
          </div>

          <p className="text-slate-500 max-w-md">
            INOVEX provides general informational guidance, not legal, tax or financial advice.
          </p>

          <p className="text-slate-500">
            © {new Date().getFullYear()} INOVEX. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
