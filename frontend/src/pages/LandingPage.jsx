import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
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
  TrendingUp
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-primary-100/40 via-indigo-50/30 to-transparent pointer-events-none -z-10 blur-2xl" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-primary-200/30 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-semibold text-primary-800 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Built for founders in India & emerging markets
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-950 leading-[1.15]">
            You have the idea.{' '}
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-indigo-600 to-cyan-600">
              INOVEX gives you the next step.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            An AI-assisted innovation platform that takes your startup idea from validation and assessment to a personalised roadmap and the actions to execute this week.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Start with my idea</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>See how it works</span>
            </a>
          </div>

          {/* Feature Strip Indicators */}
          <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-extrabold text-slate-900 font-display">8-Dimension</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Honest AI Idea Scoring</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-extrabold text-primary-600 font-display">11-Stage</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Execution Roadmap</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-extrabold text-cyan-600 font-display">16-Section</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Investor Business Plan</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-extrabold text-emerald-600 font-display">India-First</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">GST, DPIIT & Schemes</p>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid: Everything between idea and action */}
      <section id="features" className="py-24 bg-slate-50 border-y border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-600 uppercase bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-200">
              Core Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mt-3">
              Everything between idea and action
            </p>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Stop wandering through conflicting advice. INOVEX structures your journey into validated, actionable milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Idea assessment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                An honest, scored review of market demand, feasibility, competitive intensity, and risk factors. No fake praise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-5">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Prioritised actions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                The three to five things to do next, complete with step-by-step instructions and tangible expected outcomes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
                <Milestone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Startup roadmap</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                From idea to validation, MVP, launch, and funding — guided stage by stage with completion gates.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">AI startup mentor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Ask anything about pricing, customer discovery, marketing, or compliance with startup context injected.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Business plan</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A structured 16-section plan you can edit, regenerate section-by-section, and share with investors or mentors.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 mb-2">Validation evidence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Record interviews, surveys, and experiments so that every strategic pivot rests on concrete proof.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-600 uppercase bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-200">
              Methodology
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mt-3">
              How it works
            </p>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Four clear steps from initial spark to commercial growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all relative group">
              <span className="font-display font-black text-4xl text-primary-600/30 group-hover:text-primary-600 transition-colors">
                01
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 mt-3 mb-2">
                Describe your idea
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Problem, customer, stage, budget, and goals — five minutes in our guided onboarding is enough.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all relative group">
              <span className="font-display font-black text-4xl text-cyan-600/30 group-hover:text-cyan-600 transition-colors">
                02
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 mt-3 mb-2">
                Get assessed
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                INOVEX scores your idea across 8 dimensions and points out hidden blindspots, unit economics, and risks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all relative group">
              <span className="font-display font-black text-4xl text-purple-600/30 group-hover:text-purple-600 transition-colors">
                03
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 mt-3 mb-2">
                Follow the roadmap
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Work through prioritized daily actions and stage-based tasks tailored to your specific industry.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all relative group">
              <span className="font-display font-black text-4xl text-emerald-600/30 group-hover:text-emerald-600 transition-colors">
                04
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 mt-3 mb-2">
                Validate and build
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Capture evidence, refine the business plan, register compliant entity, and move towards launch and funding.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* India-First Guidance Section */}
      <section id="india-first" className="py-24 bg-slate-50 border-t border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tailored for India's Ecosystem
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 leading-tight">
                India-first guidance for modern entrepreneurs
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Structure and registration options, GST basics, Startup India DPIIT recognition, MSME schemes, government grants (SISFS, TIDE 2.0, MUDRA), and a practical compliance checklist — written specifically for founders starting up in India.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <Building2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Entity Matrix</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pvt Ltd vs LLP vs OPC</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <Receipt className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Tax & GST Rules</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">₹20L/₹40L Thresholds</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <GraduationCap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">DPIIT & SISFS</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Up to ₹20L Non-dilutive</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">MSME / Udyam</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Collateral-free loans</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg shadow-slate-200/50">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Interactive Preview
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Verified Checklist
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">1. DSC & SPICe+ Company Incorporation</span>
                    <span className="text-[10px] text-primary-700 font-bold bg-primary-50 border border-primary-200 px-2 py-0.5 rounded">MCA Portal</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">2. PAN, TAN & EPFO Automatic Allocation</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">CBDT</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">3. MSME Udyam Registration (100% Free)</span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">Udyam</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-800">4. Startup India DPIIT Recognition & Tax Exemption</span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">Section 80-IAC</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-5 italic">
                  *INOVEX provides general informational guidance and is not a substitute for professional legal, tax or financial advice.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary-600 uppercase bg-primary-50 inline-block px-3 py-1 rounded-full border border-primary-200">
              Frequently Asked Questions
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 mt-3">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-semibold text-slate-900 hover:text-primary-600 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-primary-600' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-indigo-700 p-8 sm:p-14 text-center relative overflow-hidden shadow-xl shadow-primary-500/20 text-white">
            
            <div className="max-w-2xl mx-auto space-y-5">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
                Stop wondering what to do next
              </h2>
              <p className="text-primary-100 text-sm sm:text-base">
                Add your idea and get an assessment, personalized roadmap and prioritized action list in minutes.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleStart}
                  className="px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-primary-700 font-bold text-base shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
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
      <footer className="mt-auto border-t border-slate-200 bg-white py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-slate-900 text-sm">INOVEX</span>
            <span className="text-slate-400">— AI Startup Mentor Platform</span>
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
