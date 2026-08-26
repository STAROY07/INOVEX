import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
  Target
} from 'lucide-react';
import { useStartup } from '../context/StartupContext';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { RadarScoreChart } from '../components/RadarScoreChart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import api from '../api/client';

export const AssessmentPage = () => {
  const { activeStartup, hasStartup } = useStartup();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reevaluating, setReevaluating] = useState(false);

  useEffect(() => {
    if (!activeStartup) {
      setLoading(false);
      return;
    }

    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/startups/${activeStartup.id}/assessment`);
        setAssessment(res.data);
      } catch (err) {
        console.error("Assessment fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [activeStartup]);

  const handleReevaluate = async () => {
    if (!activeStartup) return;
    setReevaluating(true);
    try {
      const res = await api.post(`/startups/${activeStartup.id}/assessment/re-evaluate`);
      setAssessment(res.data);
    } catch (err) {
      console.error("Re-evaluation failed:", err);
    } finally {
      setReevaluating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-primary-700 bg-primary-50 border-primary-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const dimensions = [
    { label: 'Market Demand', score: assessment?.market_demand_score || 0, desc: 'Real customer willingness to pay and total addressable need' },
    { label: 'Problem Strength', score: assessment?.problem_strength_score || 0, desc: 'Pain intensity, frequency, and urgency of the core problem' },
    { label: 'Feasibility', score: assessment?.feasibility_score || 0, desc: 'Technical complexity, initial capital requirements, and execution ease' },
    { label: 'Competition Defensibility', score: assessment?.competition_score || 0, desc: 'Moat against incumbents and ease of replication' },
    { label: 'Business Model', score: assessment?.business_model_score || 0, desc: 'Unit economics, gross margins, and monetization logic' },
    { label: 'Revenue Potential', score: assessment?.revenue_potential_score || 0, desc: 'Recurring revenue ceiling and lifetime customer value' },
    { label: 'Risk & Stability', score: assessment?.risk_score || 0, desc: 'Regulatory, legal, and operational downside protection' },
    { label: 'Scalability', score: assessment?.scalability_score || 0, desc: 'Growth speed across Indian regions without proportional cost' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header
          setMobileOpen={setMobileOpen}
          pageTitle="AI Idea Assessment"
          pageSubtitle="Rigorous, multi-dimensional feasibility review and blindspot diagnosis"
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {!hasStartup ? (
            <EmptyState
              icon={Award}
              title="No startup found"
              description="Create a startup idea first to generate your AI assessment."
              actionLabel="Describe Idea"
              onAction={() => navigate('/onboarding')}
            />
          ) : loading ? (
            <LoadingSpinner message="Analyzing startup idea..." submessage="Evaluating market demand, unit economics, regulatory compliance, and competition in India..." />
          ) : (
            <>
              {/* TOP HEADER & OVERALL SCORE */}
              <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                      Executive Evaluation
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {activeStartup?.stage} Stage
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-2">
                    {activeStartup?.name} — Feasibility Score
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    {activeStartup?.business_idea}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block uppercase font-bold">Overall Score</span>
                    <span className="text-4xl sm:text-5xl font-black font-display text-primary-600">
                      {assessment?.overall_score || 0}
                    </span>
                    <span className="text-slate-400 text-sm font-bold">/100</span>
                  </div>

                  <button
                    onClick={handleReevaluate}
                    disabled={reevaluating}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    title="Re-evaluate Assessment"
                  >
                    <RefreshCw className={`w-5 h-5 ${reevaluating ? 'animate-spin text-primary-600' : ''}`} />
                  </button>
                </div>
              </div>

              {/* RECOMMENDED IMMEDIATE ACTION */}
              {assessment?.recommended_next_action && (
                <div className="rounded-2xl p-6 bg-gradient-to-r from-primary-600 to-indigo-600 border border-primary-500 shadow-md shadow-primary-500/20 text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Immediate Recommended Action (This Week)
                      </span>
                      <p className="text-base font-bold text-white mt-1 leading-snug">
                        {assessment.recommended_next_action}
                      </p>
                      <div className="mt-3.5 flex items-center gap-3">
                        <button
                          onClick={() => navigate('/mentor')}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-primary-700 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Consult AI Mentor on Execution</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate('/actions')}
                          className="px-3.5 py-2 rounded-xl bg-primary-700/80 hover:bg-primary-700 text-white text-xs font-semibold border border-primary-400/40 transition-colors cursor-pointer"
                        >
                          Add to Daily Tasks
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RADAR & DETAILED VERDICT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Radar Chart */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-slate-900 mb-1">
                      8-Dimension Feasibility Radar
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Balanced view of demand, feasibility, competition, and risk
                    </p>
                    <RadarScoreChart assessment={assessment} />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center italic mt-2">
                    Scores calibrated against early-stage benchmarks in {activeStartup?.industry}.
                  </p>
                </div>

                {/* Honest Executive Verdict */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-primary-600" />
                      <h3 className="text-base font-bold font-display text-slate-900">
                        Honest Executive Verdict
                      </h3>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {assessment?.detailed_verdict ? (
                        assessment.detailed_verdict.split('\n\n').map((para, i) => (
                          <p key={i}>{para}</p>
                        ))
                      ) : (
                        <p>
                          {activeStartup?.name} has solid baseline potential. However, entering as a {activeStartup?.stage}-stage venture with a {activeStartup?.available_budget} budget means premature coding or marketing spend will be fatal. The immediate priority is customer problem discovery before building complex software.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-100">
                    <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Target Customer</span>
                      <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{activeStartup?.target_customer}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Model</span>
                      <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{activeStartup?.business_model}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Pricing</span>
                      <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{activeStartup?.expected_pricing || 'TBD'}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-semibold block">Budget</span>
                      <span className="text-xs font-bold text-slate-900 truncate block mt-0.5">{activeStartup?.available_budget}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 8 DIMENSIONS GRID */}
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 mb-4">
                  Dimension-by-Dimension Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dimensions.map((dim, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{dim.label}</span>
                        <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getScoreColor(dim.score)}`}>
                          {dim.score} / 100
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                          className="bg-primary-600 h-full rounded-full transition-all"
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{dim.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-QUADRANT ANALYSIS: STRENGTHS, WEAKNESSES, RISKS, OPPORTUNITIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold font-display text-slate-900">Identified Strengths</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.strengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Honest Weaknesses */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold font-display text-slate-900">Critical Weaknesses & Gaps</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.weaknesses || []).map((w, i) => (
                      <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                    <h3 className="text-base font-bold font-display text-slate-900">Execution & Market Risks</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.risks || []).map((r, i) => (
                      <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities & Missing Info */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-base font-bold font-display text-slate-900">Opportunities & Blindspots</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.opportunities || []).map((o, i) => (
                      <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-2.5 bg-cyan-50/50 p-3 rounded-xl border border-cyan-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0 mt-1.5" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </>
          )}

        </main>
      </div>
    </div>
  );
};
