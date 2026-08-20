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
  HelpCircle,
  ArrowRight,
  TrendingUp,
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
    if (score >= 80) return 'text-accent-emerald bg-emerald-500/10 border-emerald-500/30';
    if (score >= 65) return 'text-primary-400 bg-primary-500/10 border-primary-500/30';
    if (score >= 50) return 'text-accent-amber bg-amber-500/10 border-amber-500/30';
    return 'text-accent-rose bg-rose-500/10 border-rose-500/30';
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
    <div className="min-h-screen bg-background flex">
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
              <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-surface-100 via-surface-100 to-primary-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-glow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                      Executive Evaluation
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {activeStartup?.stage} Stage
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                    {activeStartup?.name} — Feasibility Score
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                    {activeStartup?.business_idea}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-semibold">Overall Score</span>
                    <span className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-cyan">
                      {assessment?.overall_score || 0}
                    </span>
                    <span className="text-slate-500 text-sm">/100</span>
                  </div>

                  <button
                    onClick={handleReevaluate}
                    disabled={reevaluating}
                    className="p-3 rounded-xl bg-surface-50 hover:bg-surface-200 border border-slate-700 text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    title="Re-evaluate Assessment"
                  >
                    <RefreshCw className={`w-5 h-5 ${reevaluating ? 'animate-spin text-primary-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* RECOMMENDED IMMEDIATE ACTION */}
              {assessment?.recommended_next_action && (
                <div className="rounded-2xl p-6 bg-gradient-to-r from-primary-900/50 via-surface-100 to-surface-100 border border-primary-500/40 shadow-glow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-600/30 border border-primary-400/50 flex items-center justify-center text-accent-cyan flex-shrink-0">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                        Immediate Recommended Action (This Week)
                      </span>
                      <p className="text-base font-bold text-white mt-1 leading-snug">
                        {assessment.recommended_next_action}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => navigate('/mentor')}
                          className="px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-semibold shadow-glow-sm transition-all flex items-center gap-1.5"
                        >
                          <span>Consult AI Mentor on Execution</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate('/actions')}
                          className="px-3 py-1.5 rounded-lg bg-surface-50 hover:bg-surface-200 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
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
                <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold font-display text-white mb-1">
                      8-Dimension Feasibility Radar
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Balanced view of demand, feasibility, competition, and risk
                    </p>
                    <RadarScoreChart assessment={assessment} />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center italic mt-2">
                    Scores calibrated against early-stage benchmarks in {activeStartup?.industry}.
                  </p>
                </div>

                {/* Honest Executive Verdict */}
                <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-accent-cyan" />
                      <h3 className="text-base font-bold font-display text-white">
                        Honest Executive Verdict
                      </h3>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 bg-surface-50 p-4 rounded-xl border border-slate-800">
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

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-800">
                    <div className="text-center p-2 rounded-lg bg-surface-50">
                      <span className="text-[10px] text-slate-400 block">Target Customer</span>
                      <span className="text-xs font-bold text-white truncate block">{activeStartup?.target_customer}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-surface-50">
                      <span className="text-[10px] text-slate-400 block">Model</span>
                      <span className="text-xs font-bold text-white truncate block">{activeStartup?.business_model}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-surface-50">
                      <span className="text-[10px] text-slate-400 block">Pricing</span>
                      <span className="text-xs font-bold text-white truncate block">{activeStartup?.expected_pricing || 'TBD'}</span>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-surface-50">
                      <span className="text-[10px] text-slate-400 block">Budget</span>
                      <span className="text-xs font-bold text-white truncate block">{activeStartup?.available_budget}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 8 DIMENSIONS GRID */}
              <div>
                <h3 className="text-lg font-bold font-display text-white mb-4">
                  Dimension-by-Dimension Breakdown
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dimensions.map((dim, idx) => (
                    <div key={idx} className="glass-card rounded-xl p-4 border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-200">{dim.label}</span>
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${getScoreColor(dim.score)}`}>
                          {dim.score} / 100
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                          className="bg-primary-500 h-full rounded-full transition-all"
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{dim.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-QUADRANT ANALYSIS: STRENGTHS, WEAKNESSES, RISKS, OPPORTUNITIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
                    <h3 className="text-base font-bold font-display text-white">Identified Strengths</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.strengths || []).map((s, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-surface-50 p-3 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Honest Weaknesses */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-accent-amber" />
                    <h3 className="text-base font-bold font-display text-white">Critical Weaknesses & Gaps</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.weaknesses || []).map((w, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-surface-50 p-3 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-accent-rose" />
                    <h3 className="text-base font-bold font-display text-white">Execution & Market Risks</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.risks || []).map((r, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-surface-50 p-3 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 mt-1.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities & Missing Info */}
                <div className="glass-panel rounded-2xl p-6 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-accent-cyan" />
                    <h3 className="text-base font-bold font-display text-white">Opportunities & Blindspots</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {(assessment?.opportunities || []).map((o, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2.5 bg-surface-50 p-3 rounded-xl border border-slate-800/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
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
